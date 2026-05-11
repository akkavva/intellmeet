const Meeting = require('../models/Meeting');

// @route POST /api/meetings
const createMeeting = async (req, res) => {
  try {
    const { title, description, startTime } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const meeting = await Meeting.create({
      title,
      description,
      host: req.user.id,
      startTime: startTime || Date.now()
    });

    return res.status(201).json(meeting);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @route GET /api/meetings
const getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find({
      $or: [
        { host: req.user.id },
        { 'participants.user': req.user.id }
      ]
    })
    .populate('host', 'name email avatar')
    .sort({ createdAt: -1 });

    return res.json(meetings);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @route GET /api/meetings/:id
const getMeetingById = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id)
      .populate('host', 'name email avatar')
      .populate('participants.user', 'name email avatar');

    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    return res.json(meeting);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/meetings/:id/join
const joinMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    // Check if user already joined
    const alreadyJoined = meeting.participants.find(
      p => p.user.toString() === req.user.id
    );

    if (!alreadyJoined) {
      meeting.participants.push({ user: req.user.id });
    }

    meeting.status = 'active';
    await meeting.save();

    return res.json(meeting);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/meetings/:id/end
const endMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    if (meeting.host.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Only host can end meeting' });
    }

    meeting.status = 'ended';
    meeting.endTime = Date.now();
    await meeting.save();

    return res.json(meeting);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @route DELETE /api/meetings/:id
const deleteMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    if (meeting.host.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Only host can delete meeting' });
    }

    await meeting.deleteOne();
    return res.json({ message: 'Meeting deleted' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createMeeting,
  getMeetings,
  getMeetingById,
  joinMeeting,
  endMeeting,
  deleteMeeting
};