const db = require('./db');
async function check() {
  try {
    const [rows] = await db.query(`SELECT s.* FROM Shifts s
       WHERE s.staffId = 'u5' AND s.day = 'Sat'
         AND s.id NOT IN (
           SELECT shiftId FROM ShiftSwaps
           WHERE status = 'approved' AND requesterId = 'u5' AND date = '2026-07-11'
         )
         AND s.id NOT IN (
           SELECT targetShiftId FROM ShiftSwaps
           WHERE status = 'approved' AND targetId = 'u5' AND targetDate = '2026-07-11' AND targetShiftId IS NOT NULL
         )`);
    console.log(rows);
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
check();
