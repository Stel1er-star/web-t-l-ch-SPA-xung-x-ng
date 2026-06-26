const AppointmentModel = require('../models/AppointmentModel');
const ServiceModel = require('../models/ServiceModel');
const db = require('../db');

exports.getAll = async (req, res) => {
  try {
    const filters = {};
    if (req.query.status)   filters.status = req.query.status;
    if (req.query.date)     filters.date = req.query.date;
    if (req.query.staffId)  filters.staffId = req.query.staffId;
    if (req.query.dateFrom) filters.dateFrom = req.query.dateFrom;
    if (req.query.dateTo)   filters.dateTo = req.query.dateTo;

    // Customers can only see their own appointments
    if (req.user.role === 'customer') filters.customerId = req.user.id;
    // Doctors can only see their own appointments
    if (req.user.role === 'doctor')   filters.staffId = req.user.id;

    const appointments = await AppointmentModel.findAll(filters);
    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.getOne = async (req, res) => {
  try {
    const appt = await AppointmentModel.findById(req.params.id);
    if (!appt) return res.status(404).json({ error: 'Không tìm thấy lịch hẹn' });

    // Auth check
    if (req.user.role === 'customer' && appt.customerId !== req.user.id)
      return res.status(403).json({ error: 'Không có quyền truy cập' });
    if (req.user.role === 'doctor' && appt.staffId !== req.user.id)
      return res.status(403).json({ error: 'Không có quyền truy cập' });

    res.json(appt);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.getMyAppointments = async (req, res) => {
  try {
    const appointments = await AppointmentModel.findByCustomer(req.user.id);
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.getStaffAppointments = async (req, res) => {
  try {
    const staffId = req.user.role === 'doctor' ? req.user.id : req.params.staffId;
    const date = req.query.date || null;
    const appointments = await AppointmentModel.findByStaff(staffId, date);
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.getAvailableSlots = async (req, res) => {
  try {
    const { staffId, date, serviceId } = req.query;
    if (!staffId || !date || !serviceId) return res.status(400).json({ error: 'Thiếu thông tin' });

    const service = await ServiceModel.findById(serviceId);
    if (!service) return res.status(404).json({ error: 'Không tìm thấy dịch vụ' });

    const ShiftModel = require('../models/ShiftModel');
    const slots = await ShiftModel.getAvailableSlots(staffId, date, service.duration);
    res.json({ slots, serviceDuration: service.duration });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.create = async (req, res) => {
  try {
    const { staffId, serviceId, date, time, note, depositPaid } = req.body;
    if (!staffId || !serviceId || !date || !time) return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });

    const service = await ServiceModel.findById(serviceId);
    if (!service) return res.status(404).json({ error: 'Dịch vụ không tồn tại' });

    // Check for scheduling conflict
    const conflict = await AppointmentModel.checkConflict(staffId, date, time, service.duration);
    if (conflict) return res.status(409).json({ error: 'Khung giờ này đã có lịch hẹn khác. Vui lòng chọn giờ khác.' });

    const id = AppointmentModel.generateId();
    const appt = await AppointmentModel.create({
      id,
      customerId: req.user.id,
      staffId,
      serviceId,
      date,
      time,
      price: service.price,
      note: note || null,
      depositPaid: depositPaid ? 1 : 0
    });

    // Create notification for doctor
    await db.query(
      `INSERT INTO Notifications (id, userId, title, message, type, link) VALUES (?,?,?,?,?,?)`,
      [`n${Date.now()}_d`, staffId, 'Lịch hẹn mới',
       `Khách hàng mới đặt lịch ${service.name} vào ${time} ngày ${date}`,
       'appointment', '/doctor/appointments.html']
    );

    // Create notification for all admins
    const [admins] = await db.query(`SELECT id FROM Users WHERE role = 'admin' AND is_active = 1`);
    for (const admin of admins) {
      await db.query(
        `INSERT INTO Notifications (id, userId, title, message, type, link) VALUES (?,?,?,?,?,?)`,
        [`n${Date.now()}_a${admin.id}`, admin.id, 'Lịch hẹn mới',
         `Khách ${req.user.name || 'Hàng'} vừa đặt lịch ${service.name} với BS ${appt.staffName || ''} vào ${time} ngày ${date}`,
         'appointment', '/admin/appointments.html']
      );
    }

    res.status(201).json(appt);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status, medicalNote, cancel_reason } = req.body;
    const appt = await AppointmentModel.findById(req.params.id);
    if (!appt) return res.status(404).json({ error: 'Không tìm thấy lịch hẹn' });

    const validTransitions = {
      admin:    ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
      doctor:   ['confirmed', 'in-progress', 'completed'],
      customer: ['cancelled']
    };

    if (!validTransitions[req.user.role]?.includes(status))
      return res.status(403).json({ error: 'Không được phép thay đổi trạng thái này' });

    const extra = {};
    if (medicalNote !== undefined) extra.medicalNote = medicalNote;

    if (status === 'cancelled') {
      if (req.user.role === 'customer' && appt.customerId !== req.user.id)
        return res.status(403).json({ error: 'Không có quyền hủy lịch này' });
      extra.cancel_reason = cancel_reason || null;

      // Refund logic: refund if cancelled > 24h before
      if (appt.depositPaid) {
        const willRefund = AppointmentModel.canRefund(appt.date, appt.time);
        extra.depositRefunded = willRefund ? 1 : 0;
      }
    }

    const updated = await AppointmentModel.updateStatus(req.params.id, status, extra);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi server' });
  }
};
