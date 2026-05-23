const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const DATA_FILE = path.join(__dirname, 'data.json');
const ADMIN_USER = process.env.ADMIN_USER || 'admin@novamart.com';
const ADMIN_PASS = process.env.ADMIN_PASS || 'NovaMart@12';

const app = express();
app.use(cors());
app.use(express.json());

function readData() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return { locations: [], messages: [] };
  }
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function requireAdmin(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Basic ')) return res.status(401).send('Unauthorized');
  const creds = Buffer.from(auth.split(' ')[1], 'base64').toString('utf8');
  const [user, pass] = creds.split(':');
  if (user === ADMIN_USER && pass === ADMIN_PASS) return next();
  return res.status(403).send('Forbidden');
}

// Locations
app.get('/api/locations', requireAdmin, (req, res) => {
  const data = readData();
  res.json(data.locations || []);
});

app.post('/api/locations', (req, res) => {
  const { username, lat, lng, accuracy, timestamp } = req.body || {};
  if (!username || typeof lat !== 'number' || typeof lng !== 'number') {
    return res.status(400).json({ error: 'invalid' });
  }
  const data = readData();
  const filtered = (data.locations || []).filter(l => l.username !== username);
  filtered.push({ username, lat, lng, accuracy, timestamp: timestamp || new Date().toISOString() });
  data.locations = filtered;
  writeData(data);
  res.json({ ok: true });
});

// Messages (any signed-in user can post; admin protected to read)
app.get('/api/messages', requireAdmin, (req, res) => {
  const data = readData();
  res.json(data.messages || []);
});

app.post('/api/messages', (req, res) => {
  const { from, to, text, date } = req.body || {};
  if (!from || !text) return res.status(400).json({ error: 'invalid' });
  const data = readData();
  data.messages = data.messages || [];
  data.messages.push({ id: `m_${Date.now()}`, from, to: to || 'admin', text, date: date || new Date().toISOString() });
  writeData(data);
  res.json({ ok: true });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log('Nova Mart server listening on', port));
