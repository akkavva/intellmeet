const express = require('express');
const router = express.Router();
const {
  transcribeMeeting,
  summarizeMeeting,
  extractActionItems,
  getMockSummary
} = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/transcribe/:meetingId', protect, transcribeMeeting);
router.post('/summarize/:meetingId', protect, summarizeMeeting);
router.post('/action-items/:meetingId', protect, extractActionItems);
router.post('/mock-summary/:meetingId', protect, getMockSummary);

module.exports = router;