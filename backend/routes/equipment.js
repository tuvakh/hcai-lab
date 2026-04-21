const express = require("express");
const router = express.Router();
const Equipments = require("../models/Equipment");

router.get("/", async (req, res) => {
  const equipments = await Equipments.find();
  res.json(equipments);
});

router.get("/:id", async (req, res) => {
  const equipment = await Equipments.findById(req.params.id);
  if (!equipment) return res.status(404).json({ error: "Equipments not found" });
  res.json(equipment);
});

router.post("/", async (req, res) => {
  const equipment = new Equipments(req.body);
  await equipment.save();
  res.status(201).json(equipment);
});

router.put("/:id", async (req, res) => {
  const equipment = await Equipments.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!equipment) return res.status(404).json({ error: "Equipments not found" });
  res.json(equipment);
});

router.delete("/:id", async (req, res) => {
  const equipment = await Equipments.findByIdAndDelete(req.params.id);
  if (!equipment) return res.status(404).json({ error: "Equipments not found" });
  res.json({ message: "Equipments deleted" });
});

module.exports = router;
