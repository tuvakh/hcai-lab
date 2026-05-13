const express = require("express");
const router = express.Router();
const Person = require("../models/Person");
const { adminAuth } = require('../middleware/auth');

router.get("/", async (req, res) => {
  const people = await Person.find();
  res.json(people);
});

router.get("/:id", async (req, res) => {
  const person = await Person.findById(req.params.id);
  if (!person) return res.status(404).json({ error: "Person not found" });
  res.json(person);
});

router.post("/", adminAuth, async (req, res) => {
  const person = new Person(req.body);
  await person.save();
  res.status(201).json(person);
});

router.put("/:id", adminAuth, async (req, res) => {
  const person = await Person.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!person) return res.status(404).json({ error: "Person not found" });
  res.json(person);
});

router.delete("/:id", adminAuth, async (req, res) => {
  const person = await Person.findByIdAndDelete(req.params.id);
  if (!person) return res.status(404).json({ error: "Person not found" });
  res.json({ message: "Person deleted" });
});

module.exports = router;
