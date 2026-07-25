
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'kebenasd_kschool',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'kebenasd_kschool',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ PostgreSQL connected successfully');
    console.log('📊 Database:', process.env.DB_NAME || 'kebenasd_kschool');
    client.release();
  } catch (err) {
    console.error('❌ PostgreSQL connection failed:', err.message);
    process.exit(1);
  }
}

module.exports = { pool, testConnection };