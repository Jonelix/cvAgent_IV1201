//----------------------------------------------------------------
// This is a simple Node.js server that connects to a PostgreSQL database and serves an API.
// It is just an example.
//-----------------------------------------------------------------

//require('dotenv').config();

const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
app.use(cors());

// Middleware to serve frontend build files
app.use(express.static(path.join(__dirname, '../client/build')));

// API routes (example)
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from backend!' });
});

// Catch-all handler to serve React app for unknown routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

