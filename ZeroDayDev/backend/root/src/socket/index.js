'use strict';

const { Server }      = require('socket.io');
const registerChat    = require('./chatHandler');
const logger          = require('../utils/logger');

/**
 * Attaches Socket.IO to an existing HTTP server.
 * Returns the io instance so it can be stored on app.locals if needed.
 */
function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin:      process.env.CLIENT_URL || '*',
      methods:     ['GET', 'POST'],
      credentials: true,
    },
    // Limit payload size to prevent abuse
    maxHttpBufferSize: 1e5,   // 100 KB per message
    pingTimeout:       20000,
    pingInterval:      25000,
    transports:        ['websocket', 'polling'],
  });

  // ── Global connection middleware ──────────────────────────────────────────
  io.use((socket, next) => {
    // Log every new connection attempt
    logger.debug('Socket connecting', {
      socketId: socket.id,
      ip:       socket.handshake.address,
      origin:   socket.handshake.headers.origin,
    });
    next();
  });

  // ── Connection handler ────────────────────────────────────────────────────
  io.on('connection', (socket) => {
    logger.info('Socket connected', { socketId: socket.id });

    // Delegate all chat events to the chat handler
    registerChat(io, socket);

    // Handle unexpected client errors
    socket.on('error', (err) => {
      logger.error('Socket error', { socketId: socket.id, error: err.message });
    });
  });

  return io;
}

module.exports = initSocket;
