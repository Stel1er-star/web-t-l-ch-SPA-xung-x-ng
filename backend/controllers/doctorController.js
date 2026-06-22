const UserModel = require('../models/UserModel');
const ReviewModel = require('../models/ReviewModel');

exports.getAll = async (req, res) => {
  try {
    const doctors = await UserModel.findDoctors();
    res.json(doctors);
  } catch (err) { res.status(500).json({ error: 'Lỗi server' }); }
};

exports.getOne = async (req, res) => {
  try {
    const doc = await UserModel.findById(req.params.id);
    if (!doc || doc.role === 'customer') return res.status(404).json({ error: 'Không tìm thấy' });
    const stats = await ReviewModel.getStaffStats(req.params.id);
    const reviews = await ReviewModel.findAll({ staffId: req.params.id });
    res.json({ ...doc, stats, reviews });
  } catch (err) { res.status(500).json({ error: 'Lỗi server' }); }
};
