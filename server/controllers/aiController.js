const Meeting = require('../models/Meeting');

const getOpenAIClient = () => {
  const { OpenAI } = require('openai');
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'dummy-key'
  });
};

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

const summarizeMeeting = async (req, res) => {
  try {
    const { meetingId } = req.params;

    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    if (!meeting.transcript) {
      return res.status(400).json({ message: 'No transcript found' });
    }

    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `Analyze the meeting transcript and provide JSON with keys: summary, keyPoints, actionItems`
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

const extractActionItems = async (req, res) => {
  try {
    const { meetingId } = req.params;

    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    if (!meeting.transcript) {
      return res.status(400).json({ message: 'No transcript found' });
    }

    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `Extract action items from transcript. Return JSON array: [{ "task": "...", "assignee": "...", "deadline": "..." }]`
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

    const mockSummary = {
      summary: `This meeting covered important topics discussed by the team. Key decisions were made and tasks were assigned.`,
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

    return res.json({ meetingId, ...mockSummary });

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