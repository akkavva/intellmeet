const Message = require('../models/Message');
const Meeting = require('../models/Meeting');

// @route POST /api/chat/:meetingId
const sendMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const { meetingId } = req.params;

    if (!content) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    const message = await Message.create({
      meeting: meetingId,
      sender: req.user.id,
      content
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name email avatar');

    return res.status(201).json(populatedMessage);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @route GET /api/chat/:meetingId
const getMessages = async (req, res) => {
  try {
    const { meetingId } = req.params;

    const messages = await Message.find({ meeting: meetingId })
      .populate('sender', 'name email avatar')
      .sort({ createdAt: 1 });

    return res.json(messages);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { sendMessage, getMessages };