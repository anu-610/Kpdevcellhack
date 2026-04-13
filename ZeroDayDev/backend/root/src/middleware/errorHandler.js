'use strict';

const logger = require('../utils/logger');

/**
 * Central error handler — must be last middleware registered in app.js.
 * Distinguishes operational errors (ApiError) from unexpected bugs.
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // Log everything — bugs get stack traces, operational errors get info level
  if (err.isOperational) {
    logger.warn('Operational error', { status: err.statusCode, message: err.message, path: req.path });
  } else {
    logger.error('Unexpected error', { error: err.message, stack: err.stack, path: req.path });
  }

  // Mongoose: cast errors (bad ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, message: 'Invalid ID format' });
  }

  // Mongoose: duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({ success: false, message: `${field} already exists` });
  }

  // Mongoose: validation
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, message: 'Validation failed', details: errors });
  }

  // JWT errors (shouldn't reach here normally — caught in auth middleware)
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: err.message });
  }

  // Operational (ApiError)
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.details ? { details: err.details } : {}),
    });
  }

  // Unknown — don't leak internals in production
  const isProd = process.env.NODE_ENV === 'production';
  res.status(500).json({
    success: false,
    message: isProd ? 'Internal server error' : err.message,
    ...(isProd ? {} : { stack: err.stack }),
  });
}

module.exports = errorHandler;
