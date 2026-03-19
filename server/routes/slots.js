const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/authMiddleware");

// GET all slots
router.get("/", (req, res) => {
  db.all("SELECT * FROM slots ORDER BY floor, slot_number", [], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: "Error fetching slots" });
    res.json({ success: true, data: rows });
  });
});

// GET slot by id
router.get("/:id", (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM slots WHERE id = ?", [id], (err, row) => {
    if (err) return res.status(500).json({ success: false, message: "Error fetching slot" });
    if (!row) return res.status(404).json({ success: false, message: "Slot not found" });
    res.json({ success: true, data: row });
  });
});

// UPDATE slot status (admin only)
router.patch("/:id", auth.requireAdmin, (req, res) => {
  const { id } = req.params;
  const { status, type } = req.body;

  if (status && !['available', 'booked', 'maintenance'].includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status" });
  }

  const updates = [];
  const values = [];

  if (status) {
    updates.push("status = ?");
    values.push(status);
  }
  if (type) {
    updates.push("type = ?");
    values.push(type);
  }

  if (updates.length === 0) {
    return res.status(400).json({ success: false, message: "Nothing to update" });
  }

  values.push(id);

  db.run(
    `UPDATE slots SET ${updates.join(", ")} WHERE id = ?`,
    values,
    function (err) {
      if (err) return res.status(500).json({ success: false, message: "Error updating slot" });
      if (this.changes === 0) return res.status(404).json({ success: false, message: "Slot not found" });
      res.json({ success: true, message: "Slot updated successfully" });
    }
  );
});

// CREATE slot (admin only)
router.post("/", auth.requireAdmin, (req, res) => {
  const { slot_number, floor, type } = req.body;

  if (!slot_number || !floor) {
    return res.status(400).json({ success: false, message: "slot_number and floor are required" });
  }

  db.run(
    "INSERT INTO slots (slot_number, floor, type) VALUES (?, ?, ?)",
    [slot_number, floor, type || 'car'],
    function (err) {
      if (err) {
        if (err.message.includes("UNIQUE")) {
          return res.status(400).json({ success: false, message: "Slot already exists at this location" });
        }
        return res.status(500).json({ success: false, message: "Error creating slot" });
      }
      res.status(201).json({ success: true, message: "Slot created", id: this.lastID });
    }
  );
});

module.exports = router;