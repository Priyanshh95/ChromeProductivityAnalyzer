const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const DB_FILE = 'backend/db.json';

// Helper to read/write db.json
function readDB() {
  if (!fs.existsSync(DB_FILE)) return { logs: [], classifications: { productive: [], unproductive: [] } };
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}
function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// POST /log - receive time log
app.post('/log', (req, res) => {
  const { domain, seconds } = req.body;
  if (!domain || !seconds) return res.status(400).json({ error: 'Missing domain or seconds' });
  const db = readDB();
  db.logs.push({ domain, seconds, timestamp: Date.now() });
  writeDB(db);
  res.json({ success: true });
});

// GET /stats - return analytics
app.get('/stats', (req, res) => {
  const db = readDB();
  // Aggregate time per domain
  const stats = {};
  db.logs.forEach(log => {
    stats[log.domain] = (stats[log.domain] || 0) + log.seconds;
  });
  res.json({ stats });
});

// GET /classify - get site classifications
app.get('/classify', (req, res) => {
  const db = readDB();
  res.json(db.classifications);
});

// POST /classify - update site classifications
app.post('/classify', (req, res) => {
  const { productive, unproductive } = req.body;
  if (!productive || !unproductive) return res.status(400).json({ error: 'Missing lists' });
  const db = readDB();
  db.classifications = { productive, unproductive };
  writeDB(db);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Backend API running on http://localhost:${PORT}`);
}); 