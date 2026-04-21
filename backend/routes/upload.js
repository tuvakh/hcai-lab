const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();

const UPLOAD_DIR = path.join(__dirname, "../../webpage/public/assets/uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

router.post("/", upload.single("file"), (req, res) => {
  res.json({ path: `/assets/uploads/${req.file.filename}` });
});

module.exports = router;
