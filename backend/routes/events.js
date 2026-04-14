const express = require("express");
const router = express.Router();
const Event = require("../models/Event");

router.get("/", async (req, res) => {
  const events = await Event.find();
  res.json(events);
});

router.get("/:id", async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ error: "Event not found" });
  res.json(event);
});

router.post("/", async (req, res) => {
  const event = new Event(req.body);
  await event.save();
  res.status(201).json(event);
});

router.put("/:id", async (req, res) => {
  const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!event) return res.status(404).json({ error: "Event not found" });
  res.json(event);
});

router.delete("/:id", async (req, res) => {
  const event = await Event.findByIdAndDelete(req.params.id);
  if (!event) return res.status(404).json({ error: "Event not found" });
  res.json({ message: "Event deleted" });
});

module.exports = router;
