import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
      <h1
        className="text-xl font-bold cursor-pointer"
        onClick={() => navigate('/dashboard')}
      >
        🤖 IntellMeet
      </h1>
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/tasks')}
          className="text-white hover:text-blue-200 text-sm"
        >
          📋 Tasks
        </button>
        <button
          onClick={() => navigate('/analytics')}
          className="text-white hover:text-blue-200 text-sm"
        >
          📊 Analytics
        </button>
        <NotificationBell />
        <span className="text-sm">Hello, {user?.name}</span>
        <button
          onClick={handleLogout}
          className="bg-white text-blue-600 px-3 py-1 rounded text-sm hover:bg-gray-100"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;