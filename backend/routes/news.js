const express = require("express");
const router  = express.Router();
const NewsArticle = require("../models/NewsArticle");

// GET /api/news?region=norway   or   /api/news?region=international
router.get("/", async (req, res) => {
  const { region } = req.query;

  if (!region || !["norway", "international"].includes(region)) {
    return res.status(400).json({ error: "region must be 'norway' or 'international'" });
  }

  try {
    const articles = await NewsArticle
      .find({ region })
      .sort({ publishedAt: -1 })
      .limit(20);

    res.json(articles);
  } catch (err) {
    console.error("[news route] DB error:", err.message);
    res.status(500).json({ error: "Failed to load news" });
  }
});

module.exports = router;
