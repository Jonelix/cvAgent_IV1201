/**
 * @fileoverview Express server setup and configuration.
 * Loads environment variables, initializes middleware, sets up routes, 
 * and starts the server.
 */
require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const path = require('path');
const cors = require('cors');
const RequestHandler = require('./RequestHandler');

const app = express();

/**
 * Configures Cross-Origin Resource Sharing (CORS).
 * Allows requests from specific origins and supports credentials.
 */
app.use(cors({
    origin: ['https://cvagent-b8c3fb279d06.herokuapp.com/', 'http://localhost:5005'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }));

/**
 * Middleware to parse JSON request bodies.
 */  
app.use(express.json()); // Middleware to parse JSON request bodies

/**
 * Serves static files from the client distribution directory.
 */
app.use(express.static(path.join(__dirname, '../client/dist')));

/**
 * Initializes and configures request handling routes.
 */
const requestHandler = new RequestHandler();
requestHandler.initializeRoutes(app);
/**
 * The port on which the server listens.
 * Uses the value from environment variables or defaults to 5005.
 * @constant {number}
 */

const PORT = process.env.PORT || 5005;

/**
 * Starts the Express server and listens on the specified port.
 * Logs a message indicating the server is running.
 */
const server = app.listen(PORT, () => {
    console.log(`Server up at http://localhost:${PORT}`);
});
