const db = require('./db.js');
const ShiftModel = require('./models/ShiftModel.js');
(async () => {
  const [shifts] = await db.query('SELECT * FROM Shifts WHERE staffId = "u1"');
  console.log('u1 shifts:', shifts);
  for (let s of shifts) {
    const has = await ShiftModel.hasActiveAppointments(s.id);
    console.log('Check shift', s.day, s.id, has);
  }
  process.exit(0);
})();
