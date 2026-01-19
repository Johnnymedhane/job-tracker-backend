const express = require("express");
const router = express.Router();
const pool = require("../data/db");

router.get("/", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [items] = await connection.query("SELECT * FROM mustHave");
    connection.release();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const itemId = Date.now();
    const item = { id: itemId, ...req.body };
    const connection = await pool.getConnection();
    await connection.query(
      "INSERT INTO mustHave (id, jobId, requirement) VALUES (?, ?, ?)",
      [item.id, item.jobId, item.requirement],
    );
    connection.release();
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const itemId = Number(req.params.id);
    const connection = await pool.getConnection();
    await connection.query("DELETE FROM mustHave WHERE id = ?", [itemId]);
    connection.release();
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
