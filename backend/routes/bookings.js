const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Event = require("../models/Event");
const authMiddleware = require("../middleware/auth");

router.get("/", authMiddleware, async (req, res) => {
  const filter = req.query.email ? { bookedByEmail: req.query.email } : {};
  const bookings = await Booking.find(filter);
  res.json(bookings);
});

router.post("/", async (req, res) => {
  try {
    if (req.body.type === "seat") {
      const event = await Event.findById(req.body.eventId);
      if (!event) return res.status(404).json({ error: "Event not found" });

      const existing = await Booking.find({ type: "seat", eventId: req.body.eventId });
      const totalBooked = existing.reduce((sum, b) => sum + (b.seats || 0), 0);

      if (totalBooked + (req.body.seats || 0) > event.maxSeats) {
        return res.status(400).json({ error: `Only ${event.maxSeats - totalBooked} seats left` });
      }
    }

    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ error: "Booking not found" });

  if (req.user.role !== "admin" && booking.bookedByEmail !== req.user.email) {
    return res.status(403).json({ error: "Not allowed" });
  }

  await booking.deleteOne();
  res.json({ message: "Booking deleted" });
});

module.exports = router;
