const mysql = require('mysql2/promise');

async function ensureDBExists() {
  const host = process.env.DB_HOST || '127.0.0.1';
  const port = process.env.DB_PORT || '3306';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || 'control_stock_db';

  const connection = await mysql.createConnection({
    host,
    port,
    user,
    password
  });
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\``);
  await connection.end();
}

module.exports = ensureDBExists;