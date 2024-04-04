require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env

const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  multipleStatements: true
});

module.exports = connection;
