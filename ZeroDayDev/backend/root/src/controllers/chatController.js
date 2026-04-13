'use strict';

const chatService = require('../services/chatService');

const getRooms = (req, res) => {
  res.json({ rooms: chatService.getRooms() });
};

const getHistory = async (req, res) => {
  const { room } = req.params;
  const messages = await chatService.getHistory(room);
  res.json({ messages });
};

const getOnlineUsers = async (req, res) => {
  const { room } = req.params;
  const users = await chatService.getOnlineUsers(room);
  res.json({ users });
};

const deleteMessage = async (req, res) => {
  const { messageId } = req.params;
  const result = await chatService.deleteMessage(messageId);
  res.json(result);
};

const sendMessage = async (req, res) => {
  try {
    const { room } = req.params;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required"
      });
    }

    const saved = await chatService.saveMessage({
      room,
      displayName: req.user?.displayName || req.user?.email || "Student",
      socketId: "web",
      text: message
    });

    res.json(saved);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to send message"
    });
  }
};

module.exports = {
  getRooms,
  getHistory,
  getOnlineUsers,
  deleteMessage,
  sendMessage   
};