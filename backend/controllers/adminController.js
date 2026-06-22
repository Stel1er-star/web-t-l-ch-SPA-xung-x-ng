const db = require('../db');
const UserModel = require('../models/UserModel');

exports.getDashboardStats = async (req, res) => {
  try {
    const [[totalAppts]]  = await db.query("SELECT COUNT(*) as count FROM Appointments");
    const [[todayAppts]]  = await db.query("SELECT COUNT(*) as count FROM Appointments WHERE date = CURDATE()");
    const [[totalRevenue]]= await db.query("SELECT COALESCE(SUM(price),0) as total FROM Appointments WHERE status='completed'");
    const [[totalCustomers]] = await db.query("SELECT COUNT(*) as count FROM Users WHERE role='customer'");
    const [[totalStaff]]     = await db.query("SELECT COUNT(*) as count FROM Users WHERE role='doctor'");
    const [[avgRating]]   = await db.query("SELECT ROUND(AVG(rating),1) as avg FROM Reviews");
    const [[pendingCount]]= await db.query("SELECT COUNT(*) as count FROM Appointments WHERE status='pending'");

    // Monthly revenue (last 6 months)
    const [monthlyRevenue] = await db.query(`
      SELECT DATE_FORMAT(date,'%Y-%m') as month,
             SUM(price) as revenue,
             COUNT(*) as count
      FROM Appointments
      WHERE status = 'completed' AND date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
      GROUP BY DATE_FORMAT(date,'%Y-%m')
      ORDER BY month ASC
    `);

    // Service distribution
    const [serviceStats] = await db.query(`
      SELECT sv.name, sv.category, sv.icon, COUNT(a.id) as count, SUM(a.price) as revenue
      FROM Appointments a
      JOIN Services sv ON sv.id = a.serviceId
      WHERE a.status = 'completed'
      GROUP BY sv.id ORDER BY count DESC LIMIT 8
    `);

    // Status distribution
    const [statusStats] = await db.query(`
      SELECT status, COUNT(*) as count FROM Appointments GROUP BY status
    `);

    // Recent appointments
    const [recentAppts] = await db.query(`
      SELECT a.id, a.date, a.time, a.status, a.price,
             c.name as customerName, s.name as staffName, sv.name as serviceName, sv.icon as serviceIcon
      FROM Appointments a
      JOIN Users c ON c.id = a.customerId
      JOIN Users s ON s.id = a.staffId
      JOIN Services sv ON sv.id = a.serviceId
      ORDER BY a.createdAt DESC LIMIT 10
    `);

    res.json({
      summary: {
        totalAppointments: totalAppts.count,
        todayAppointments: todayAppts.count,
        totalRevenue: totalRevenue.total,
        totalCustomers: totalCustomers.count,
        totalStaff: totalStaff.count,
        avgRating: avgRating.avg || 0,
        pendingCount: pendingCount.count
      },
      monthlyRevenue,
      serviceStats,
      statusStats,
      recentAppts
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.findAll(req.query.role || null);
    res.json(users);
  } catch (err) { res.status(500).json({ error: 'Lỗi server' }); }
};

exports.createUser = async (req, res) => {
  try {
    const { username, password, role, name, email, phone, specialty, bio } = req.body;
    if (!username || !password || !name) return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
    if (await UserModel.existsUsername(username)) return res.status(409).json({ error: 'Username đã tồn tại' });
    const id = UserModel.generateId(role || 'customer');
    const user = await UserModel.create({ id, username, password, role, name, email, phone, specialty, bio });
    res.status(201).json(user);
  } catch (err) { res.status(500).json({ error: 'Lỗi server' }); }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await UserModel.update(req.params.id, req.body);
    if (!user) return res.status(404).json({ error: 'Không tìm thấy' });
    res.json(user);
  } catch (err) { res.status(500).json({ error: 'Lỗi server' }); }
};

exports.deleteUser = async (req, res) => {
  try {
    await UserModel.delete(req.params.id);
    res.json({ message: 'Đã vô hiệu hóa tài khoản' });
  } catch (err) { res.status(500).json({ error: 'Lỗi server' }); }
};
