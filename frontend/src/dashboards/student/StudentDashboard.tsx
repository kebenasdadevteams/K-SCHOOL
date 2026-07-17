import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import Courses from './Courses';
import Podcasts from './Podcasts';
import Assignments from './Assignments';
import Messages from './Messages';
import Notifications from './Notifications';
import Profile from './Profile';
import Settings from './Settings';

export default function StudentDashboard() {
  return (
    <Routes>
      <Route index element={<Dashboard />} />
      <Route path="courses" element={<Courses />} />
      <Route path="podcasts" element={<Podcasts />} />
      <Route path="assignments" element={<Assignments />} />
      <Route path="messages" element={<Messages />} />
      <Route path="notifications" element={<Notifications />} />
      <Route path="profile" element={<Profile />} />
      <Route path="settings" element={<Settings />} />
      <Route path="my-courses" element={<Navigate to="courses" replace />} />
    </Routes>
  );
}
