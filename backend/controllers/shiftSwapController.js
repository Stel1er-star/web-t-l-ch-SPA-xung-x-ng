const ShiftSwapModel = require('../models/ShiftSwapModel');
const ShiftModel = require('../models/ShiftModel');
const db = require('../db');

exports.create = async (req, res) => {
  try {
    const { targetId, date, shiftId, targetDate, targetShiftId, reason } = req.body;
    const requesterId = req.user.id;

    if (!targetId || !date || !shiftId) {
      return res.status(400).json({ error: 'Thiếu thông tin bắt buộc (bác sĩ đổi ca, ngày bận, ca bận)' });
    }

    if (requesterId === targetId) {
      return res.status(400).json({ error: 'Bạn không thể tự gửi yêu cầu đổi ca cho chính mình' });
    }

    const id = ShiftSwapModel.generateId();
    const swap = await ShiftSwapModel.create({
      id,
      requesterId,
      targetId,
      date,
      shiftId,
      targetDate,
      targetShiftId,
      reason
    });

    // Create notification for target doctor
    const formattedDate = new Date(date).toLocaleDateString('vi-VN');
    await db.query(
      `INSERT INTO Notifications (id, userId, title, message, type, link) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        `n_sw_${Date.now()}_tgt`,
        targetId,
        'Yêu cầu trực hộ/đổi ca mới',
        `BS. ${req.user.name} đề xuất bạn trực hộ hoặc đổi ca vào ngày ${formattedDate}.`,
        'system',
        '/doctor/schedule.html'
      ]
    );

    res.status(201).json(swap);
  } catch (err) {
    console.error('Create shift swap error:', err);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.getAll = async (req, res) => {
  try {
    const filters = {};
    if (req.query.status) filters.status = req.query.status;

    // Doctor can only see swaps they are involved in
    if (req.user.role === 'doctor') {
      filters.involvedStaffId = req.user.id;
    }

    const swaps = await ShiftSwapModel.findAll(filters);
    res.json(swaps);
  } catch (err) {
    console.error('Get all shift swaps error:', err);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.updateStatus = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const { id } = req.params;
    const { status } = req.body; // 'accepted', 'rejected', 'approved', 'declined'
    const userRole = req.user.role;

    if (!['accepted', 'rejected', 'approved', 'declined'].includes(status)) {
      return res.status(400).json({ error: 'Trạng thái không hợp lệ' });
    }

    const swap = await ShiftSwapModel.findById(id);
    if (!swap) {
      return res.status(404).json({ error: 'Không tìm thấy yêu cầu đổi ca' });
    }

    // Role-based authorization check
    if (['accepted', 'rejected'].includes(status)) {
      // Must be target doctor to accept/reject
      if (userRole !== 'doctor' || swap.targetId !== req.user.id) {
        return res.status(403).json({ error: 'Không được phép thực hiện hành động này. Chỉ có bác sĩ nhận yêu cầu mới có quyền chấp nhận/từ chối.' });
      }
      if (swap.status !== 'pending') {
        return res.status(400).json({ error: 'Yêu cầu không còn ở trạng thái chờ bác sĩ phản hồi.' });
      }
    }

    if (['approved', 'declined'].includes(status)) {
      // Must be admin to approve/decline
      if (userRole !== 'admin') {
        return res.status(403).json({ error: 'Chỉ có Quản trị viên mới được phép phê duyệt/từ chối yêu cầu đổi ca.' });
      }
      if (swap.status !== 'accepted') {
        return res.status(400).json({ error: 'Yêu cầu chưa được bác sĩ đồng nghiệp chấp nhận hoặc đã được xử lý rồi.' });
      }
    }

    // Update status
    await connection.query('UPDATE ShiftSwaps SET status = ? WHERE id = ?', [status, id]);

    const formattedDate = new Date(swap.date).toLocaleDateString('vi-VN');

    // Handle notifications and appointment transfers on approval
    if (status === 'accepted') {
      // Target doctor accepted, notify requester
      await connection.query(
        `INSERT INTO Notifications (id, userId, title, message, type, link) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          `n_sw_${Date.now()}_acc`,
          swap.requesterId,
          'Đồng nghiệp chấp nhận đổi ca',
          `BS. ${swap.targetName} đã chấp nhận yêu cầu trực hộ của bạn vào ngày ${formattedDate}. Đang chờ Admin phê duyệt.`,
          'system',
          '/doctor/schedule.html'
        ]
      );

      // Notify admin
      const [admins] = await connection.query(`SELECT id FROM Users WHERE role = 'admin' AND is_active = 1`);
      for (const admin of admins) {
        await connection.query(
          `INSERT INTO Notifications (id, userId, title, message, type, link) VALUES (?, ?, ?, ?, ?, ?)`,
          [
            `n_sw_${Date.now()}_adm_${admin.id}`,
            admin.id,
            'Yêu cầu đổi ca chờ duyệt',
            `Yêu cầu đổi ca giữa BS. ${swap.requesterName} và BS. ${swap.targetName} vào ngày ${formattedDate} đã được bác sĩ đồng ý, đang chờ bạn phê duyệt.`,
            'system',
            '/admin/shifts.html'
          ]
        );
      }
    } else if (status === 'rejected') {
      // Target doctor rejected, notify requester
      await connection.query(
        `INSERT INTO Notifications (id, userId, title, message, type, link) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          `n_sw_${Date.now()}_rej`,
          swap.requesterId,
          'Yêu cầu đổi ca bị từ chối',
          `BS. ${swap.targetName} đã từ chối yêu cầu trực hộ của bạn vào ngày ${formattedDate}.`,
          'system',
          '/doctor/schedule.html'
        ]
      );
    } else if (status === 'declined') {
      // Admin declined, notify both doctors
      const msg = `Admin đã từ chối yêu cầu đổi ca của BS. ${swap.requesterName} với BS. ${swap.targetName} ngày ${formattedDate}.`;
      await connection.query(
        `INSERT INTO Notifications (id, userId, title, message, type, link) VALUES (?, ?, ?, ?, ?, ?)`,
        [`n_sw_${Date.now()}_dec_req`, swap.requesterId, 'Yêu cầu đổi ca bị từ chối bởi Admin', msg, 'system', '/doctor/schedule.html']
      );
      await connection.query(
        `INSERT INTO Notifications (id, userId, title, message, type, link) VALUES (?, ?, ?, ?, ?, ?)`,
        [`n_sw_${Date.now()}_dec_tgt`, swap.targetId, 'Yêu cầu đổi ca bị từ chối bởi Admin', msg, 'system', '/doctor/schedule.html']
      );
    } else if (status === 'approved') {
      // APPROVED -> DO ACTUAL SWAP WORK
      
      // 1. Reassign appointments for date (requester -> target)
      // Get affected appointments first to notify customers
      const [apptRequester] = await connection.query(
        `SELECT a.id, a.customerId, a.time, s.name as serviceName 
         FROM Appointments a
         JOIN Services s ON s.id = a.serviceId
         WHERE a.staffId = ? AND a.date = ? AND a.status NOT IN ('cancelled', 'completed')`,
        [swap.requesterId, swap.date]
      );

      // Reassign requester's appointments on swap.date to targetId
      await connection.query(
        `UPDATE Appointments
         SET staffId = ?
         WHERE staffId = ? AND date = ? AND status NOT IN ('cancelled', 'completed')`,
        [swap.targetId, swap.requesterId, swap.date]
      );

      // Notify target doctor about appointments assigned
      if (apptRequester.length > 0) {
        await connection.query(
          `INSERT INTO Notifications (id, userId, title, message, type, link) VALUES (?, ?, ?, ?, ?, ?)`,
          [
            `n_sw_${Date.now()}_appts_tgt`,
            swap.targetId,
            'Lịch hẹn nhận lại từ đổi ca',
            `Bạn đã tiếp quản ${apptRequester.length} lịch hẹn từ BS. ${swap.requesterName} vào ngày ${formattedDate}.`,
            'appointment',
            '/doctor/appointments.html'
          ]
        );

        // Notify affected customers
        for (const appt of apptRequester) {
          await connection.query(
            `INSERT INTO Notifications (id, userId, title, message, type, link) VALUES (?, ?, ?, ?, ?, ?)`,
            [
              `n_sw_${Date.now()}_cust_${appt.id}`,
              appt.customerId,
              'Thay đổi Bác sĩ / KTV khám',
              `Lịch hẹn ${appt.serviceName} ngày ${formattedDate} lúc ${appt.time} của bạn đã được chuyển cho BS. ${swap.targetName} tiếp quản do bác sĩ cũ bận.`,
              'appointment',
              '/customer/my-appointments.html'
            ]
          );
        }
      }

      // 2. Reassign appointments for targetDate (target -> requester) if mutual swap
      if (swap.targetDate && swap.targetShiftId) {
        const formattedTargetDate = new Date(swap.targetDate).toLocaleDateString('vi-VN');

        const [apptTarget] = await connection.query(
          `SELECT a.id, a.customerId, a.time, s.name as serviceName 
           FROM Appointments a
           JOIN Services s ON s.id = a.serviceId
           WHERE a.staffId = ? AND a.date = ? AND a.status NOT IN ('cancelled', 'completed')`,
          [swap.targetId, swap.targetDate]
        );

        // Reassign target's appointments on swap.targetDate to requesterId
        await connection.query(
          `UPDATE Appointments
           SET staffId = ?
           WHERE staffId = ? AND date = ? AND status NOT IN ('cancelled', 'completed')`,
          [swap.requesterId, swap.targetId, swap.targetDate]
        );

        // Notify requester doctor about appointments assigned
        if (apptTarget.length > 0) {
          await connection.query(
            `INSERT INTO Notifications (id, userId, title, message, type, link) VALUES (?, ?, ?, ?, ?, ?)`,
            [
              `n_sw_${Date.now()}_appts_req`,
              swap.requesterId,
              'Lịch hẹn nhận lại từ đổi ca',
              `Bạn đã tiếp quản ${apptTarget.length} lịch hẹn từ BS. ${swap.targetName} vào ngày ${formattedTargetDate} (đổi ca chéo).`,
              'appointment',
              '/doctor/appointments.html'
            ]
          );

          // Notify affected customers
          for (const appt of apptTarget) {
            await connection.query(
              `INSERT INTO Notifications (id, userId, title, message, type, link) VALUES (?, ?, ?, ?, ?, ?)`,
              [
                `n_sw_${Date.now()}_cust_${appt.id}`,
                appt.customerId,
                'Thay đổi Bác sĩ / KTV khám',
                `Lịch hẹn ${appt.serviceName} ngày ${formattedTargetDate} lúc ${appt.time} của bạn đã được chuyển cho BS. ${swap.requesterName} tiếp quản (đổi ca chéo).`,
                'appointment',
                '/customer/my-appointments.html'
              ]
            );
          }
        }
      }

      // Notify both doctors about approval
      const succMsg = `Yêu cầu đổi ca của BS. ${swap.requesterName} và BS. ${swap.targetName} vào ngày ${formattedDate} đã được phê duyệt thành công.`;
      await connection.query(
        `INSERT INTO Notifications (id, userId, title, message, type, link) VALUES (?, ?, ?, ?, ?, ?)`,
        [`n_sw_${Date.now()}_apr_req`, swap.requesterId, 'Yêu cầu đổi ca đã được phê duyệt', succMsg, 'system', '/doctor/schedule.html']
      );
      await connection.query(
        `INSERT INTO Notifications (id, userId, title, message, type, link) VALUES (?, ?, ?, ?, ?, ?)`,
        [`n_sw_${Date.now()}_apr_tgt`, swap.targetId, 'Yêu cầu đổi ca đã được phê duyệt', succMsg, 'system', '/doctor/schedule.html']
      );
    }

    await connection.commit();
    res.json({ message: 'Cập nhật trạng thái thành công', status });
  } catch (err) {
    await connection.rollback();
    console.error('Update swap status transaction error:', err);
    res.status(500).json({ error: 'Lỗi server' });
  } finally {
    connection.release();
  }
};
