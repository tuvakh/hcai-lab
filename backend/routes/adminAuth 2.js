const express = require("express");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/login", (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ error: "Password required" });

  const stored = process.env.ADMIN_PASSWORD_HASH;
  if (!stored) return res.status(500).json({ error: "Server misconfigured" });

  const [salt, expectedHash] = stored.split(":");

  let actualHash;
  try {
    actualHash = crypto.scryptSync(password, salt, 64).toString("hex");
  } catch {
    return res.status(500).json({ error: "Server error" });
  }

  const match = crypto.timingSafeEqual(
    Buffer.from(actualHash, "hex"),
    Buffer.from(expectedHash, "hex")
  );

  if (!match) return res.status(401).json({ error: "Incorrect password" });

  const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, { expiresIn: "8h" });
  res.json({ token });
});

module.exports = router;
