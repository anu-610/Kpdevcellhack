'use strict';

const mongoose = require('mongoose');
const logger   = require('../utils/logger');

const MONGO_OPTS = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS:          45000,
};

let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGO_URI, MONGO_OPTS);
    isConnected = true;
    logger.info('MongoDB connected', { uri: process.env.MONGO_URI.replace(/\/\/.*@/, '//***@') });
  } catch (err) {
    logger.error('MongoDB connection failed', { error: err.message });
    process.exit(1);
  }

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected — attempting reconnect');
    isConnected = false;
  });

  mongoose.connection.on('reconnected', () => {
    logger.info('MongoDB reconnected');
    isConnected = true;
  });
}

module.exports = connectDB;
