const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Import Routes
const authRoutes = require("./routes/auth");
const attendanceRoutes = require("./routes/attendance");
const salaryRoutes = require("./routes/salary");
const leaveRoutes = require("./routes/leaves");

// ✅ Health Check Route
const pool = require("./config/db"); // make sure your db.js exports mysql2 pool or connection
app.get("/db-check", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT NOW() AS time");
    res.json({ success: true, dbTime: rows[0].time });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "DB connection failed", error: err.message });
  }
});

// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/salary", salaryRoutes);
app.use("/api/leaves", leaveRoutes);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Renic Tracker API running on port ${PORT}`));
