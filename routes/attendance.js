const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// ✅ Punch In
router.post("/checkin", async (req, res) => {
  const { userId } = req.body;
  try {
    await pool.execute("INSERT INTO attendance (user_id, check_in) VALUES (?, NOW())", [userId]);
    res.json({ success: true, message: "Checked In" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Punch Out
router.post("/checkout", async (req, res) => {
  const { userId } = req.body;
  try {
    await pool.execute(
      "UPDATE attendance SET check_out = NOW() WHERE user_id = ? AND check_out IS NULL",
      [userId]
    );
    res.json({ success: true, message: "Checked Out" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get Attendance by User
router.get("/:userId", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM attendance WHERE user_id = ? ORDER BY check_in DESC",
      [req.params.userId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
