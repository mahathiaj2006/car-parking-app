const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/authMiddleware");
const { RATE_PER_HOUR } = require("../config/constants");

// GET user's own bookings
router.get("/my", auth, (req, res) => {
  db.all(
    `SELECT b.*, s.slot_number, s.floor, s.type, u.username, u.email 
     FROM bookings b 
     JOIN slots s ON b.slot_id = s.id 
     JOIN users u ON b.user_id = u.id 
     WHERE b.user_id = ? 
     ORDER BY b.start_time DESC`,
    [req.user.id],
    (err, rows) => {
      if (err) return res.status(500).json({ success: false, message: "Error fetching bookings" });
      res.json({ success: true, data: rows });
    }
  );
});

// GET all bookings (admin only) — with pagination
router.get("/", auth.requireAdmin, (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  const offset = parseInt(req.query.offset) || 0;

  db.all(
    `SELECT b.*, s.slot_number, s.floor, s.type, u.username, u.email 
     FROM bookings b 
     JOIN slots s ON b.slot_id = s.id 
     JOIN users u ON b.user_id = u.id 
     ORDER BY b.start_time DESC LIMIT ? OFFSET ?`,
    [limit, offset],
    (err, rows) => {
      if (err) return res.status(500).json({ success: false, message: "Error fetching bookings" });
      res.json({ success: true, data: rows });
    }
  );
});

// GET single booking
router.get("/:id", auth, (req, res) => {
  db.get(
    `SELECT b.*, s.slot_number, s.floor, s.type, u.username, u.email 
     FROM bookings b 
     JOIN slots s ON b.slot_id = s.id 
     JOIN users u ON b.user_id = u.id 
     WHERE b.id = ?`,
    [req.params.id],
    (err, booking) => {
      if (err) return res.status(500).json({ success: false, message: "Error fetching booking" });
      if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
      if (booking.user_id !== req.user.id && req.user.role !== "admin") {
        return res.status(403).json({ success: false, message: "Unauthorized" });
      }
      res.json({ success: true, data: booking });
    }
  );
});

// CREATE BOOKING — atomic with serialized queries + duplicate check
router.post("/", auth, (req, res) => {
  const { slot_id, vehicle_number } = req.body;
  const user_id = req.user.id;

  if (!slot_id || !vehicle_number) {
    return res.status(400).json({ success: false, message: "slot_id and vehicle_number are required" });
  }

  db.get("SELECT * FROM slots WHERE id = ?", [slot_id], (err, slot) => {
    if (err) return res.status(500).json({ success: false, message: "Error checking slot" });
    if (!slot) return res.status(404).json({ success: false, message: "Slot not found" });
    if (slot.status !== "available") {
      return res.status(400).json({ success: false, message: "Slot not available" });
    }

    // Check for duplicate active booking by this user on this slot
    db.get(
      "SELECT id FROM bookings WHERE user_id = ? AND slot_id = ? AND status = 'active'",
      [user_id, slot_id],
      (err, existing) => {
        if (err) return res.status(500).json({ success: false, message: "Error checking existing booking" });
        if (existing) return res.status(400).json({ success: false, message: "You already have an active booking for this slot" });

        db.run(
          "INSERT INTO bookings (user_id, slot_id, vehicle_number, start_time) VALUES (?, ?, ?, datetime('now'))",
          [user_id, slot_id, vehicle_number],
          function (err) {
            if (err) return res.status(500).json({ success: false, message: "Error creating booking" });

            const bookingId = this.lastID;
            db.get("SELECT start_time FROM bookings WHERE id = ?", [bookingId], (_, row) => {
              console.log('[BOOKING CREATED]', { id: bookingId, start_time: row?.start_time, server_now: new Date().toISOString() });
            });

            db.run("UPDATE slots SET status = 'booked' WHERE id = ?", [slot_id], (err) => {
              if (err) {
                // Rollback: delete the booking using captured bookingId
                db.run("DELETE FROM bookings WHERE id = ?", [bookingId]);
                return res.status(500).json({ success: false, message: "Error updating slot status" });
              }

              res.status(201).json({
                success: true,
                message: "Booking created successfully",
                data: { id: bookingId, slot_id, vehicle_number },
              });
            });
          }
        );
      }
    );
  });
});

// CHECKOUT
router.post("/checkout/:id", auth, (req, res) => {
  db.get("SELECT * FROM bookings WHERE id = ?", [req.params.id], (err, booking) => {
    if (err) return res.status(500).json({ success: false, message: "Error fetching booking" });
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
    if (booking.user_id !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }
    if (booking.status !== "active") {
      return res.status(400).json({ success: false, message: "Booking is not active" });
    }

    const endTime = new Date();
    const startTime = new Date(booking.start_time + 'Z'); // UTC stored, append Z for correct parsing
    const durationHours = (endTime - startTime) / (1000 * 60 * 60);
    const amount = Math.ceil(durationHours * RATE_PER_HOUR);
    const istEndTime = endTime.toISOString();
    console.log('[CHECKOUT]', {
      raw_start_time: booking.start_time,
      parsed_start: startTime.toISOString(),
      end: endTime.toISOString(),
      durationHours: durationHours.toFixed(4),
      amount,
    });

    db.run(
      "UPDATE bookings SET status = 'completed', end_time = ?, amount = ? WHERE id = ?",
      [istEndTime, amount, req.params.id],
      (err) => {
        if (err) return res.status(500).json({ success: false, message: "Error updating booking" });

        db.run("UPDATE slots SET status = 'available' WHERE id = ?", [booking.slot_id], (err) => {
          if (err) return res.status(500).json({ success: false, message: "Error freeing slot" });

          res.json({
            success: true,
            message: "Booking completed",
            data: { booking_id: req.params.id, duration_hours: durationHours.toFixed(2), amount, rate_per_hour: RATE_PER_HOUR },
          });
        });
      }
    );
  });
});

// CANCEL BOOKING
router.post("/cancel/:id", auth, (req, res) => {
  db.get("SELECT * FROM bookings WHERE id = ?", [req.params.id], (err, booking) => {
    if (err) return res.status(500).json({ success: false, message: "Error fetching booking" });
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
    if (booking.user_id !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }
    if (booking.status !== "active") {
      return res.status(400).json({ success: false, message: "Only active bookings can be cancelled" });
    }

    db.run(
      "UPDATE bookings SET status = 'cancelled', end_time = datetime('now') WHERE id = ?",
      [req.params.id],
      (err) => {
        if (err) return res.status(500).json({ success: false, message: "Error cancelling booking" });

        db.run("UPDATE slots SET status = 'available' WHERE id = ?", [booking.slot_id], (err) => {
          if (err) return res.status(500).json({ success: false, message: "Error freeing slot" });
          res.json({ success: true, message: "Booking cancelled successfully" });
        });
      }
    );
  });
});

module.exports = router;
