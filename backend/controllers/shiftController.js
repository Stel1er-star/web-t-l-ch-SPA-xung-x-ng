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
    const id = ShiftModel.generateId();
    const shift = await ShiftModel.create({ id, staffId, day, startTime, endTime });
    res.status(201).json(shift);
  } catch (err) { res.status(500).json({ error: 'Lỗi server' }); }
};

exports.update = async (req, res) => {
  try {
    const { startTime, endTime } = req.body;
    const shift = await ShiftModel.update(req.params.id, { startTime, endTime });
    res.json(shift);
  } catch (err) { res.status(500).json({ error: 'Lỗi server' }); }
};

exports.remove = async (req, res) => {
  try {
    await ShiftModel.delete(req.params.id);
    res.json({ message: 'Đã xóa ca làm việc' });
  } catch (err) { res.status(500).json({ error: 'Lỗi server' }); }
};
