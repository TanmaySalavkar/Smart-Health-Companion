require('dotenv').config();
const mongoose = require('mongoose');
const Doctor = require('./models/Doctor');

const mongoUri = process.env.MONGO_URI;

mongoose.connect(mongoUri)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

const PORT = process.env.PORT || 3000;

let serverStarted = false;

try {
  const express = require('express');
  const cors = require('cors');

  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/api/doctors', async (req, res) => {
    try {
      const doctors = await Doctor.find();
      res.json(doctors);
    } catch (err) {
      console.error('Error fetching doctors:', err);
      res.status(500).json({ error: 'Failed to fetch doctors' });
    }
  });

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  serverStarted = true;
} catch (e) {
  console.log('Express module load error, starting built-in HTTP server fallback:', e.message);
}

if (!serverStarted) {
  const http = require('http');
  const server = http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    if ((req.url === '/api/doctors' || req.url === '/api/doctors/') && req.method === 'GET') {
      try {
        const doctors = await Doctor.find();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(doctors));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to fetch doctors' }));
      }
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not Found' }));
    }
  });

  server.listen(PORT, () => console.log(`HTTP Server running on port ${PORT}`));
}



