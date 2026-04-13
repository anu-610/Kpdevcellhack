'use strict';

const { createLogger, transports, format } = require('winston');
require('winston-daily-rotate-file');

const isDev = process.env.NODE_ENV !== 'production';

const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.errors({ stack: true }),
  format.splat(),
  format.json()
);

const consoleFormat = format.combine(
  format.colorize(),
  format.timestamp({ format: 'HH:mm:ss' }),
  format.printf(({ level, message, timestamp, ...meta }) => {
    const extras = Object.keys(meta).length ? ' ' + JSON.stringify(meta) : '';
    return `${timestamp} [${level}] ${message}${extras}`;
  })
);

const logger = createLogger({
  level: isDev ? 'debug' : 'info',
  format: logFormat,
  transports: [
    new transports.DailyRotateFile({
      filename:    'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level:       'error',
      maxSize:     '20m',
      maxFiles:    '14d',
      zippedArchive: true,
    }),
    new transports.DailyRotateFile({
      filename:    'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize:     '20m',
      maxFiles:    '14d',
      zippedArchive: true,
    }),
  ],
});

if (isDev) {
  logger.add(new transports.Console({ format: consoleFormat }));
}

module.exports = logger;
