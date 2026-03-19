const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRY } = require("../config/constants");

// REGISTER
router.post("/register", async (req, res) => {
  const { username, email, password, phone } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }
  if (password.length < 6) {
    return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, message: "Invalid email format" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.run(
      "INSERT INTO users (username, email, password, phone, role) VALUES (?, ?, ?, ?, 'user')",
      [username, email, hashedPassword, phone || null],
      function (err) {
        if (err) return res.status(400).json({ success: false, message: "User already exists" });
        res.status(201).json({ success: true, message: "User registered successfully" });
      }
    );
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error during registration" });
  }
});

// LOGIN
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password required" });
  }

  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    try {
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(401).json({ success: false, message: "Invalid password" });

      const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, JWT_SECRET, {
        expiresIn: JWT_EXPIRY,
      });

      res.json({
        success: true,
        token,
        user: { id: user.id, email: user.email, username: user.username, role: user.role },
      });
    } catch (err) {
      res.status(500).json({ success: false, message: "Server error during login" });
    }
  });
});

module.exports = router;
