const db = require('./db.js');
const ShiftModel = require('./models/ShiftModel.js');

(async () => {
  try {
    // 1. Find BS. Trần Minh An
    const [users] = await db.query('SELECT id, name FROM Users WHERE name LIKE "%Trần Minh An%"');
    if (users.length === 0) {
      console.log('Không tìm thấy bác sĩ Trần Minh An');
      process.exit(0);
    }
    const doctorId = users[0].id;
    console.log('Doctor:', users[0].name, 'ID:', doctorId);

    // 2. Find Monday shift for this doctor
    const [shifts] = await db.query('SELECT * FROM Shifts WHERE staffId = ? AND day = "Mon"', [doctorId]);
    if (shifts.length === 0) {
      console.log('Không tìm thấy ca làm việc Thứ 2 của bác sĩ này');
      process.exit(0);
    }
    const shift = shifts[0];
    console.log('Shift:', shift);

    // 3. Find blocking appointments
    const [appts] = await db.query(`
      SELECT a.id, a.date, a.time, a.status, sv.name as serviceName, c.name as customerName
      FROM Appointments a
      JOIN Services sv ON sv.id = a.serviceId
      JOIN Users c ON c.id = a.customerId
      WHERE a.staffId = ? 
        AND a.status != 'cancelled'
        AND DAYOFWEEK(a.date) = 2
    `, [doctorId]);
    
    console.log('Appointments on Monday for this doctor:');
    for (const a of appts) {
      console.log(`- Lịch hẹn ID: ${a.id}, Ngày: ${new Date(a.date).toLocaleDateString('vi-VN')}, Giờ: ${a.time}, Dịch vụ: ${a.serviceName}, Khách hàng: ${a.customerName}, Trạng thái: ${a.status}`);
    }

  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
})();
