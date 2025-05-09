// utils/logger.js
const winston = require('winston');
const { combine, timestamp, printf, colorize, errors } = winston.format;
const path = require('path');

// Custom format for console
const consoleFormat = printf(({ level, message, timestamp, stack }) => {
  const logMessage = `${timestamp} [${level}] ${stack || message}`;
  return level === 'error' ? `🔥 ${logMessage}` : `ℹ️  ${logMessage}`;
});

// Custom format for files
const fileFormat = printf(({ level, message, timestamp, stack }) => {
  return JSON.stringify({
    timestamp,
    level,
    message: stack || message,
  });
});

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
  ),
  transports: [
    // Console transport (development only)
    new winston.transports.Console({
      format: combine(
        colorize(),
        consoleFormat
      ),
      silent: process.env.NODE_ENV === 'test',
    }),

    // Error file transport
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/error.log'),
      level: 'error',
      format: fileFormat,
    }),

    // Combined log file transport
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/combined.log'),
      format: fileFormat,
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/exceptions.log'),
      format: fileFormat,
    }),
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/rejections.log'),
      format: fileFormat,
    }),
  ],
});

// For morgan HTTP request logging
logger.stream = {
  write: (message) => logger.info(message.trim()),
};

module.exports = logger;