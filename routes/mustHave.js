const express = require("express");
const router = express.Router();
const pool = require("../data/db");

/**
 * GET all must-have requirements
 */
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

/**
 * ADD new must-have requirement
 */
router.post("/", async (req, res) => {
  try {
    const { jobId, requirement } = req.body;

    const item = {
      id: Date.now(),
      jobId,
      requirement,
      isMet: false,
    };

    const connection = await pool.getConnection();
    await connection.query(
      "INSERT INTO mustHave (id, jobId, requirement, isMet) VALUES (?, ?, ?, ?)",
      [item.id, item.jobId, item.requirement, item.isMet],
    );
    connection.release();

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * UPDATE requirement status (true/false)
 */
router.patch("/:id", async (req, res) => {
  try {
    const itemId = Number(req.params.id);
    const { isMet } = req.body;

    const connection = await pool.getConnection();
    await connection.query("UPDATE mustHave SET isMet = ? WHERE id = ?", [
      isMet,
      itemId,
    ]);
    connection.release();

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE requirement
 */
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
