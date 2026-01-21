const express = require("express");
const router = express.Router();
const pool = require("../data/db");

router.get("/", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [jobs] = await connection.query("SELECT * FROM jobs");
    connection.release();
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const jobId = Date.now();
    const job = { id: jobId, ...req.body };
    const connection = await pool.getConnection();
    await connection.query(
      "INSERT INTO jobs (id, title, company, website, connection, status) VALUES (?, ?, ?, ?, ?, ?)",
      [job.id, job.title, job.company, job.website, job.connection, job.status],
    );
    connection.release();
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const jobId = Number(req.params.id);
    const connection = await pool.getConnection();

    // Get the job first
    const [jobs] = await connection.query("SELECT * FROM jobs WHERE id = ?", [
      jobId,
    ]);
    if (jobs.length === 0) {
      connection.release();
      return res.status(404).json({ message: "Job not found" });
    }

    // Delete the job
    await connection.query("DELETE FROM jobs WHERE id = ?", [jobId]);
    connection.release();
    res.json(jobs[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const jobId = Number(req.params.id);
    const connection = await pool.getConnection();

    // Check if job exists
    const [jobs] = await connection.query("SELECT * FROM jobs WHERE id = ?", [
      jobId,
    ]);
    if (jobs.length === 0) {
      connection.release();
      return res.status(404).json({ message: "Job not found" });
    }

    // Update the job
    const updatedJob = { ...jobs[0], ...req.body };
    await connection.query(
      "UPDATE jobs SET title = ?, company = ?, website = ?, connection = ?, status = ? WHERE id = ?",
      [
        updatedJob.title,
        updatedJob.company,
        updatedJob.website,
        updatedJob.connection,
        updatedJob.status,
        jobId,
      ],
    );

    connection.release();
    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
