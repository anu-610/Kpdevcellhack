'use strict';

const ChatMessage = require('../models/ChatMessage');
const logger = require('../utils/logger');

const HISTORY_LIMIT = parseInt(process.env.CHAT_HISTORY_LIMIT || '100', 10);

// Allowed chat rooms
const ALLOWED_ROOMS = new Set([
  'general',
  'web-dev',
  'ml',
  'dsa',
  'mobile',
  'open-source'
]);

class ChatService {
  isValidRoom(room) {
    return ALLOWED_ROOMS.has(room);
  }

  getRooms() {
    return [...ALLOWED_ROOMS];
  }

  /**
   * Save message directly to MongoDB
   */
  async saveMessage({ room, displayName, socketId, text }) {
    try {
      const doc = await ChatMessage.create({
        room,
        sender: { displayName, socketId },
        text,
      });

      return {
        id: doc._id.toString(),
        room,
        sender: { displayName, socketId },
        text,
        type: 'message',
        createdAt: doc.createdAt,
      };

    } catch (err) {
      logger.error('ChatMessage persist failed', { error: err.message });
      throw err;
    }
  }

  /**
   * Get message history (MongoDB only)
   */
  async getHistory(room, { limit = 50, before } = {}) {
    const filter = { room, isDeleted: false };

    if (before) {
      filter.createdAt = { $lt: new Date(before) };
    }

    const messages = await ChatMessage.find(filter)
      .sort({ createdAt: -1 })
      .limit(Math.min(limit, HISTORY_LIMIT))
      .lean();

    return messages.reverse(); // oldest first
  }

  /**
   * Online users (TEMPORARY in-memory)
   */
  onlineUsers = {};

  async userJoined(room, socketId, displayName) {
    if (!this.onlineUsers[room]) {
      this.onlineUsers[room] = {};
    }

    this.onlineUsers[room][socketId] = displayName;
  }

  async userLeft(room, socketId) {
    if (this.onlineUsers[room]) {
      delete this.onlineUsers[room][socketId];
    }
  }

  async getOnlineUsers(room) {
    return this.onlineUsers[room] || {};
  }

  /**
   * Soft delete message
   */
  async deleteMessage(messageId) {
    return ChatMessage.findByIdAndUpdate(
      messageId,
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );
  }
}

module.exports = new ChatService();