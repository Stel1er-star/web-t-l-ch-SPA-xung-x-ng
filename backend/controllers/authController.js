const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');

const generateToken = (user) => jwt.sign(
  { id: user.id, username: user.username, role: user.role, name: user.name },
  process.env.JWT_SECRET || 'fallback-secret-key',
  { expiresIn: process.env.JWT_EXPIRES || '7d' }
);

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

    const user = await UserModel.findByUsername(username);
    if (!user) return res.status(401).json({ error: 'Tên đăng nhập hoặc mật khẩu không đúng' });
    if (!user.is_active) return res.status(403).json({ error: 'Tài khoản đã bị vô hiệu hóa' });

    // Support both bcrypt and plain text passwords (for dev seed data)
    let valid = false;
    if (user.password.startsWith('$2')) {
      valid = await UserModel.verifyPassword(password, user.password);
    } else {
      valid = password === user.password;
    }
    if (!valid) return res.status(401).json({ error: 'Tên đăng nhập hoặc mật khẩu không đúng' });

    const token = generateToken(user);
    const safeUser = await UserModel.findById(user.id);
    res.json({ token, user: safeUser, message: 'Đăng nhập thành công' });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.register = async (req, res) => {
  try {
    const { username, password, name, email, phone } = req.body;
    if (!username || !password || !name) return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
    if (password.length < 6) return res.status(400).json({ error: 'Mật khẩu phải có ít nhất 6 ký tự' });

    if (await UserModel.existsUsername(username)) return res.status(409).json({ error: 'Tên đăng nhập đã tồn tại' });
    if (email && await UserModel.existsEmail(email)) return res.status(409).json({ error: 'Email đã được sử dụng' });

    const id = UserModel.generateId('customer');
    const user = await UserModel.create({ id, username, password, role: 'customer', name, email, phone });
    const token = generateToken(user);
    res.status(201).json({ token, user, message: 'Đăng ký thành công' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'Không tìm thấy người dùng' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email, phone, bio, specialty } = req.body;
    if (email && await UserModel.existsEmail(email, req.user.id))
      return res.status(409).json({ error: 'Email đã được sử dụng' });
    
    const updateData = { name, email, phone, bio };
    if (req.user.role === 'doctor' && specialty !== undefined) {
      updateData.specialty = specialty;
    }
      
    const user = await UserModel.update(req.user.id, updateData);
    res.json({ user, message: 'Cập nhật thành công' });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Không có file ảnh' });
    const imageUrl = `/uploads/avatars/${req.file.filename}`;
    const user = await UserModel.update(req.user.id, { image_url: imageUrl });
    res.json({ user, message: 'Đã tải lên ảnh đại diện' });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) return res.status(400).json({ error: 'Thiếu thông tin' });
    if (newPassword.length < 6) return res.status(400).json({ error: 'Mật khẩu mới phải có ít nhất 6 ký tự' });

    const user = await UserModel.findByUsername(req.user.username);
    let valid = false;
    if (user.password.startsWith('$2')) {
      valid = await UserModel.verifyPassword(oldPassword, user.password);
    } else {
      valid = oldPassword === user.password;
    }
    if (!valid) return res.status(401).json({ error: 'Mật khẩu cũ không đúng' });

    await UserModel.updatePassword(req.user.id, newPassword);
    res.json({ message: 'Đổi mật khẩu thành công' });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server' });
  }
};
