const express = require('express');
const router = express.Router();
const {
  createMeeting,
  getMeetings,
  getMeetingById,
  joinMeeting,
  endMeeting,
  deleteMeeting
} = require('../controllers/meetingController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createMeeting);
router.get('/', protect, getMeetings);
router.get('/:id', protect, getMeetingById);
router.put('/:id/join', protect, joinMeeting);
router.put('/:id/end', protect, endMeeting);
router.delete('/:id', protect, deleteMeeting);

module.exports = router;