require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcrypt");
const db = require("./db");
const { PORT } = require("./config/constants");

const app = express();
app.use(cors());
app.use(express.json());

// DB Setup
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone TEXT,
    role TEXT DEFAULT 'user' CHECK(role IN ('user', 'admin')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS slots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slot_number INTEGER NOT NULL,
    floor INTEGER NOT NULL,
    type TEXT DEFAULT 'car',
    status TEXT CHECK(status IN ('available', 'booked', 'maintenance')) DEFAULT 'available',
    UNIQUE(slot_number, floor)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    slot_id INTEGER NOT NULL,
    vehicle_number TEXT NOT NULL,
    start_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    end_time DATETIME,
    amount REAL,
    status TEXT CHECK(status IN ('active', 'completed', 'cancelled')) DEFAULT 'active',
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(slot_id) REFERENCES slots(id)
  )`);

  // Seed slots (only if empty)
  db.all("SELECT * FROM slots", [], (err, rows) => {
    if (!rows || rows.length === 0) {
      for (let floor = 1; floor <= 5; floor++) {
        for (let i = 1; i <= 20; i++) {
          db.run("INSERT INTO slots (slot_number, floor) VALUES (?, ?)", [i, floor]);
        }
      }
      console.log("Slots seeded");
    }
  });

  // Seed admin user (only if no admins exist)
  db.get("SELECT * FROM users WHERE role = 'admin'", [], (err, row) => {
    if (!row) {
      bcrypt.hash("admin123", 10, (err, hash) => {
        if (!err) {
          db.run(
            "INSERT INTO users (username, email, password, phone, role) VALUES (?, ?, ?, ?, ?)",
            ["admin", "admin@example.com", hash, "1234567890", "admin"],
            (err) => { if (!err) console.log("Admin user seeded"); }
          );
        }
      });
    }
  });
});

app.use(express.static(path.join(__dirname, '../public')));

app.get("/api", (req, res) => res.send("API is running"));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/slots", require("./routes/slots"));
app.use("/api/bookings", require("./routes/bookings"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
