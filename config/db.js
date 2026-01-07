const mysql = require('mysql2/promise');
require('dotenv').config();

// Buat connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'db_streaming',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test koneksi saat startup
pool.getConnection()
  .then(connection => {
    console.log('✅ Database terhubung!');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Database gagal terhubung:', err.message);
  });

module.exports = pool;