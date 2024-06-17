require('dotenv').config();
const mysql = require('mysql2/promise');

// Verificando se as variáveis de ambiente foram carregadas corretamente
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? 'Bucetinha19#' : 'Not Provided');

// Criando pool de conexões
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Função para verificar a conexão
async function verifyConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
    connection.release();
  } catch (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  }
}

// Verifique a conexão ao iniciar o servidor
verifyConnection();

module.exports = pool;

