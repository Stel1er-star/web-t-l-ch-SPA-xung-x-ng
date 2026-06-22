const db = require('../db');

class ReviewModel {
  static async findById(id) {
    const [rows] = await db.query(
      `SELECT r.*, c.name as customerName, c.image_url as customerImage,
              s.name as staffName, sv.name as serviceName
       FROM Reviews r
       JOIN Users c ON c.id = r.customerId
       JOIN Users s ON s.id = r.staffId
       JOIN Services sv ON sv.id = r.serviceId
       WHERE r.id = ?`,
      [id]
    );
    return rows[0] || null;
  }

  static async findAll(filters = {}) {
    let sql = `SELECT r.*, c.name as customerName, c.image_url as customerImage,
              s.name as staffName, sv.name as serviceName, sv.category as serviceCategory
       FROM Reviews r
       JOIN Users c ON c.id = r.customerId
       JOIN Users s ON s.id = r.staffId
       JOIN Services sv ON sv.id = r.serviceId
       WHERE 1=1`;
    const params = [];
    if (filters.staffId)   { sql += ' AND r.staffId = ?';   params.push(filters.staffId); }
    if (filters.serviceId) { sql += ' AND r.serviceId = ?'; params.push(filters.serviceId); }
    if (filters.rating)    { sql += ' AND r.rating = ?';    params.push(filters.rating); }
    sql += ' ORDER BY r.createdAt DESC';
    const [rows] = await db.query(sql, params);
    return rows;
  }

  static async findByAppointment(appointmentId) {
    const [rows] = await db.query('SELECT * FROM Reviews WHERE appointmentId = ?', [appointmentId]);
    return rows[0] || null;
  }

  static async create({ id, appointmentId, customerId, staffId, serviceId, rating, comment, tags }) {
    await db.query(
      'INSERT INTO Reviews (id, appointmentId, customerId, staffId, serviceId, rating, comment, tags) VALUES (?,?,?,?,?,?,?,?)',
      [id, appointmentId, customerId, staffId, serviceId, rating, comment || null, tags || null]
    );
    return this.findById(id);
  }

  static async reply(id, staffReply) {
    await db.query('UPDATE Reviews SET staffReply = ? WHERE id = ?', [staffReply, id]);
    return this.findById(id);
  }

  static async like(id, userId) {
    await db.query('UPDATE Reviews SET likes = likes + 1 WHERE id = ?', [id]);
    return this.findById(id);
  }

  static async getStaffStats(staffId) {
    const [rows] = await db.query(
      `SELECT AVG(rating) as avgRating, COUNT(*) as total,
              SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as five,
              SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as four,
              SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as three,
              SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as two,
              SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as one
       FROM Reviews WHERE staffId = ?`,
      [staffId]
    );
    return rows[0];
  }

  static generateId() { return `r${Date.now()}`; }
}

module.exports = ReviewModel;
