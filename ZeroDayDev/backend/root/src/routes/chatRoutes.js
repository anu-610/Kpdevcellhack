'use strict';

const { Router } = require('express');
const ctrl       = require('../controllers/chatController');
const protect    = require('../middleware/auth');

const router = Router();


router.get('/rooms',                ctrl.getRooms);
router.get('/:room/history',        ctrl.getHistory);
router.get('/:room/online',         ctrl.getOnlineUsers);


router.post('/:room/message', protect, ctrl.sendMessage);


router.delete('/messages/:messageId', protect, ctrl.deleteMessage);

module.exports = router;