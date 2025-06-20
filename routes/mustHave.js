const express = require("express");
const router = express.Router();
const store = require("../data/store");

router.get("/", (req, res) => res.json(store.mustHave));

router.post("/", (req, res) => {
  const item = { id: Date.now(), ...req.body };
  store.mustHave.push(item);
  res.status(201).json(item);
});

router.delete("/:id", (req, res) => {
  store.mustHave = store.mustHave.filter(item => item.id !== Number(req.params.id));
  res.status(204).end();
});

module.exports = router;
