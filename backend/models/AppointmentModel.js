const db = require('../db');

class AppointmentModel {
  // Full appointment with joins
  static async findById(id) {
    const [rows] = await db.query(
      `SELECT a.*,
              c.name as customerName, c.phone as customerPhone, c.email as customerEmail, c.image_url as customerImage,
              s.name as staffName, s.specialty as staffSpecialty, s.image_url as staffImage,
              sv.name as serviceName, sv.category as serviceCategory, sv.duration as serviceDuration, sv.icon as serviceIcon
       FROM Appointments a
       JOIN Users c ON c.id = a.customerId
       JOIN Users s ON s.id = a.staffId
       JOIN Services sv ON sv.id = a.serviceId
       WHERE a.id = ?`,
      [id]
    );
    return rows[0] || null;
  }

  static async findByCustomer(customerId) {
    const [rows] = await db.query(
      `SELECT a.*,
              s.name as staffName, s.specialty as staffSpecialty, s.image_url as staffImage,
              sv.name as serviceName, sv.category as serviceCategory, sv.duration as serviceDuration, sv.icon as serviceIcon,
              r.id as reviewId, r.rating as reviewRating
       FROM Appointments a
       JOIN Users s ON s.id = a.staffId
       JOIN Services sv ON sv.id = a.serviceId
       LEFT JOIN Reviews r ON r.appointmentId = a.id
       WHERE a.customerId = ?
       ORDER BY a.date DESC, a.time DESC`,
      [customerId]
    );
    return rows;
  }

  static async findByStaff(staffId, date = null) {
    let sql = `SELECT a.*,
              c.name as customerName, c.phone as customerPhone, c.image_url as customerImage,
              sv.name as serviceName, sv.category as serviceCategory, sv.duration as serviceDuration, sv.icon as serviceIcon
       FROM Appointments a
       JOIN Users c ON c.id = a.customerId
       JOIN Services sv ON sv.id = a.serviceId
       WHERE a.staffId = ?`;
    const params = [staffId];
    if (date) { sql += ' AND a.date = ?'; params.push(date); }
    sql += ' ORDER BY a.date ASC, a.time ASC';
    const [rows] = await db.query(sql, params);
    return rows;
  }

  static async findAll(filters = {}) {
    let sql = `SELECT a.*,
              c.name as customerName, c.phone as customerPhone,
              s.name as staffName, s.specialty as staffSpecialty,
              sv.name as serviceName, sv.category as serviceCategory,
              sv.duration as serviceDuration, sv.icon as serviceIcon
       FROM Appointments a
       JOIN Users c ON c.id = a.customerId
       JOIN Users s ON s.id = a.staffId
       JOIN Services sv ON sv.id = a.serviceId
       WHERE 1=1`;
    const params = [];

    if (filters.status)     { sql += ' AND a.status = ?'; params.push(filters.status); }
    if (filters.date)       { sql += ' AND a.date = ?';   params.push(filters.date); }
    if (filters.staffId)    { sql += ' AND a.staffId = ?'; params.push(filters.staffId); }
    if (filters.customerId) { sql += ' AND a.customerId = ?'; params.push(filters.customerId); }
    if (filters.dateFrom)   { sql += ' AND a.date >= ?'; params.push(filters.dateFrom); }
    if (filters.dateTo)     { sql += ' AND a.date <= ?'; params.push(filters.dateTo); }

    sql += ' ORDER BY a.date DESC, a.time DESC';
    const [rows] = await db.query(sql, params);
    return rows;
  }

  /**
   * Check for scheduling conflicts: same staff, same date, overlapping time
   * @param {string} staffId
   * @param {string} date  YYYY-MM-DD
   * @param {string} time  HH:MM
   * @param {number} duration  minutes
   * @param {string} excludeId  appointment to exclude (for updates)
   */
  static async checkConflict(staffId, date, time, duration, excludeId = null) {
    const [hNew, mNew] = time.split(':').map(Number);
    const startNew = hNew * 60 + mNew;
    const endNew = startNew + duration;

    const [existing] = await db.query(
      `SELECT a.time, sv.duration
       FROM Appointments a
       JOIN Services sv ON sv.id = a.serviceId
       WHERE a.staffId = ? AND a.date = ? AND a.status NOT IN ('cancelled')
       ${excludeId ? 'AND a.id != ?' : ''}`,
      excludeId ? [staffId, date, excludeId] : [staffId, date]
    );

    for (const appt of existing) {
      const [hEx, mEx] = appt.time.split(':').map(Number);
      const startEx = hEx * 60 + mEx;
      const endEx = startEx + appt.duration;
      // Overlap if new starts before existing ends AND new ends after existing starts
      if (startNew < endEx && endNew > startEx) return true;
    }
    return false;
  }

  static async getBookedSlots(staffId, date) {
    const [rows] = await db.query(
      `SELECT a.time, sv.duration
       FROM Appointments a
       JOIN Services sv ON sv.id = a.serviceId
       WHERE a.staffId = ? AND a.date = ? AND a.status NOT IN ('cancelled')
       ORDER BY a.time`,
      [staffId, date]
    );
    return rows;
  }

  static async create({ id, customerId, staffId, serviceId, date, time, price, note, depositPaid = 0 }) {
    await db.query(
      `INSERT INTO Appointments (id, customerId, staffId, serviceId, date, time, price, note, depositPaid, status)
       VALUES (?,?,?,?,?,?,?,?,?,'pending')`,
      [id, customerId, staffId, serviceId, date, time, price, note || null, depositPaid]
    );
    return this.findById(id);
  }

  static async updateStatus(id, status, extra = {}) {
    let sql = 'UPDATE Appointments SET status = ?';
    const params = [status];
    if (extra.medicalNote !== undefined) { sql += ', medicalNote = ?'; params.push(extra.medicalNote); }
    if (extra.cancel_reason !== undefined) { sql += ', cancel_reason = ?'; params.push(extra.cancel_reason); }
    if (extra.depositRefunded !== undefined) { sql += ', depositRefunded = ?'; params.push(extra.depositRefunded); }
    sql += ' WHERE id = ?';
    params.push(id);
    await db.query(sql, params);
    return this.findById(id);
  }

  /**
   * Business rule: Customer can cancel with full refund if > 24h before appointment
   */
  static canRefund(appointmentDate, appointmentTime) {
    const apptDateTime = new Date(`${appointmentDate}T${appointmentTime}:00`);
    const now = new Date();
    const diffHours = (apptDateTime - now) / (1000 * 60 * 60);
    return diffHours > 24;
  }

  static generateId() {
    return `a${Date.now()}`;
  }
}

module.exports = AppointmentModel;
