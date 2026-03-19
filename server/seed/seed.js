const db = require("../db");

db.serialize(() => {
  // Only seed if slots table is empty — don't wipe existing data
  db.all("SELECT * FROM slots", [], (err, rows) => {
    if (rows && rows.length > 0) {
      console.log("Slots already exist, skipping seed.");
      return;
    }

    for (let floor = 1; floor <= 2; floor++) {
      for (let i = 1; i <= 5; i++) {
        db.run("INSERT INTO slots (slot_number, floor) VALUES (?, ?)", [i, floor]);
      }
    }
    console.log("Database seeded");
  });
});
