/**
 * Logger - A simple logging utility for recording messages with timestamps.
 * 
 * This class provides a method to log messages to the console with an ISO timestamp.
 */
class Logger {
  /**
     * Logs a message with a timestamp.
     * @param {string} message - The message to log.
     */
  log(message) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);
  }
}

module.exports = Logger;
