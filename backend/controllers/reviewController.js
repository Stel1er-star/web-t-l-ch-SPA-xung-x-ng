const ReviewModel = require('../models/ReviewModel');
const AppointmentModel = require('../models/AppointmentModel');

exports.getAll = async (req, res) => {
  try {
    const reviews = await ReviewModel.findAll({
      staffId:   req.query.staffId,
      serviceId: req.query.serviceId,
      rating:    req.query.rating
    });
    res.json(reviews);
  } catch (err) { res.status(500).json({ error: 'Lỗi server' }); }
};

exports.create = async (req, res) => {
  try {
    const { appointmentId, rating, comment, tags } = req.body;
    if (!appointmentId || !rating) return res.status(400).json({ error: 'Thiếu thông tin' });

    const appt = await AppointmentModel.findById(appointmentId);
    if (!appt) return res.status(404).json({ error: 'Không tìm thấy lịch hẹn' });
    if (appt.customerId !== req.user.id) return res.status(403).json({ error: 'Không có quyền đánh giá' });
    if (appt.status !== 'completed') return res.status(400).json({ error: 'Chỉ có thể đánh giá lịch đã hoàn thành' });

    const existing = await ReviewModel.findByAppointment(appointmentId);
    if (existing) return res.status(409).json({ error: 'Bạn đã đánh giá lịch hẹn này rồi' });

    const id = ReviewModel.generateId();
    const review = await ReviewModel.create({
      id, appointmentId,
      customerId: req.user.id,
      staffId: appt.staffId,
      serviceId: appt.serviceId,
      rating: parseInt(rating), comment, tags
    });
    res.status(201).json(review);
  } catch (err) { res.status(500).json({ error: 'Lỗi server' }); }
};

exports.reply = async (req, res) => {
  try {
    const staffReply = req.body.staffReply || req.body.reply;
    const review = await ReviewModel.findById(req.params.id);
    if (!review) return res.status(404).json({ error: 'Không tìm thấy đánh giá' });
    if (req.user.role === 'doctor' && review.staffId !== req.user.id) return res.status(403).json({ error: 'Không có quyền' });
    const updated = await ReviewModel.reply(req.params.id, staffReply);
    res.json(updated);
  } catch (err) { res.status(500).json({ error: 'Lỗi server' }); }
};

exports.like = async (req, res) => {
  try {
    const updated = await ReviewModel.like(req.params.id, req.user.id);
    res.json(updated);
  } catch (err) { res.status(500).json({ error: 'Lỗi server' }); }
};
