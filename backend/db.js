// Database connection
const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Kanfetka2001',
    database: 'babyfood'
});

module.exports = db;


