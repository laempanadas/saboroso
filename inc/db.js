const mysql = require ('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'user',
    database: 'empanadas',
    password:'Bucetinha19#',
    multipleStatements: true
  });

  module.exports = connection;