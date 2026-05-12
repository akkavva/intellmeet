import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import API from '../api/axios';

interface Meeting {
  _id: string;
  title: string;
  description: string;
  status: string;
  meetingCode: string;
  host: { name: string; email: string };
  participants: any[];
}

const MeetingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    fetchMeeting();
    fetchMessages();
  }, [id]);

  const fetchMeeting = async () => {
    try {
      const { data } = await API.get(`/meetings/${id}`);
      setMeeting(data);
    } catch (error) {
      console.error('Error fetching meeting:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const { data } = await API.get(`/chat/${id}`);
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      const { data } = await API.post(`/chat/${id}`, { content: newMessage });
      setMessages([...messages, data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const endMeeting = async () => {
    try {
      await API.put(`/meetings/${id}/end`);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error ending meeting:', error);
    }
  };

  if (loading) return <div className="text-center py-10">Loading meeting...</div>;
  if (!meeting) return <div className="text-center py-10">Meeting not found</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">{meeting.title}</h2>
            <p className="text-gray-400">Code: {meeting.meetingCode}</p>
          </div>
          <button
            onClick={endMeeting}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            End Meeting
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Video Area */}
          <div className="col-span-2">
            <div className="bg-gray-800 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">📹</div>
                <p className="text-gray-400">Video conferencing</p>
                <p className="text-gray-500 text-sm">WebRTC coming in next step</p>
              </div>
            </div>

            {/* Participants */}
            <div className="mt-4 bg-gray-800 rounded-lg p-4">
              <h3 className="font-bold mb-2">
                Participants ({meeting.participants.length + 1})
              </h3>
              <div className="flex gap-2 flex-wrap">
                <span className="bg-blue-600 px-3 py-1 rounded-full text-sm">
                  {meeting.host.name} (Host)
                </span>
                {meeting.participants.map((p, i) => (
                  <span key={i} className="bg-gray-600 px-3 py-1 rounded-full text-sm">
                    Participant {i + 1}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="bg-gray-800 rounded-lg p-4 flex flex-col h-[500px]">
            <h3 className="font-bold mb-3">Meeting Chat</h3>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto mb-3 space-y-2">
              {messages.length === 0 ? (
                <p className="text-gray-500 text-sm">No messages yet...</p>
              ) : (
                messages.map((msg, i) => (
                  <div key={i} className="bg-gray-700 rounded p-2">
                    <p className="text-blue-400 text-xs font-bold">
                      {msg.sender?.name}
                    </p>
                    <p className="text-sm">{msg.content}</p>
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 bg-gray-700 rounded px-3 py-2 text-sm focus:outline-none"
              />
              <button
                onClick={sendMessage}
                className="bg-blue-600 px-3 py-2 rounded hover:bg-blue-700 text-sm"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingPage;