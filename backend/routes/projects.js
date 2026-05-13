const express = require("express");
const router = express.Router();
const Project = require("../models/Projects");
const { adminAuth } = require('../middleware/auth');

router.get("/", async (req, res) => {
  const projects = await Project.find().sort({ year: -1 });
  res.json(projects);
});

router.get("/:id", async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ error: "Project not found" });
  res.json(project);
});

router.post("/", adminAuth, async (req, res) => {
  const project = new Project(req.body);
  await project.save();
  res.status(201).json(project);
});

router.put("/:id", adminAuth, async (req, res) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!project) return res.status(404).json({ error: "Project not found" });
  res.json(project);
});

router.delete("/:id", adminAuth, async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) return res.status(404).json({ error: "Project not found" });
  res.json({ message: "Project deleted" });
});

module.exports = router;
