const fs = require('fs');
const path = require('path');

class Logger {
  constructor() {
    this.logStream = fs.createWriteStream(path.join(__dirname, 'app.log'), { flags: 'a' });
  }

  log(message) {
    const timestamp = new Date().toISOString();
    this.logStream.write(`[${timestamp}] ${message}\n`);
  }
}

module.exports = Logger;
