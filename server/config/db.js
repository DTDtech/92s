const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'studioio_tuan',
  password: process.env.DB_PASSWORD || '123!@Anhtuan',
  database: process.env.DB_NAME || 'studioio_92_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
