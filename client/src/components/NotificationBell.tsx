import { useState } from 'react';

interface Notification {
  id: string;
  message: string;
  type: 'meeting' | 'task' | 'mention';
  read: boolean;
  time: string;
}

const NotificationBell = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      message: 'Team Standup Meeting is starting soon',
      type: 'meeting',
      read: false,
      time: '2 mins ago'
    },
    {
      id: '2',
      message: 'You have a new action item: Complete frontend design',
      type: 'task',
      read: false,
      time: '10 mins ago'
    },
    {
      id: '3',
      message: 'Test User mentioned you in a meeting',
      type: 'mention',
      read: true,
      time: '1 hour ago'
    }
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications(notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const getIcon = (type: string) => {
    if (type === 'meeting') return '📹';
    if (type === 'task') return '✅';
    return '💬';
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative text-white hover:text-blue-200"
      >
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="absolute right-0 top-8 w-80 bg-white rounded-lg shadow-xl z-50 border">
          <div className="flex justify-between items-center p-3 border-b">
            <h3 className="font-bold text-gray-800">Notifications</h3>
            <button
              onClick={markAllRead}
              className="text-xs text-blue-600 hover:underline"
            >
              Mark all read
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-6">
                No notifications
              </p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => markRead(notification.id)}
                  className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-lg">
                      {getIcon(notification.type)}
                    </span>
                    <div className="flex-1">
                      <p className={`text-sm ${
                        !notification.read
                          ? 'text-gray-800 font-medium'
                          : 'text-gray-600'
                      }`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {notification.time}
                      </p>
                    </div>
                    {!notification.read && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-1"></span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-2 text-center border-t">
            <button
              onClick={() => setShowNotifications(false)}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;