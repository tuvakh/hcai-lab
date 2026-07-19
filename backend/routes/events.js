const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const Booking = require("../models/Booking");
const { adminAuth } = require('../middleware/auth');

router.get("/", async (req, res) => {
  const [events, bookings] = await Promise.all([
    Event.find(),
    Booking.find({ type: "seat" }),
  ]);

  const eventsWithSeats = events.map(event => {
    const booked = bookings
      .filter(b => b.eventId === event.id)
      .reduce((sum, b) => sum + (b.seats || 0), 0);
    return { ...event.toJSON(), seatsLeft: event.maxSeats - booked };
  });

  res.json(eventsWithSeats);
});

router.get("/:id", async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ error: "Event not found" });
  res.json(event);
});

router.post("/", adminAuth, async (req, res) => {
  const event = new Event(req.body);
  await event.save();
  res.status(201).json(event);
});

router.put("/:id", adminAuth, async (req, res) => {
  const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!event) return res.status(404).json({ error: "Event not found" });
  res.json(event);
});

router.delete("/:id", adminAuth, async (req, res) => {
  const event = await Event.findByIdAndDelete(req.params.id);
  if (!event) return res.status(404).json({ error: "Event not found" });
  res.json({ message: "Event deleted" });
});

module.exports = router;
