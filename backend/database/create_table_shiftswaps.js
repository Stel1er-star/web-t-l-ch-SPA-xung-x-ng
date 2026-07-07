const db = require('../db');

async function createTable() {
  console.log('⏳ Connecting to database and creating ShiftSwaps table...');
  const sql = `
    CREATE TABLE IF NOT EXISTS ShiftSwaps (
      id            VARCHAR(50)  NOT NULL,
      requesterId   VARCHAR(50)  NOT NULL,
      targetId      VARCHAR(50)  NOT NULL,
      date          DATE         NOT NULL,
      shiftId       VARCHAR(50)  NOT NULL,
      targetDate    DATE         DEFAULT NULL,
      targetShiftId VARCHAR(50)  DEFAULT NULL,
      reason        TEXT         DEFAULT NULL,
      status        ENUM('pending', 'accepted', 'rejected', 'approved', 'declined') NOT NULL DEFAULT 'pending',
      createdAt     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      FOREIGN KEY (requesterId) REFERENCES Users(id) ON DELETE CASCADE,
      FOREIGN KEY (targetId)     REFERENCES Users(id) ON DELETE CASCADE,
      FOREIGN KEY (shiftId)      REFERENCES Shifts(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `;

  try {
    await db.query(sql);
    console.log('✅ ShiftSwaps table created successfully or already exists.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating ShiftSwaps table:', error.message);
    process.exit(1);
  }
}

createTable();
