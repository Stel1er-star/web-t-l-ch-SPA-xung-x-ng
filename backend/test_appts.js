const db = require('./db.js');
const ShiftModel = require('./models/ShiftModel.js');
(async () => {
  const [appts] = await db.query('SELECT a.id, a.date, a.time, a.status, sv.duration FROM Appointments a JOIN Services sv ON sv.id = a.serviceId WHERE a.staffId = "u1"');
  console.log('All u1 appts:', appts);
  process.exit(0);
})();
