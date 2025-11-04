// const mysql = require('mysql2');
// const dotenv = require('dotenv');

// dotenv.config();

// const pool = mysql.createPool({
//     host: process.env.DB_HOST || '127.0.0.1',
//     user: process.env.DB_USER || 'root',
//     password: process.env.DB_PASSWORD || '',
//     database: process.env.DB_NAME || 'shejama_group',
//     port: process.env.DB_PORT || 3306,
//     dateStrings: true
// });

// // Test connection
// pool.getConnection((err, connection) => {
//     if (err) {
//         console.error('Database connection failed:', err);
//         return;
//     }
//     console.log('Database connected successfully');
//     connection.release();
// });

// // Add error listeners
// pool.on('error', (err) => {
//     console.error('Pool error:', err);
// });

// module.exports = pool.promise();


const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'shejama_group',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true,
});

// 🧠 Test connection once on startup
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
  } else {
    console.log('✅ Database connected successfully!');
    connection.release();
  }
});

// 🚨 Add global pool error listener
pool.on('error', (err) => {
  console.error('⚠️ MySQL Pool Error:', err.message);
});

module.exports = pool.promise();
