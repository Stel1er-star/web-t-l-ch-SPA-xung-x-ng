const db = require('../db');
const bcrypt = require('bcryptjs');

class UserModel {
  static async findByUsername(username) {
    const [rows] = await db.query('SELECT * FROM Users WHERE username = ?', [username]);
    return rows[0] || null;
  }

  static async findById(id) {
    const [rows] = await db.query(
      'SELECT id, username, role, name, email, phone, specialty, bio, image_url, is_active, createdAt FROM Users WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  }

  static async findAll(role = null) {
    let sql = 'SELECT id, username, role, name, email, phone, specialty, bio, image_url, is_active, createdAt FROM Users';
    const params = [];
    if (role) { sql += ' WHERE role = ?'; params.push(role); }
    sql += ' ORDER BY createdAt DESC';
    const [rows] = await db.query(sql, params);
    return rows;
  }

  static async findDoctors() {
    const [rows] = await db.query(
      `SELECT u.id, u.name, u.specialty, u.bio, u.image_url,
              AVG(r.rating) as avgRating, COUNT(DISTINCT r.id) as reviewCount,
              GROUP_CONCAT(DISTINCT ss.serviceId) as serviceIds
       FROM Users u
       LEFT JOIN Reviews r ON r.staffId = u.id
       LEFT JOIN ServiceStaff ss ON ss.staffId = u.id
       WHERE u.role = 'doctor' AND u.is_active = 1
       GROUP BY u.id ORDER BY u.name`
    );
    // Convert serviceIds from string "s1,s2" to array ['s1', 's2']
    return rows.map(r => ({
      ...r,
      serviceIds: r.serviceIds ? r.serviceIds.split(',') : []
    }));
  }

  static async create({ id, username, password, role, name, email, phone, specialty, bio, image_url }) {
    const hash = await bcrypt.hash(password, 10);
    await db.query(
      'INSERT INTO Users (id, username, password, role, name, email, phone, specialty, bio, image_url) VALUES (?,?,?,?,?,?,?,?,?,?)',
      [id, username, hash, role || 'customer', name, email || null, phone || null, specialty || null, bio || null, image_url || null]
    );
    return this.findById(id);
  }

  static async update(id, fields) {
    const allowed = ['name', 'email', 'phone', 'specialty', 'bio', 'image_url', 'is_active'];
    const sets = [];
    const vals = [];
    for (const [k, v] of Object.entries(fields)) {
      if (allowed.includes(k)) { sets.push(`${k} = ?`); vals.push(v); }
    }
    if (!sets.length) return null;
    vals.push(id);
    await db.query(`UPDATE Users SET ${sets.join(', ')} WHERE id = ?`, vals);
    return this.findById(id);
  }

  static async updatePassword(id, newPassword) {
    const hash = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE Users SET password = ? WHERE id = ?', [hash, id]);
  }

  static async verifyPassword(plainText, hash) {
    return bcrypt.compare(plainText, hash);
  }

  static async delete(id) {
    await db.query('UPDATE Users SET is_active = 0 WHERE id = ?', [id]);
  }

  static async existsUsername(username, excludeId = null) {
    let sql = 'SELECT id FROM Users WHERE username = ?';
    const params = [username];
    if (excludeId) { sql += ' AND id != ?'; params.push(excludeId); }
    const [rows] = await db.query(sql, params);
    return rows.length > 0;
  }

  static async existsEmail(email, excludeId = null) {
    let sql = 'SELECT id FROM Users WHERE email = ?';
    const params = [email];
    if (excludeId) { sql += ' AND id != ?'; params.push(excludeId); }
    const [rows] = await db.query(sql, params);
    return rows.length > 0;
  }

  static generateId(role) {
    const prefix = role === 'customer' ? 'c' : role === 'doctor' ? 'u' : 'a';
    return `${prefix}${Date.now()}`;
  }
}

module.exports = UserModel;
