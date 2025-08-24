const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// ✅ Apply Leave
router.post("/apply", async (req, res) => {
  const { userId, startDate, endDate } = req.body;
  try {
    await pool.execute(
      "INSERT INTO leaves (user_id, start_date, end_date, status) VALUES (?,?,?, 'pending')",
      [userId, startDate, endDate]
    );
    res.json({ success: true, message: "Leave Applied" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Approve/Reject Leave
router.post("/update", async (req, res) => {
  const { leaveId, status } = req.body;
  try {
    await pool.execute("UPDATE leaves SET status = ? WHERE id = ?", [
      status,
      leaveId,
    ]);
    res.json({ success: true, message: "Leave Updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get User Leaves
router.get("/:userId", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM leaves WHERE user_id = ?", [
      req.params.userId,
    ]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
