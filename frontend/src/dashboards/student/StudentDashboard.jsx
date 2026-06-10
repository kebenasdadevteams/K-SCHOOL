import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { courseService } from '../../services/course-service';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const NAV = [
  { path: '/student', icon: '🏠', label: 'Dashboard' },
  { path: '/student/courses', icon: '📖', label: 'My Courses' },
  { path: '/student/podcasts', icon: '🎧', label: 'Podcasts' },
  { path: '/student/assignments', icon: '📝', label: 'Assignments' },
];

const Overview = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [events, setEvents] = useState([]);
  useEffect(() => {
    courseService.getAll().then(r => setCourses(r.data.data || [])).catch(() => {});
    api.get('/public/events').then(r => setEvents(r.data.data || [])).catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-amber-600 to-amber-800 rounded-2xl p-6 text-white">
        <p className="text-amber-200 text-sm mb-1">Student Dashboard</p>
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.full_name}! 👋</h1>
        <p className="text-amber-100/70 text-sm">Continue your learning journey and track progress.</p>
        <div className="flex gap-3 mt-4">
          <Link to="/student/courses" className="bg-white/20 hover:bg-white/30 text-white text-sm px-4 py-2 rounded-xl transition-all">My Courses</Link>
          <Link to="/student/assignments" className="bg-white text-amber-800 hover:bg-amber-50 text-sm px-4 py-2 rounded-xl font-semibold transition-all">Assignments</Link>
        </div>
      </div>

      {events[0] && (
        <div className="bg-gray-900 border border-amber-500/20 rounded-2xl p-5">
          <div className="flex gap-2 mb-2">
            <span className="badge-gold">Latest Event</span>
            <span className="badge-green">Active</span>
          </div>
          <h3 className="text-white font-semibold">{events[0].title_am || events[0].title}</h3>
          <p className="text-gray-400 text-sm mt-1">{events[0].description_am || events[0].description}</p>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[{ l: 'Enrolled Courses', v: courses.length, i: '📖' },
          { l: 'Lessons Completed', v: '0', i: '✅' },
          { l: 'Hours Learned', v: '0h', i: '⏱️' },
          { l: 'Certificates', v: '0', i: '🏆' }].map(s => (
          <div key={s.l} className="card">
            <div className="flex justify-between items-start mb-3">
              <p className="text-gray-400 text-sm">{s.l}</p>
              <span className="text-2xl">{s.i}</span>
            </div>
            <p className="text-white text-3xl font-bold">{s.v}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-white font-semibold mb-4">Continue Learning</h3>
          {courses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm mb-3">No courses enrolled yet.</p>
              <Link to="/student/courses" className="btn-gold text-sm py-2">Browse Courses</Link>
            </div>
          ) : courses.slice(0, 3).map(c => (
            <div key={c.id} className="border-b border-gray-800 pb-4 mb-4 last:border-0 last:mb-0">
              <div className="flex justify-between mb-2">
                <p className="text-white text-sm font-medium">{c.title}</p>
                <span className="text-gray-500 text-xs">0%</span>
              </div>
              <div className="h-1.5 bg-gray-800 rounded-full mb-3">
                <div className="h-full bg-amber-500 rounded-full w-0" />
              </div>
              <div className="flex gap-2">
                <button className="btn-gold text-xs py-1.5 px-3">Resume</button>
                <button className="btn-outline text-xs py-1.5 px-3">View</button>
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <h3 className="text-white font-semibold mb-4">Upcoming Assignments</h3>
          <div className="text-center py-8">
            <p className="text-5xl mb-3">📝</p>
            <p className="text-gray-500 text-sm">No assignments yet.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  useEffect(() => { courseService.getAll().then(r => setCourses(r.data.data || [])).finally(() => setLoading(false)); }, []);
  const filtered = courses.filter(c => c.title?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-amber-600 to-amber-800 rounded-2xl p-6 text-white">
        <p className="text-amber-200 text-xs mb-2">Faith-Based Learning</p>
        <h1 className="text-2xl font-bold">Transform Your Faith Through Learning</h1>
        <p className="text-amber-100/70 text-sm mt-1">Access Bible courses and grow in your spiritual journey</p>
      </div>
      <input className="input-field max-w-md" placeholder="Search courses..." value={search} onChange={e => setSearch(e.target.value)} />
      {loading ? <p className="text-gray-400">Loading...</p> :
        filtered.length === 0 ? (
          <div className="card text-center py-16">
            <p className="text-5xl mb-4">📚</p>
            <p className="text-gray-400">No courses available yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(c => (
              <div key={c.id} className="card hover:border-amber-500/30 transition-all">
                <div className="h-36 bg-gradient-to-br from-amber-600/20 to-amber-800/20 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-5xl">📖</span>
                </div>
                <div className="flex gap-2 mb-2">
                  <span className="badge-gray">Beginner</span>
                  <span className="badge-gold">{c.category || 'Bible Study'}</span>
                </div>
                <h3 className="text-white font-semibold mb-1">{c.title}</h3>
                <p className="text-gray-500 text-xs mb-4 line-clamp-2">{c.description}</p>
                <button className="btn-gold w-full text-sm py-2">Enroll →</button>
              </div>
            ))}
          </div>
        )}
    </div>
  );
};

const Podcasts = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get('/public/podcasts').then(r => setPodcasts(r.data.data || [])).finally(() => setLoading(false)); }, []);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-amber-600 to-amber-800 rounded-2xl p-6 text-white">
        <p className="text-amber-200 text-xs mb-2">Media Center</p>
        <h1 className="text-2xl font-bold">Podcast & Sermon Center</h1>
      </div>
      {loading ? <p className="text-gray-400">Loading...</p> :
        podcasts.length === 0 ? (
          <div className="card text-center py-16">
            <p className="text-5xl mb-4">🎧</p>
            <p className="text-gray-400">No podcasts published yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {podcasts.map(p => (
              <div key={p.id} className="card hover:border-amber-500/30 transition-all">
                <div className="h-28 bg-gradient-to-br from-amber-600/20 to-amber-800/20 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-4xl">🎙️</span>
                </div>
                <h3 className="text-white font-semibold mb-1">{p.title}</h3>
                <p className="text-gray-500 text-sm mb-3 line-clamp-2">{p.description}</p>
                {p.audio_url && <audio controls className="w-full" src={p.audio_url} />}
              </div>
            ))}
          </div>
        )}
    </div>
  );
};

const StudentDashboard = () => (
  <DashboardLayout title="Student" navItems={NAV}>
    <Routes>
      <Route index element={<Overview />} />
      <Route path="courses" element={<MyCourses />} />
      <Route path="podcasts" element={<Podcasts />} />
      <Route path="assignments" element={
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-amber-600 to-amber-800 rounded-2xl p-6 text-white">
            <p className="text-amber-200 text-xs mb-2">Assignments</p>
            <h1 className="text-2xl font-bold">My Assignments</h1>
          </div>
          <div className="card text-center py-16"><p className="text-5xl mb-4">📝</p><p className="text-gray-400">No assignments yet.</p></div>
        </div>
      } />
    </Routes>
  </DashboardLayout>
);

export default StudentDashboard;
