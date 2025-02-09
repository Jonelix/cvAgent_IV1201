//----------------------------------------------------------------
// This is a simple Node.js server that connects to a PostgreSQL database and serves an API.
// It is just an example.
//-----------------------------------------------------------------

require('dotenv').config({ path: __dirname + '/.env' });

// (ZW)
// require('dotenv').config({ path: 'server/server.js' }); // Path

const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');

const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5000, 
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

app.use(cors());

// Middleware to serve frontend build files
app.use(express.static(path.join(__dirname, '../client/dist')));

// API routes (example)
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from backend!' });
});


app.get('/api/password/:username', async (req, res) => {
  const {username} = req.params;
  console.log(`Fetching password for username: ${username}`);
  try {
    const result = await pool.query("SELECT password FROM person WHERE username = $1", [username]);
    if(result.rows.length > 0){
      res.json(result.rows[0]);
    }else{
      res.status(404).json({error: "User not found"});
    }
  }catch(err){
    console.error(err);
    res.status(500).json({error:"Database query failed"});
  }
});

app.get('/api/recruiter', async (req, res) => {
  console.log('Request received at /api/recruiter');
  try {
    const result = await pool.query("SELECT * FROM person WHERE role_id = 1 AND username IS NOT NULL AND password IS NOT NULL");
    console.log("DB ACCESS!", result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Fetch DB info (ZW)
app.get('/api/applicant', async (req, res) => {
  console.log('Request received at /api/applicant');
  try {
    const result = await pool.query('SELECT * FROM person WHERE role_id = 2 LIMIT 20');
    console.log("DB ACCESS!", result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Catch-all handler to serve React app for unknown routes
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, '../client/index.html'), (err) => {
    if (err) {
      console.error("Error serving frontend:", err);
      res.status(500).send("Frontend not found!");
    }
  });
});

const PORT = process.env.PORT || 5000; // Use $PORT on Heroku, default to 5000 locally

const reqHandlerLoader = require('./api');
reqHandlerLoader.loadHandlers(app);
reqHandlerLoader.loadErrorHandlers(app);

const server = app.listen(
    process.env.SERVER_PORT,
    process.env.SERVER_HOST,
    () => {
      console.log(
          `Server up at ${server.address().address}:${server.address().port}`,
      );
    },
);

