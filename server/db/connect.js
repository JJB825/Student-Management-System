const mysql = require("mysql2/promise");

async function initDB() {
  const db = await mysql.createConnection({
    host: "localhost",
    port: process.env.MYSQL_PORT,
    user: "root",
    password: process.env.MYSQL_PASSWORD,
    database: "student_db",
  });

  console.log("Connected to MySQL successfully");
  return db;
}

module.exports = initDB;
