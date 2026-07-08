const ShiftModel = require('../models/ShiftModel');

exports.getAll = async (req, res) => {
  try { res.json(await ShiftModel.findAll()); }
  catch (err) { res.status(500).json({ error: 'Lỗi server' }); }
};

exports.getByStaff = async (req, res) => {
  try { res.json(await ShiftModel.findByStaff(req.params.staffId)); }
  catch (err) { res.status(500).json({ error: 'Lỗi server' }); }
};

exports.create = async (req, res) => {
  try {
    const { staffId, day, startTime, endTime } = req.body;
    if (!staffId || !day || !startTime || !endTime) return res.status(400).json({ error: 'Thiếu thông tin' });
    
    if (startTime >= endTime) {
      return res.status(400).json({ error: 'Giờ bắt đầu phải trước giờ kết thúc' });
    }

    const hasConflict = await ShiftModel.checkShiftConflict(staffId, day, startTime, endTime);
    if (hasConflict) {
      return res.status(400).json({ error: 'Ca làm việc bị trùng với một ca khác trong cùng ngày.' });
    }

    const id = ShiftModel.generateId();
    const shift = await ShiftModel.create({ id, staffId, day, startTime, endTime });
    res.status(201).json(shift);
  } catch (err) { res.status(500).json({ error: 'Lỗi server' }); }
};

exports.update = async (req, res) => {
  try {
    const { startTime, endTime } = req.body;
    if (startTime >= endTime) {
      return res.status(400).json({ error: 'Giờ bắt đầu phải trước giờ kết thúc' });
    }

    // Need staffId and day to check conflict. Let's fetch the existing shift first.
    const db = require('../db');
    const [rows] = await db.query('SELECT * FROM Shifts WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Không tìm thấy ca làm việc' });
    const existing = rows[0];

    const hasConflict = await ShiftModel.checkShiftConflict(existing.staffId, existing.day, startTime, endTime, req.params.id);
    if (hasConflict) {
      return res.status(400).json({ error: 'Ca làm việc bị trùng với một ca khác trong cùng ngày.' });
    }

    const shift = await ShiftModel.update(req.params.id, { startTime, endTime });
    res.json(shift);
  } catch (err) { res.status(500).json({ error: 'Lỗi server' }); }
};

exports.remove = async (req, res) => {
  try {
    const hasConflict = await ShiftModel.hasActiveAppointments(req.params.id);
    if (hasConflict) {
      return res.status(400).json({ error: 'Không thể xóa ca làm việc vì đang có lịch hẹn của khách hàng.' });
    }
    await ShiftModel.delete(req.params.id);
    res.json({ message: 'Đã xóa ca làm việc' });
  } catch (err) { res.status(500).json({ error: 'Lỗi server' }); }
};
