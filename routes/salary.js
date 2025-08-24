const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// ✅ Generate Salary Record
router.post("/generate", async (req, res) => {
  const { userId, month, basic, overtime, deductions } = req.body;
  try {
    const netSalary = basic + overtime - deductions;

    await pool.execute(
      "INSERT INTO salary (user_id, month, basic, overtime, deductions, net_salary) VALUES (?,?,?,?,?,?)",
      [userId, month, basic, overtime, deductions, netSalary]
    );

    res.json({ success: true, netSalary });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get Salary by User
router.get("/:userId", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM salary WHERE user_id = ?", [
      req.params.userId,
    ]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
