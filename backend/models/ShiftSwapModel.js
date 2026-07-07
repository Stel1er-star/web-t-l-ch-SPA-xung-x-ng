const db = require('../db');

class ShiftSwapModel {
  static async findById(id) {
    const [rows] = await db.query(
      `SELECT sw.*, 
              u1.name as requesterName, u1.specialty as requesterSpecialty,
              u2.name as targetName, u2.specialty as targetSpecialty,
              s1.startTime as shiftStartTime, s1.endTime as shiftEndTime, s1.day as shiftDay,
              s2.startTime as targetShiftStartTime, s2.endTime as targetShiftEndTime, s2.day as targetShiftDay
       FROM ShiftSwaps sw
       JOIN Users u1 ON u1.id = sw.requesterId
       JOIN Users u2 ON u2.id = sw.targetId
       JOIN Shifts s1 ON s1.id = sw.shiftId
       LEFT JOIN Shifts s2 ON s2.id = sw.targetShiftId
       WHERE sw.id = ?`,
      [id]
    );
    return rows[0] || null;
  }

  static async findAll(filters = {}) {
    let sql = `
       SELECT sw.*, 
              u1.name as requesterName, u1.image_url as requesterImage, u1.specialty as requesterSpecialty,
              u2.name as targetName, u2.image_url as targetImage, u2.specialty as targetSpecialty,
              s1.startTime as shiftStartTime, s1.endTime as shiftEndTime, s1.day as shiftDay,
              s2.startTime as targetShiftStartTime, s2.endTime as targetShiftEndTime, s2.day as targetShiftDay
       FROM ShiftSwaps sw
       JOIN Users u1 ON u1.id = sw.requesterId
       JOIN Users u2 ON u2.id = sw.targetId
       JOIN Shifts s1 ON s1.id = sw.shiftId
       LEFT JOIN Shifts s2 ON s2.id = sw.targetShiftId
       WHERE 1=1
    `;
    const params = [];

    if (filters.status) {
      sql += ' AND sw.status = ?';
      params.push(filters.status);
    }

    if (filters.involvedStaffId) {
      sql += ' AND (sw.requesterId = ? OR sw.targetId = ?)';
      params.push(filters.involvedStaffId, filters.involvedStaffId);
    } else {
      if (filters.requesterId) {
        sql += ' AND sw.requesterId = ?';
        params.push(filters.requesterId);
      }
      if (filters.targetId) {
        sql += ' AND sw.targetId = ?';
        params.push(filters.targetId);
      }
    }

    sql += ' ORDER BY sw.createdAt DESC';

    const [rows] = await db.query(sql, params);
    return rows;
  }

  static async create({ id, requesterId, targetId, date, shiftId, targetDate, targetShiftId, reason }) {
    await db.query(
      `INSERT INTO ShiftSwaps (id, requesterId, targetId, date, shiftId, targetDate, targetShiftId, reason, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [id, requesterId, targetId, date, shiftId, targetDate || null, targetShiftId || null, reason || null]
    );
    return this.findById(id);
  }

  static async updateStatus(id, status) {
    await db.query('UPDATE ShiftSwaps SET status = ? WHERE id = ?', [status, id]);
    return this.findById(id);
  }

  static generateId() {
    return `sw${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  }
}

module.exports = ShiftSwapModel;
