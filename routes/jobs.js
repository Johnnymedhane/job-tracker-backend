const express = require("express");
const router = express.Router();
const store = require("../data/store");

router.get("/", (req, res) => res.json(store.jobs));

router.post("/", (req, res) => {
  const job = { id: Date.now(), ...req.body };
  store.jobs.push(job);
  res.status(201).json(job);
});

module.exports = router;
