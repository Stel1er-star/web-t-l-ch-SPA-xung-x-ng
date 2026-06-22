const db = require('../db');

class ShiftModel {
  static async findByStaff(staffId) {
    const [rows] = await db.query(
      'SELECT * FROM Shifts WHERE staffId = ? ORDER BY FIELD(day,"Mon","Tue","Wed","Thu","Fri","Sat","Sun"), startTime',
      [staffId]
    );
    return rows;
  }

  static async findAll() {
    const [rows] = await db.query(
      `SELECT sh.*, u.name as staffName, u.specialty, u.image_url
       FROM Shifts sh
       JOIN Users u ON u.id = sh.staffId
       ORDER BY u.name, FIELD(sh.day,"Mon","Tue","Wed","Thu","Fri","Sat","Sun")`,
    );
    return rows;
  }

  static async isWorking(staffId, date) {
    // Convert JS date to day abbreviation
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayName = days[new Date(date).getDay()];
    const [rows] = await db.query(
      'SELECT * FROM Shifts WHERE staffId = ? AND day = ?',
      [staffId, dayName]
    );
    return { working: rows.length > 0, shifts: rows };
  }

  /**
   * Generate available time slots for a staff on a date
   * Slots are every 30 minutes within shift hours
   */
  static async getAvailableSlots(staffId, date, serviceDuration) {
    const { working, shifts } = await this.isWorking(staffId, date);
    if (!working) return [];

    // Get booked slots for that day
    const [booked] = await db.query(
      `SELECT a.time, sv.duration
       FROM Appointments a
       JOIN Services sv ON sv.id = a.serviceId
       WHERE a.staffId = ? AND a.date = ? AND a.status NOT IN ('cancelled')`,
      [staffId, date]
    );

    const allSlots = [];
    for (const shift of shifts) {
      const [sh, sm] = shift.startTime.split(':').map(Number);
      const [eh, em] = shift.endTime.split(':').map(Number);
      const shiftStart = sh * 60 + sm;
      const shiftEnd = eh * 60 + em;

      let cursor = shiftStart;
      while (cursor + serviceDuration <= shiftEnd) {
        const hh = String(Math.floor(cursor / 60)).padStart(2, '0');
        const mm = String(cursor % 60).padStart(2, '0');
        const slotTime = `${hh}:${mm}`;
        const slotEnd = cursor + serviceDuration;

        // Check if this slot conflicts with any booked appointment
        const conflict = booked.some(b => {
          const [bh, bm] = b.time.split(':').map(Number);
          const bStart = bh * 60 + bm;
          const bEnd = bStart + b.duration;
          return cursor < bEnd && slotEnd > bStart;
        });

        allSlots.push({ time: slotTime, available: !conflict });
        cursor += 30; // 30-minute intervals
      }
    }
    return allSlots;
  }

  static async create({ id, staffId, day, startTime, endTime }) {
    await db.query(
      'INSERT INTO Shifts (id, staffId, day, startTime, endTime) VALUES (?,?,?,?,?)',
      [id, staffId, day, startTime, endTime]
    );
    const [rows] = await db.query('SELECT * FROM Shifts WHERE id = ?', [id]);
    return rows[0];
  }

  static async update(id, { startTime, endTime }) {
    await db.query('UPDATE Shifts SET startTime = ?, endTime = ? WHERE id = ?', [startTime, endTime, id]);
    const [rows] = await db.query('SELECT * FROM Shifts WHERE id = ?', [id]);
    return rows[0];
  }

  static async delete(id) {
    await db.query('DELETE FROM Shifts WHERE id = ?', [id]);
  }

  static generateId() { return `sh${Date.now()}`; }
}

module.exports = ShiftModel;
