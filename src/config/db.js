const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const promisePool = pool.promise();

// Check database connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('-------------------------------------------');
        console.error('❌ Database Connection Error:');
        console.error('Code:', err.code);
        console.error('Message:', err.message);
        console.error('-------------------------------------------');
    } else {
        console.log('✅ Database: Connected Successfully');
        connection.release();
    }
});

module.exports = promisePool;
