const OpenAI = require('openai');
const Meeting = require('../models/Meeting');

const OpenAI = require('openai');

const getOpenAI = () => {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'dummy-key'
  });
};
// @route POST /api/ai/transcribe/:meetingId
const transcribeMeeting = async (req, res) => {
  try {
    const { transcript } = req.body;
    const { meetingId } = req.params;

    if (!transcript) {
      return res.status(400).json({ message: 'Transcript is required' });
    }

    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    meeting.transcript = transcript;
    await meeting.save();

    return res.json({ message: 'Transcript saved', transcript });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @route POST /api/ai/summarize/:meetingId
const summarizeMeeting = async (req, res) => {
  try {
    const { meetingId } = req.params;

    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    if (!meeting.transcript) {
      return res.status(400).json({ message: 'No transcript found for this meeting' });
    }

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are an AI meeting assistant. Analyze the meeting transcript and provide:
1. A concise summary (2-3 sentences)
2. Key discussion points (bullet points)
3. Action items with assignees if mentioned
Format your response as JSON with keys: summary, keyPoints, actionItems`
        },
        {
          role: 'user',
          content: `Meeting transcript: ${meeting.transcript}`
        }
      ],
      max_tokens: 1000
    });

    const aiResponse = completion.choices[0].message.content;
    let parsedResponse;

    try {
      parsedResponse = JSON.parse(aiResponse);
    } catch {
      parsedResponse = {
        summary: aiResponse,
        keyPoints: [],
        actionItems: []
      };
    }

    // Save summary to meeting
    meeting.summary = parsedResponse.summary;
    await meeting.save();

    return res.json({
      meetingId,
      summary: parsedResponse.summary,
      keyPoints: parsedResponse.keyPoints,
      actionItems: parsedResponse.actionItems
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @route POST /api/ai/action-items/:meetingId
const extractActionItems = async (req, res) => {
  try {
    const { meetingId } = req.params;

    const meeting = await Meeting.findById(meetingId)
      .populate('participants.user', 'name email');

    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    if (!meeting.transcript) {
      return res.status(400).json({ message: 'No transcript found' });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `Extract action items from the meeting transcript. 
Return a JSON array of action items with format:
[{ "task": "task description", "assignee": "person name or null", "deadline": "deadline or null" }]`
        },
        {
          role: 'user',
          content: `Transcript: ${meeting.transcript}`
        }
      ],
      max_tokens: 500
    });

    const aiResponse = completion.choices[0].message.content;
    let actionItems;

    try {
      actionItems = JSON.parse(aiResponse);
    } catch {
      actionItems = [];
    }

    // Save action items to meeting
    meeting.actionItems = actionItems.map((item) => ({
      task: item.task,
      completed: false
    }));
    await meeting.save();

    return res.json({ meetingId, actionItems });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Mock version if no OpenAI key
const getMockSummary = async (req, res) => {
  try {
    const { meetingId } = req.params;
    const { transcript } = req.body;

    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    if (transcript) {
      meeting.transcript = transcript;
    }

    // Mock AI response
    const mockSummary = {
      summary: `This meeting covered important topics discussed by the team. Key decisions were made and tasks were assigned to team members.`,
      keyPoints: [
        'Team discussed project progress',
        'New features were planned',
        'Deadlines were reviewed'
      ],
      actionItems: [
        { task: 'Complete the frontend design', assignee: 'Team', deadline: 'Next week' },
        { task: 'Review backend APIs', assignee: 'Developer', deadline: 'Tomorrow' },
        { task: 'Write documentation', assignee: 'Team', deadline: 'End of sprint' }
      ]
    };

    meeting.summary = mockSummary.summary;
    await meeting.save();

    return res.json({
      meetingId,
      ...mockSummary
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  transcribeMeeting,
  summarizeMeeting,
  extractActionItems,
  getMockSummary
};