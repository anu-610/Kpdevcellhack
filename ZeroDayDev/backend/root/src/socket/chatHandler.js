'use strict';

const chatService = require('../services/chatService');
const logger      = require('../utils/logger');
const { client: redis } = require('../config/redis');

const RATE_LIMIT_MAX = parseInt(process.env.CHAT_RATE_LIMIT_MAX || '20', 10); // per minute
const RATE_WINDOW_S  = 60;

// Sanitise text — strip HTML tags and trim
function sanitise(text = '') {
  return text.replace(/<[^>]*>/g, '').trim().slice(0, 1000);
}

// Validate display name — alphanumeric + spaces, 2-30 chars
function isValidName(name = '') {
  return /^[a-zA-Z0-9 _.-]{2,30}$/.test(name.trim());
}

/**
 * Per-socket rate limiter using Redis sliding window.
 * Returns true if the message is allowed, false if rate-limited.
 */
async function checkRateLimit(socketId) {
  const key    = `rl:chat:${socketId}`;
  const count  = await redis.incr(key);
  if (count === 1) await redis.expire(key, RATE_WINDOW_S);
  return count <= RATE_LIMIT_MAX;
}

/**
 * Register all chat-related Socket.IO events on a single socket.
 * Called once per connection from socket/index.js.
 */
function registerChatHandler(io, socket) {
  let currentRoom     = null;
  let displayName     = null;

  // ── join ─────────────────────────────────────────────────────────────────
  socket.on('chat:join', async ({ room, name } = {}) => {
    try {
      // Validate room
      if (!chatService.isValidRoom(room)) {
        socket.emit('chat:error', { message: `Room "${room}" does not exist.` });
        return;
      }

      // Validate display name
      if (!isValidName(name)) {
        socket.emit('chat:error', {
          message: 'Name must be 2–30 characters (letters, numbers, spaces, _ . - only).',
        });
        return;
      }

      // Leave previous room cleanly
      if (currentRoom) {
        socket.leave(currentRoom);
        await chatService.userLeft(currentRoom, socket.id);
        io.to(currentRoom).emit('chat:userLeft', { socketId: socket.id, displayName });
      }

      currentRoom  = room;
      displayName  = name.trim();

      socket.join(room);
      await chatService.userJoined(room, socket.id, displayName);

      // Send last 50 messages to the joining user
      const history = await chatService.getHistory(room, { limit: 50 });
      socket.emit('chat:history', { room, messages: history });

      // Broadcast join event to the room
      const onlineUsers = await chatService.getOnlineUsers(room);
      io.to(room).emit('chat:userJoined', { socketId: socket.id, displayName, onlineUsers });

      logger.info('Socket joined room', { socketId: socket.id, room, displayName });
    } catch (err) {
      logger.error('chat:join error', { error: err.message });
      socket.emit('chat:error', { message: 'Failed to join room. Please try again.' });
    }
  });

  // ── message ───────────────────────────────────────────────────────────────
  socket.on('chat:message', async ({ text } = {}) => {
    try {
      if (!currentRoom || !displayName) {
        socket.emit('chat:error', { message: 'Join a room first.' });
        return;
      }

      const clean = sanitise(text);
      if (!clean) {
        socket.emit('chat:error', { message: 'Message cannot be empty.' });
        return;
      }

      // Rate limit check
      const allowed = await checkRateLimit(socket.id);
      if (!allowed) {
        socket.emit('chat:error', { message: 'Slow down — you are sending too many messages.' });
        return;
      }

      const message = await chatService.saveMessage({
        room:        currentRoom,
        displayName,
        socketId:    socket.id,
        text:        clean,
      });

      // Broadcast to everyone in the room (including sender)
      io.to(currentRoom).emit('chat:message', message);
    } catch (err) {
      logger.error('chat:message error', { error: err.message });
      socket.emit('chat:error', { message: 'Message failed to send.' });
    }
  });

  // ── typing indicator ──────────────────────────────────────────────────────
  socket.on('chat:typing', ({ isTyping } = {}) => {
    if (!currentRoom || !displayName) return;
    // Broadcast to everyone except the sender
    socket.to(currentRoom).emit('chat:typing', {
      socketId: socket.id,
      displayName,
      isTyping: Boolean(isTyping),
    });
  });

  // ── load more history (cursor pagination) ────────────────────────────────
  socket.on('chat:loadMore', async ({ before, limit = 30 } = {}) => {
    try {
      if (!currentRoom) return;
      const messages = await chatService.getHistory(currentRoom, { limit, before });
      socket.emit('chat:history', { room: currentRoom, messages, append: false });
    } catch (err) {
      logger.error('chat:loadMore error', { error: err.message });
    }
  });

  // ── disconnect ────────────────────────────────────────────────────────────
  socket.on('disconnect', async (reason) => {
    if (!currentRoom) return;
    try {
      await chatService.userLeft(currentRoom, socket.id);
      const onlineUsers = await chatService.getOnlineUsers(currentRoom);
      io.to(currentRoom).emit('chat:userLeft', { socketId: socket.id, displayName, onlineUsers });
      logger.info('Socket disconnected', { socketId: socket.id, room: currentRoom, reason });
    } catch (err) {
      logger.error('disconnect cleanup error', { error: err.message });
    }
  });
}

module.exports = registerChatHandler;
