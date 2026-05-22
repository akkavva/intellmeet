import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import API from '../api/axios';

interface Stats {
  totalMeetings: number;
  activeMeetings: number;
  endedMeetings: number;
  scheduledMeetings: number;
}

const AnalyticsPage = () => {
  const [stats, setStats] = useState<Stats>({
    totalMeetings: 0,
    activeMeetings: 0,
    endedMeetings: 0,
    scheduledMeetings: 0
  });
  const [meetings, setMeetings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data } = await API.get('/meetings');
      setMeetings(data);
      setStats({
        totalMeetings: data.length,
        activeMeetings: data.filter((m: any) => m.status === 'active').length,
        endedMeetings: data.filter((m: any) => m.status === 'ended').length,
        scheduledMeetings: data.filter((m: any) => m.status === 'scheduled').length
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Meetings',
      value: stats.totalMeetings,
      icon: '📹',
      color: 'bg-blue-500'
    },
    {
      title: 'Active Now',
      value: stats.activeMeetings,
      icon: '🟢',
      color: 'bg-green-500'
    },
    {
      title: 'Completed',
      value: stats.endedMeetings,
      icon: '✅',
      color: 'bg-purple-500'
    },
    {
      title: 'Scheduled',
      value: stats.scheduledMeetings,
      icon: '📅',
      color: 'bg-yellow-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          📊 Analytics & Insights
        </h2>

        {loading ? (
          <div className="text-center py-10 text-gray-500">
            Loading analytics...
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {statCards.map((card, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg p-5 shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{card.icon}</span>
                    <span className={`${card.color} text-white text-xs px-2 py-1 rounded-full`}>
                      Live
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-gray-800">
                    {card.value}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">{card.title}</p>
                </div>
              ))}
            </div>

            {/* Meeting Status Chart */}
            <div className="grid grid-cols-2 gap-6 mb-6">

              {/* Bar Chart */}
              <div className="bg-white rounded-lg p-6 shadow">
                <h3 className="font-bold text-gray-800 mb-4">
                  Meeting Status Overview
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Scheduled</span>
                      <span className="font-medium">{stats.scheduledMeetings}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-yellow-400 h-3 rounded-full"
                        style={{
                          width: stats.totalMeetings > 0
                            ? `${(stats.scheduledMeetings / stats.totalMeetings) * 100}%`
                            : '0%'
                        }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Active</span>
                      <span className="font-medium">{stats.activeMeetings}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-green-400 h-3 rounded-full"
                        style={{
                          width: stats.totalMeetings > 0
                            ? `${(stats.activeMeetings / stats.totalMeetings) * 100}%`
                            : '0%'
                        }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Completed</span>
                      <span className="font-medium">{stats.endedMeetings}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-purple-400 h-3 rounded-full"
                        style={{
                          width: stats.totalMeetings > 0
                            ? `${(stats.endedMeetings / stats.totalMeetings) * 100}%`
                            : '0%'
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg p-6 shadow">
                <h3 className="font-bold text-gray-800 mb-4">
                  Recent Meetings
                </h3>
                <div className="space-y-3">
                  {meetings.slice(0, 5).map((meeting, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded"
                    >
                      <span className="text-lg">📹</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">
                          {meeting.title}
                        </p>
                        <p className="text-xs text-gray-400">
                          Code: {meeting.meetingCode}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        meeting.status === 'active'
                          ? 'bg-green-100 text-green-600'
                          : meeting.status === 'ended'
                          ? 'bg-red-100 text-red-600'
                          : 'bg-yellow-100 text-yellow-600'
                      }`}>
                        {meeting.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Productivity Tips */}
            <div className="bg-white rounded-lg p-6 shadow">
              <h3 className="font-bold text-gray-800 mb-4">
                💡 Productivity Insights
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-blue-600">
                    {stats.totalMeetings * 30}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Minutes in meetings
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-green-600">
                    {stats.endedMeetings * 3}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Action items created
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-purple-600">
                    {Math.round((stats.endedMeetings / (stats.totalMeetings || 1)) * 100)}%
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Meeting completion rate
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;