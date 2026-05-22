import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import MeetingControls from '../components/MeetingControls';
import ParticipantList from '../components/ParticipantList';
import API from '../api/axios';
import useAuthStore from '../store/authStore';
import { io, Socket } from 'socket.io-client';

interface Meeting {
  _id: string;
  title: string;
  description: string;
  status: string;
  meetingCode: string;
  host: { _id: string; name: string; email: string };
  participants: any[];
}

interface Message {
  _id?: string;
  sender: { _id: string; name: string };
  content: string;
  createdAt?: string;
}

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

const MeetingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    fetchMeeting();
    fetchMessages();
    connectSocket();
    return () => {
      socketRef.current?.emit('leave-meeting', id);
      socketRef.current?.disconnect();
    };
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const connectSocket = () => {
    socketRef.current = io(SOCKET_URL);
    socketRef.current.on('connect', () => {
      socketRef.current?.emit('join-meeting', id);
    });
    socketRef.current.on('receive-message', (data: any) => {
      if (data.sender?._id !== user?._id) {
        setMessages((prev) => [...prev, data]);
      }
    });
  };

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
      await API.post(`/chat/${id}`, { content: newMessage });
      socketRef.current?.emit('send-message', {
        meetingId: id,
        message: newMessage,
        sender: { _id: user?._id, name: user?.name }
      });
      setMessages((prev) => [...prev, {
        sender: { _id: user?._id || '', name: user?.name || '' },
        content: newMessage
      }]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const endMeeting = async () => {
    try {
      await API.put(`/meetings/${id}/end`);
      socketRef.current?.emit('leave-meeting', id);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error ending meeting:', error);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      Loading meeting...
    </div>
  );

  if (!meeting) return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      Meeting not found
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">

        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">{meeting.title}</h2>
            <p className="text-gray-400 text-sm">
              Code: {meeting.meetingCode} • Status:{' '}
              <span className={meeting.status === 'active' ? 'text-green-400' : 'text-yellow-400'}>
                {meeting.status}
              </span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">

          <div className="col-span-2 space-y-4">

            <div className="bg-gray-800 rounded-lg h-80 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">📹</div>
                <p className="text-gray-400">Video conferencing area</p>
                <p className="text-gray-500 text-sm mt-1">WebRTC integration - Day 12</p>
              </div>
            </div>

            <ParticipantList
              host={meeting.host}
              participants={meeting.participants}
            />

            <MeetingControls onEndMeeting={endMeeting} />

          </div>

          <div className="bg-gray-800 rounded-lg p-4 flex flex-col h-[500px]">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              Meeting Chat
              <span className="text-xs bg-green-600 px-2 py-0.5 rounded-full">Live</span>
            </h3>

            <div className="flex-1 overflow-y-auto mb-3 space-y-2">
              {messages.length === 0 ? (
                <p className="text-gray-500 text-sm text-center mt-4">
                  No messages yet. Start the conversation!
                </p>
              ) : (
                messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`rounded p-2 ${
                      msg.sender?._id === user?._id
                        ? 'bg-blue-700 ml-4'
                        : 'bg-gray-700 mr-4'
                    }`}
                  >
                    <p className="text-xs font-bold text-blue-300 mb-1">
                      {msg.sender?.name}
                    </p>
                    <p className="text-sm">{msg.content}</p>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 bg-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                onClick={sendMessage}
                className="bg-blue-600 px-3 py-2 rounded hover:bg-blue-700 text-sm font-medium"
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