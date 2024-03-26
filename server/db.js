require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function checkConnection() {
    try {
        const connection = await pool.getConnection();
        await connection.query('SELECT 1');
        console.log('Connected to the MySQL database.');
        connection.release();
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
}

if (process.env.NODE_ENV !== 'test') {
    checkConnection();
}

module.exports = pool;
