const mysql = require("mysql2");

// Establish the database connection

const db = mysql.createConnection({
  host: "localhost",
  port: process.env.MYSQL_PORT,
  user: "root",
  password: process.env.MYSQL_PASSWORD,
  database: "student_db",
});

db.connect((error) => {
  if (error) {
    console.error("Some error connecting to database", error);
  } else {
    console.log("Connected to MySQL successfully");
  }
});

module.exports = db;
