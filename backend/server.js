const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const DB_FILE = 'db.json';

// Helper to read/write db.json
function readDB() {
  if (!fs.existsSync(DB_FILE)) return { logs: [], classifications: { productive: [], unproductive: [] } };
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}
function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Homepage route
app.get('/', (req, res) => {
  const db = readDB();
  const totalLogs = db.logs.length;
  const totalTime = db.logs.reduce((sum, log) => sum + log.seconds, 0);
  const uniqueDomains = [...new Set(db.logs.map(log => log.domain))].length;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Chrome Productivity Analyzer - Backend</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #1976d2; text-align: center; }
        .status { background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .endpoints { background: #f0f8ff; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .stats { background: #fff3e0; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .endpoint { margin: 10px 0; padding: 10px; background: #f9f9f9; border-left: 4px solid #1976d2; }
        .method { font-weight: bold; color: #1976d2; }
        .url { font-family: monospace; color: #666; }
        .description { color: #333; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🚀 Chrome Productivity Analyzer Backend</h1>
        
        <div class="status">
          <h2>✅ Server Status</h2>
          <p><strong>Status:</strong> Running</p>
          <p><strong>Port:</strong> ${PORT}</p>
          <p><strong>Database:</strong> ${fs.existsSync(DB_FILE) ? 'Connected' : 'Not found'}</p>
        </div>
        
        <div class="endpoints">
          <h2>🔗 Available Endpoints</h2>
          <div class="endpoint">
            <span class="method">GET</span> <span class="url">/stats</span>
            <div class="description">Get analytics data (time spent per domain)</div>
          </div>
          <div class="endpoint">
            <span class="method">GET</span> <span class="url">/classify</span>
            <div class="description">Get site classifications (productive/unproductive)</div>
          </div>
          <div class="endpoint">
            <span class="method">POST</span> <span class="url">/log</span>
            <div class="description">Log time spent on a domain (used by extension)</div>
          </div>
          <div class="endpoint">
            <span class="method">POST</span> <span class="url">/classify</span>
            <div class="description">Update site classifications (used by options page)</div>
          </div>
        </div>
        
        <div class="stats">
          <h2>📊 Current Data Summary</h2>
          <p><strong>Total Time Logs:</strong> ${totalLogs}</p>
          <p><strong>Total Time Tracked:</strong> ${Math.floor(totalTime / 3600)}h ${Math.floor((totalTime % 3600) / 60)}m ${totalTime % 60}s</p>
          <p><strong>Unique Domains:</strong> ${uniqueDomains}</p>
          <p><strong>Productive Sites:</strong> ${db.classifications.productive.length}</p>
          <p><strong>Unproductive Sites:</strong> ${db.classifications.unproductive.length}</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #666;">
          <p>🕒 Last updated: ${new Date().toLocaleString()}</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  res.send(html);
});

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