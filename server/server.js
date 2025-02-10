require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const path = require('path');
const cors = require('cors');
const RequestHandler = require('./RequestHandler');

const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(express.static(path.join(__dirname, '../client/dist')));

const requestHandler = new RequestHandler();
requestHandler.initializeRoutes(app);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`Server up at http://localhost:${PORT}`);
});