const express = require("express");
const router = express.Router();
const store = require("../data/store");

router.get("/", (req, res) => res.json(store.niceToHave));

router.post("/", (req, res) => {
  const item = { id: Date.now(), ...req.body };
  store.niceToHave.push(item);
  res.status(201).json(item);
});

router.delete("/:id", (req, res) => {
  store.niceToHave = store.niceToHave.filter(item => item.id !== Number(req.params.id));
  res.status(204).end();
});

module.exports = router;
