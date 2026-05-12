import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../api/axios';

interface Meeting {
  _id: string;
  title: string;
  description: string;
  status: string;
  meetingCode: string;
  createdAt: string;
}

const DashboardPage = () => {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newMeeting, setNewMeeting] = useState({ title: '', description: '' });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      const { data } = await API.get('/meetings');
      setMeetings(data);
    } catch (error) {
      console.error('Error fetching meetings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMeeting = async () => {
    if (!newMeeting.title) return;
    setCreating(true);
    try {
      const { data } = await API.post('/meetings', newMeeting);
      setMeetings([data, ...meetings]);
      setShowCreate(false);
      setNewMeeting({ title: '', description: '' });
      navigate(`/meeting/${data._id}`);
    } catch (error) {
      console.error('Error creating meeting:', error);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">My Meetings</h2>
          <button
            onClick={() => setShowCreate(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + New Meeting
          </button>
        </div>

        {/* Create Meeting Modal */}
        {showCreate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h3 className="text-lg font-bold mb-4">Create New Meeting</h3>
              <input
                type="text"
                placeholder="Meeting title"
                value={newMeeting.title}
                onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                className="w-full border rounded px-3 py-2 mb-3 focus:outline-none focus:border-blue-500"
              />
              <textarea
                placeholder="Description (optional)"
                value={newMeeting.description}
                onChange={(e) => setNewMeeting({ ...newMeeting, description: e.target.value })}
                className="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:border-blue-500"
                rows={3}
              />
              <div className="flex gap-3">
                <button
                  onClick={handleCreateMeeting}
                  disabled={creating}
                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create Meeting'}
                </button>
                <button
                  onClick={() => setShowCreate(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Meetings List */}
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading meetings...</div>
        ) : meetings.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No meetings yet. Create your first meeting!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {meetings.map((meeting) => (
              <div
                key={meeting._id}
                className="bg-white p-5 rounded-lg shadow hover:shadow-md cursor-pointer"
                onClick={() => navigate(`/meeting/${meeting._id}`)}
              >
                <h3 className="font-bold text-lg mb-1">{meeting.title}</h3>
                <p className="text-gray-500 text-sm mb-3">{meeting.description}</p>
                <div className="flex justify-between items-center">
                  <span className={`text-xs px-2 py-1 rounded ${
                    meeting.status === 'active' ? 'bg-green-100 text-green-600' :
                    meeting.status === 'ended' ? 'bg-red-100 text-red-600' :
                    'bg-yellow-100 text-yellow-600'
                  }`}>
                    {meeting.status}
                  </span>
                  <span className="text-xs text-gray-400">
                    Code: {meeting.meetingCode}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;