const express = require("express");
const router = express.Router();
const { readData, writeData } = require("../database");

// GET all projects
router.get("/", (req, res) => {
  const projects = readData();
  res.json(projects.sort((a, b) => (b.year || 0) - (a.year || 0)));
});

// GET single project
router.get("/:id", (req, res) => {
  const projects = readData();
  const project = projects.find((p) => p.id === Number(req.params.id));
  if (!project) return res.status(404).json({ error: "Project not found" });
  res.json(project);
});

// POST new project
router.post("/", (req, res) => {
  const projects = readData();
  const newProject = {
    ...req.body,
    id: projects.length > 0 ? Math.max(...projects.map((p) => p.id)) + 1 : 1,
  };
  projects.push(newProject);
  writeData(projects);
  res.status(201).json(newProject);
});

// PUT update project
router.put("/:id", (req, res) => {
  const projects = readData();
  const index = projects.findIndex((p) => p.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Project not found" });
  projects[index] = { ...projects[index], ...req.body, id: projects[index].id };
  writeData(projects);
  res.json(projects[index]);
});

// DELETE project
router.delete("/:id", (req, res) => {
  const projects = readData();
  const index = projects.findIndex((p) => p.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Project not found" });
  projects.splice(index, 1);
  writeData(projects);
  res.json({ message: "Project deleted" });
});

module.exports = router;
