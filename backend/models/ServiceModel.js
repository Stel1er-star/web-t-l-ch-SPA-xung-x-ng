const db = require('../db');

class ServiceModel {
  static async findAll(category = null) {
    let sql = `SELECT s.*, GROUP_CONCAT(u.name SEPARATOR ', ') as staffNames
               FROM Services s
               LEFT JOIN ServiceStaff ss ON ss.serviceId = s.id
               LEFT JOIN Users u ON u.id = ss.staffId AND u.is_active = 1
               WHERE s.is_active = 1`;
    const params = [];
    if (category) { sql += ' AND s.category = ?'; params.push(category); }
    sql += ' GROUP BY s.id ORDER BY s.category, s.name';
    const [rows] = await db.query(sql, params);
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query(
      `SELECT * FROM Services WHERE id = ? AND is_active = 1`,
      [id]
    );
    if (!rows[0]) return null;
    const svc = rows[0];

    // Fetch staff separately to avoid JSON_ARRAYAGG compatibility issues
    const [staff] = await db.query(
      `SELECT u.id, u.name, u.specialty, u.image_url
       FROM ServiceStaff ss
       JOIN Users u ON u.id = ss.staffId AND u.is_active = 1
       WHERE ss.serviceId = ?`,
      [id]
    );
    svc.staff = staff;
    return svc;
  }

  static async getStaffForService(serviceId) {
    const [rows] = await db.query(
      `SELECT u.id, u.name, u.specialty, u.bio, u.image_url,
              AVG(r.rating) as avgRating, COUNT(DISTINCT r.id) as reviewCount
       FROM Users u
       JOIN ServiceStaff ss ON ss.staffId = u.id
       LEFT JOIN Reviews r ON r.staffId = u.id
       WHERE ss.serviceId = ? AND u.is_active = 1
       GROUP BY u.id ORDER BY u.name`,
      [serviceId]
    );
    return rows;
  }

  static async create({ id, name, category, duration, price, description, image_url, icon }) {
    await db.query(
      'INSERT INTO Services (id, name, category, duration, price, description, image_url, icon) VALUES (?,?,?,?,?,?,?,?)',
      [id, name, category, duration, price, description || null, image_url || null, icon || null]
    );
    return this.findById(id);
  }

  static async update(id, fields) {
    const allowed = ['name', 'category', 'duration', 'price', 'description', 'image_url', 'icon', 'is_active'];
    const sets = []; const vals = [];
    for (const [k, v] of Object.entries(fields)) {
      if (allowed.includes(k)) { sets.push(`${k} = ?`); vals.push(v); }
    }
    if (!sets.length) return null;
    vals.push(id);
    await db.query(`UPDATE Services SET ${sets.join(', ')} WHERE id = ?`, vals);
    return this.findById(id);
  }

  static async delete(id) {
    await db.query('UPDATE Services SET is_active = 0 WHERE id = ?', [id]);
  }

  static generateId() { return `s${Date.now()}`; }
}

module.exports = ServiceModel;
