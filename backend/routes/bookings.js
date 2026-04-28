const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");

router.get("/", async (req, res) => {
  const bookings = await Booking.find();
  res.json(bookings);
});

router.post("/", async (req, res) => {
  const booking = new Booking(req.body);
  await booking.save();
  res.status(201).json(booking);
});

router.delete("/:id", async (req, res) => {
  const booking = await Booking.findByIdAndDelete(req.params.id);
  if (!booking) return res.status(404).json({ error: "Booking not found" });
  res.json({ message: "Booking deleted" });
});

module.exports = router;
