// Crear la base de datos si no existe antes de inicializar Sequelize
const mysql = require('mysql2/promise');
const dbConfig = require('./config/config.json').development;

async function ensureDBExists() {
  const { database, username, password, host, port } = dbConfig;
  const connection = await mysql.createConnection({
    host,
    port,
    user: username,
    password
  });
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\``);
  await connection.end();
}

module.exports = ensureDBExists;