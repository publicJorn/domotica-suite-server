const fs = require('fs');
const path = require('path');
const winston = require('winston');

// When initially required, first check if the log dir actually exists. Create if not so.
const logDir = path.resolve(__dirname, '../../', 'logs');
try {
  const logDirStats = fs.statSync(logDir);

  if (!logDirStats.isDirectory()) {
    fs.mkdirSync(logDir);
  }
} catch (err) {
  if (err.code === 'ENOENT') {
    fs.mkdirSync(logDir);
  }
}


// Use this to reference the file Transport of our log
const fileHandle = 'file-all';

/**
 * Expand the default winston logger
 * @export default
 */
function loggerFactory () {
  console.log('LOGGER FACTORY')
  if (winston.default.transports[fileHandle]) {
    return winston;
  }

  winston.level = 'debug';

  if (process.env.NODE_ENV === 'production') {
    startNewLogfileTimer();
  } else {
    // Only console logging in development
    // createNewFile();
  }
  winston.cli();

  return winston;
}

/**
 * Recursive timer function to create a new file
 */
function startNewLogfileTimer () {
  setTimeout(() => {
    startNewLogfileTimer();
  }, getMsUntilTomorrow());

  createNewFile();
}

/**
 * Creates the log file
 */
function createNewFile () {
  if (winston.default.transports[fileHandle]) {
    winston.remove(fileHandle);
  }

  const d = new Date();
  const fileName =
    '' + d.getFullYear() + pad2(d.getMonth() + 1) + pad2(d.getDate()) +
    '-' + pad2(d.getHours()) + pad2(d.getMinutes()) + pad2(d.getSeconds()) +
    '-' + pad3(d.getMilliseconds());

  winston.add(winston.transports.File, {
    name: fileHandle,
    filename: `${logDir}/${fileName}-all.log`,
    level: (process.env.NODE_ENV === 'production' && !process.env.DEBUG) ? 'info' : 'debug',
    json: false,
    prettyPrint: true
  });
}

// Helper functions ---
function pad2 (str) {
  return String('00' + str).slice(-2);
}

function pad3 (str) {
  return String('000' + str).slice(-3);
}

function getMsUntilTomorrow () {
  const now = new Date();
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

  // One minute after midnight
  return (tomorrow.getTime() - now.getTime()) + (1000 * 60);
}

module.exports = loggerFactory;
