const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "Gopalyuvi@5293",
  database: process.env.DB_NAME || "renic_tracker",
});

module.exports = pool;
