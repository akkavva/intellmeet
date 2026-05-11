const express = require('express');
const router = express.Router();
const { sendMessage, getMessages } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.post('/:meetingId', protect, sendMessage);
router.get('/:meetingId', protect, getMessages);

module.exports = router;