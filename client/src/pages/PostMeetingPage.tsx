import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../api/axios';

interface Meeting {
  _id: string;
  title: string;
  description: string;
  status: string;
  meetingCode: string;
  transcript: string;
  summary: string;
  actionItems: any[];
  createdAt: string;
}

const PostMeetingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    fetchMeeting();
  }, [id]);

  const fetchMeeting = async () => {
    try {
      const { data } = await API.get(`/meetings/${id}`);
      setMeeting(data);
      setTranscript(data.transcript || '');
    } catch (error) {
      console.error('Error fetching meeting:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSummary = async () => {
    setAiLoading(true);
    try {
      const { data } = await API.post(`/ai/mock-summary/${id}`, {
        transcript: transcript || 'Team discussed project progress, reviewed tasks and planned next steps.'
      });
      setAiResult(data);
    } catch (error) {
      console.error('Error generating summary:', error);
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      Loading...
    </div>
  );

  if (!meeting) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      Meeting not found
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">

        {/* Header */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{meeting.title}</h2>
              <p className="text-gray-500 mt-1">{meeting.description}</p>
              <div className="flex gap-3 mt-2">
                <span className="text-sm text-gray-500">
                  Code: <strong>{meeting.meetingCode}</strong>
                </span>
                <span className={`text-sm px-2 py-0.5 rounded-full ${
                  meeting.status === 'ended'
                    ? 'bg-red-100 text-red-600'
                    : 'bg-yellow-100 text-yellow-600'
                }`}>
                  {meeting.status}
                </span>
              </div>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-blue-600 hover:underline text-sm"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>

        {/* Transcript Section */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow">
          <h3 className="text-lg font-bold mb-3">Meeting Transcript</h3>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Paste or type the meeting transcript here to generate AI summary..."
            className="w-full border rounded-lg p-3 h-32 text-sm focus:outline-none focus:border-blue-500 resize-none"
          />
          <button
            onClick={generateSummary}
            disabled={aiLoading}
            className="mt-3 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {aiLoading ? (
              <>
                <span className="animate-spin">⏳</span>
                Generating AI Summary...
              </>
            ) : (
              <>
                🤖 Generate AI Summary
              </>
            )}
          </button>
        </div>

        {/* AI Results */}
        {aiResult && (
          <div className="space-y-4">

            {/* Summary */}
            <div className="bg-white rounded-lg p-6 shadow">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                🤖 AI Meeting Summary
              </h3>
              <p className="text-gray-700 leading-relaxed">{aiResult.summary}</p>
            </div>

            {/* Key Points */}
            {aiResult.keyPoints && aiResult.keyPoints.length > 0 && (
              <div className="bg-white rounded-lg p-6 shadow">
                <h3 className="text-lg font-bold mb-3">📌 Key Discussion Points</h3>
                <ul className="space-y-2">
                  {aiResult.keyPoints.map((point: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700">
                      <span className="text-blue-500 mt-0.5">•</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Items */}
            {aiResult.actionItems && aiResult.actionItems.length > 0 && (
              <div className="bg-white rounded-lg p-6 shadow">
                <h3 className="text-lg font-bold mb-3">✅ Action Items</h3>
                <div className="space-y-3">
                  {aiResult.actionItems.map((item: any, i: number) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <input
                        type="checkbox"
                        className="mt-1 w-4 h-4 text-blue-600"
                      />
                      <div className="flex-1">
                        <p className="text-gray-800 font-medium">{item.task}</p>
                        <div className="flex gap-4 mt-1">
                          {item.assignee && (
                            <span className="text-xs text-gray-500">
                              👤 {item.assignee}
                            </span>
                          )}
                          {item.deadline && (
                            <span className="text-xs text-gray-500">
                              📅 {item.deadline}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* No AI result yet */}
        {!aiResult && !aiLoading && (
          <div className="bg-white rounded-lg p-6 shadow text-center text-gray-500">
            <p className="text-4xl mb-3">🤖</p>
            <p>Click "Generate AI Summary" to get meeting insights!</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default PostMeetingPage;