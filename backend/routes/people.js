const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "..", "data", "people.json");

function getSeed() {
  const { people } = require("../data/peopleSeed");
  return people;
}

function readData() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(getSeed(), null, 2));
    console.log("People data seeded.");
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

router.get("/", (req, res) => {
  res.json(readData());
});

router.get("/:id", (req, res) => {
  const people = readData();
  const person = people.find((p) => p.id === Number(req.params.id));
  if (!person) return res.status(404).json({ error: "Person not found" });
  res.json(person);
});

router.post("/", (req, res) => {
  const people = readData();
  const newPerson = {
    ...req.body,
    id: people.length > 0 ? Math.max(...people.map((p) => p.id)) + 1 : 1,
  };
  people.push(newPerson);
  writeData(people);
  res.status(201).json(newPerson);
});

router.delete("/:id", (req, res) => {
  const people = readData();
  const index = people.findIndex((p) => p.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Person not found" });
  people.splice(index, 1);
  writeData(people);
  res.json({ message: "Person deleted" });
});

module.exports = router;
