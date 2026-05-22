import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import MeetingPage from './pages/MeetingPage';
import useAuthStore from './store/authStore';
import PostMeetingPage from './pages/PostMeetingPage';
import KanbanPage from './pages/KanbanPage';
import AnalyticsPage from './pages/AnalyticsPage';

const App = () => {
  const { user } = useAuthStore();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/dashboard"
          element={user ? <DashboardPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/meeting/:id"
          element={user ? <MeetingPage /> : <Navigate to="/login" />}
        />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route
          path="/meeting/:id/summary"
          element={user ? <PostMeetingPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/tasks"
          element={user ? <KanbanPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/analytics"
          element={user ? <AnalyticsPage /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
};

export default App;