const mysql2 = require('mysql2/promise');

let pool;

if (process.env.MYSQL_URL) {
  // Replace the database name in the URL with kschool_db
  const url = process.env.MYSQL_URL.replace(/\/[^/]+$/, '/kschool_db');
  pool = mysql2.createPool(url);
} else {
  pool = mysql2.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'kschool_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
  });
}

async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log('✅ MySQL connected successfully');
    conn.release();
  } catch (err) {
    console.error('❌ MySQL connection failed:', err.message);
    process.exit(1);
  }
}

module.exports = { pool, testConnection };
