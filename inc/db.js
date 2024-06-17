require('dotenv').config();
const mysql = require('mysql2');

console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  multipleStatements: true
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar:', err.message);
  } else {
    console.log('Conexão bem-sucedida!');
  }
});

module.exports = connection;
