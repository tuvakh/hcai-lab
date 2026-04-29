const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const projectsRouter = require("./routes/projects");
const peopleRouter = require("./routes/people");
const eventsRouter = require("./routes/events");
const equipmentsRouter = require("./routes/equipment");
const bookingsRouter = require("./routes/bookings");
const uploadRouter = require("./routes/upload");
const ntnuRouter = require("./routes/ntnu");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
}));
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/projects", projectsRouter);
app.use("/api/people", peopleRouter);
app.use("/api/events", eventsRouter);
app.use("/api/equipment", equipmentsRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/ntnu", ntnuRouter);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Backend running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
