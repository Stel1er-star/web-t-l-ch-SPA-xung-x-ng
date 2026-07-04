require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function migrate() {
  console.log('Đang kết nối tới TiDB Cloud...');
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 4000,
    multipleStatements: true,
    ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true }
  });

  try {
    const schemaPath = path.join(__dirname, 'database', 'schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('Đang tạo các bảng (Tables) và đẩy dữ liệu mẫu lên mạng...');
    await pool.query(sql);
    
    console.log('🎉 XONG! Khởi tạo Database TiDB Cloud thành công!');
    console.log('Bây giờ cả team có thể dùng chung Database này rồi nhé!');
  } catch (error) {
    console.error('Lỗi khởi tạo Database:', error.message);
  } finally {
    pool.end();
  }
}

migrate();
