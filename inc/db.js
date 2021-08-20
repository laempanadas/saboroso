const mysql = require ('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'user',
    database: 'saboroso',
    password:'Bucetinha2019#',
    multipleStatements: true
  });

  module.exports = connection;