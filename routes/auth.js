const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// ✅ Register User (Admin/Employee)
router.post("/register", async (req, res) => {
  try {
    const { name, mobile, role, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.execute(
      "INSERT INTO users (name, mobile, role, password) VALUES (?,?,?,?)",
      [name, mobile, role, hashedPassword]
    );

    res.json({ success: true, userId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Login (Password based for now – OTP later)
router.post("/login", async (req, res) => {
  try {
    const { mobile, password } = req.body;
    const [rows] = await pool.execute("SELECT * FROM users WHERE mobile = ?", [
      mobile,
    ]);

    if (rows.length === 0) return res.status(400).json({ error: "User not found" });

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    res.json({ success: true, token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
