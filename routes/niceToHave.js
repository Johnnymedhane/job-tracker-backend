const express = require("express");
const router = express.Router();
const pool = require("../data/db");

router.get("/", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [items] = await connection.query("SELECT * FROM niceToHave");
    connection.release();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const itemId = Date.now();
    const rank = Number(req.body.rank) || 1;
    if (rank < 1 || rank > 5) {
      return res.status(400).json({ error: "rank must be between 1 and 5" });
    }

    const item = { id: itemId, rank, ...req.body };
    const connection = await pool.getConnection();
    await connection.query(
      "INSERT INTO niceToHave (id, jobId, requirement, rank) VALUES (?, ?, ?, ?)",
      [item.id, item.jobId, item.requirement, item.rank],
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
    await connection.query("DELETE FROM niceToHave WHERE id = ?", [itemId]);
    connection.release();
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
