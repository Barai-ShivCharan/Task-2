const express = require("express");
const mysql = require("mysql2/promise");

const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "round",
  password: "admin",
  database: "notes_db",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL");
});

// Get all notes
app.get("/api/notes", (req, res) => {
  db.query("SELECT * FROM notes", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Add a new note
app.post("/api/notes", (req, res) => {
  const { content, date } = req.body;
  db.query(
    "INSERT INTO notes (content, date) VALUES (?, ?)",
    [content, date],
    (err, result) => {
      if (err) throw err;
      res.json({ id: result.insertId, content, date });
    }
  );
});

// Delete a note
app.delete("/api/notes/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM notes WHERE id = ?", [id], (err, result) => {
    if (err) throw err;
    res.sendStatus(200);
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

exports.module = db;
