import mysql from "mysql2/promise";

// Establish the database connection

const db = await mysql.createConnection({
  host: "localhost",
  port: process.env.MYSQL_PORT,
  user: "root",
  password: process.env.MYSQL_PASSWORD,
  database: "student_db",
});

console.log("Connected to MySQL successfully");

export { db };
