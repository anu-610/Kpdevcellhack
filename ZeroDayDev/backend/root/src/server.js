'use strict';

require('dotenv').config();

const http         = require('http');
const app          = require('./app');
const connectDB    = require('./config/db');
const { connectRedis } = require('./config/redis');
const initSocket   = require('./socket/index');
const logger       = require('./utils/logger');

const PORT = parseInt(process.env.PORT || '5000', 10);

async function bootstrap() {
  // 1. Connect data stores before accepting traffic
  await connectDB();
  // await connectRedis();

  // 2. Create HTTP server from Express app
  const server = http.createServer(app);

  // 3. Attach Socket.IO
  const io = initSocket(server);
  // Expose io on app for any controller that needs to emit events
  app.locals.io = io;

  // 4. Start listening
  server.listen(PORT, () => {
    logger.info(`Dev Cell API running`, {
      port: PORT,
      env:  process.env.NODE_ENV,
      pid:  process.pid,
    });
  });

  // ── Graceful shutdown ──────────────────────────────────────────────────────
  const shutdown = (signal) => async () => {
    logger.info(`${signal} received — shutting down gracefully`);

    server.close(async () => {
      const mongoose = require('mongoose');
      const { client: redis } = require('./config/redis');
      await mongoose.disconnect();
      await redis.quit();
      logger.info('Connections closed — process exiting');
      process.exit(0);
    });

    // Force exit if graceful shutdown takes too long
    setTimeout(() => {
      logger.error('Graceful shutdown timed out — forcing exit');
      process.exit(1);
    }, 15000);
  };

  process.on('SIGTERM', shutdown('SIGTERM'));
  process.on('SIGINT',  shutdown('SIGINT'));

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled rejection', { reason: String(reason) });
  });

  process.on('uncaughtException', (err) => {
    logger.error('Uncaught exception', { error: err.message, stack: err.stack });
    process.exit(1);
  });
}

bootstrap();