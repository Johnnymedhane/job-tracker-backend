const express = require("express");
const router = express.Router();
const store = require("../data/store");

router.get("/", (req, res) => res.json(store.jobs));

router.post("/", (req, res) => {
  const job = { id: Date.now(), ...req.body };
  store.jobs.push(job);
  res.status(201).json(job);
});



router.delete("/:id", (req, res) => {
  const jobId = Number(req.params.id);
  const index = store.jobs.findIndex(job => job.id === jobId);

  if (index === -1) {
    return res.status(404).json({ message: "Job not found" });
  }

  const deletedJob = store.jobs.splice(index, 1)[0];
  res.json(deletedJob);
});


router.put("/:id", (req, res) => {
  const jobId = Number(req.params.id);
  const index = store.jobs.findIndex((job) => job.id === jobId);
  if (index === -1) return res.status(404).json({ message: "Job not found" });

  store.jobs[index] = { ...store.jobs[index], ...req.body };
  res.json(store.jobs[index]);
});


module.exports = router;
