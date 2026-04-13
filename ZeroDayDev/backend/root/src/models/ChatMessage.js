'use strict';

const mongoose = require('mongoose');

/**
 * ChatMessage is the persistent long-term store.
 * Redis holds the last N messages per room for fast delivery;
 * this collection is the durable archive.
 */
const chatMessageSchema = new mongoose.Schema(
  {
    room: {
      type: String, required: true, index: true,
      // e.g. 'general', 'web-dev', 'ml', 'dsa'
    },
    sender: {
      socketId:    { type: String },
      displayName: { type: String, required: true, maxlength: 50 },
      // anonymous users get a generated handle — no auth required
    },
    text: {
      type: String, required: true, maxlength: 1000,
    },
    type: {
      type: String, enum: ['message', 'system'], default: 'message',
    },
    isDeleted:  { type: Boolean, default: false },
    deletedAt:  { type: Date },
  },
  {
    timestamps: true,
  }
);

chatMessageSchema.index({ room: 1, createdAt: -1 });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
