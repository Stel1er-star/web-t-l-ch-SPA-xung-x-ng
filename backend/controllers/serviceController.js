const ServiceModel = require('../models/ServiceModel');

exports.getAll = async (req, res) => {
  try {
    const services = await ServiceModel.findAll(req.query.category || null);
    res.json(services);
  } catch (err) { res.status(500).json({ error: 'Lỗi server' }); }
};

exports.getOne = async (req, res) => {
  try {
    const svc = await ServiceModel.findById(req.params.id);
    if (!svc) return res.status(404).json({ error: 'Không tìm thấy dịch vụ' });
    res.json(svc);
  } catch (err) { res.status(500).json({ error: 'Lỗi server' }); }
};

exports.getStaff = async (req, res) => {
  try {
    const staff = await ServiceModel.getStaffForService(req.params.id);
    res.json(staff);
  } catch (err) { res.status(500).json({ error: 'Lỗi server' }); }
};

exports.create = async (req, res) => {
  try {
    const { name, category, duration, price, description, image_url, icon } = req.body;
    if (!name || !category || !duration || !price) return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
    const id = ServiceModel.generateId();
    const svc = await ServiceModel.create({ id, name, category, duration: parseInt(duration), price: parseInt(price), description, image_url, icon });
    res.status(201).json(svc);
  } catch (err) { res.status(500).json({ error: 'Lỗi server' }); }
};

exports.update = async (req, res) => {
  try {
    const svc = await ServiceModel.update(req.params.id, req.body);
    if (!svc) return res.status(404).json({ error: 'Không tìm thấy dịch vụ' });
    res.json(svc);
  } catch (err) { res.status(500).json({ error: 'Lỗi server' }); }
};

exports.remove = async (req, res) => {
  try {
    await ServiceModel.delete(req.params.id);
    res.json({ message: 'Đã xóa dịch vụ' });
  } catch (err) { res.status(500).json({ error: 'Lỗi server' }); }
};
