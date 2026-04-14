require("dotenv").config();
const mongoose = require("mongoose");
const Person = require("./models/Person");
const Project = require("./models/Projects");
const Event = require("./models/Event");


const people = require("./data/people.json");
const projects = require("./data/projects.json");
const events = require("./data/events.json");

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected");

  await Person.deleteMany();
  await Project.deleteMany();
  await Event.deleteMany();

  await Person.insertMany(people);
  await Project.insertMany(projects);
  await Event.insertMany(events);

  console.log("Seeded successfully");
  process.exit(0);
}

seed().catch((err) => { console.error(err); process.exit(1); });
