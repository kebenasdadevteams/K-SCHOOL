import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const NAV = [
  { path: '/teacher', icon: '🏠', label: 'Overview' },
  { path: '/teacher/courses', icon: '📚', label: 'My Courses' },
  { path: '/teacher/lessons', icon: '📖', label: 'Lessons' },
  { path: '/teacher/assignments', icon: '📝', label: 'Assignments' },
  { path: '/teacher/submissions', icon: '📬', label: 'Submissions' },
];

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
    <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center p-6 border-b border-gray-800">
        <h3 className="font-display text-gold-400 text-xl font-semibold">{title}</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">✕</button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  </div>
);

const Overview = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  useEffect(() => { api.get('/courses').then(r => setCourses(r.data.data || [])).catch(() => {}); }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-white mb-1">Teacher Dashboard</h1>
        <p className="text-gray-400">Welcome, {user?.full_name}</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[{ label: 'My Courses', value: courses.length, icon: '📚' }, { label: 'Total Lessons', value: '0', icon: '📖' }, { label: 'Pending Reviews', value: '0', icon: '📬' }].map(s => (
          <div key={s.label} className="card flex items-center gap-4">
            <div className="text-3xl">{s.icon}</div>
            <div><p className="text-gray-400 text-sm">{s.label}</p><p className="text-white text-2xl font-bold font-display">{s.value}</p></div>
          </div>
        ))}
      </div>
      <div className="card">
        <h3 className="font-display text-gold-400 text-lg font-semibold mb-4">Recent Courses</h3>
        {courses.length === 0 ? <p className="text-gray-500 text-center py-6">No courses yet. <Link to="/teacher/courses" className="text-gold-400 hover:underline">Create your first course →</Link></p> : (
          <div className="space-y-3">
            {courses.slice(0, 5).map(c => (
              <div key={c.id} className="flex justify-between items-center border-b border-gray-800 pb-3 last:border-0">
                <div>
                  <p className="text-white font-medium">{c.title}</p>
                  <p className="text-gray-500 text-sm">{c.category} · <span className={c.status === 'published' ? 'text-green-400' : 'text-yellow-400'}>{c.status}</span></p>
                </div>
                <Link to="/teacher/courses" className="text-gold-400 text-sm hover:underline">Manage →</Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', category: '', status: 'draft' });

  const load = () => { setLoading(true); api.get('/courses').then(r => setCourses(r.data.data || [])).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm({ title: '', description: '', category: '', status: 'draft' }); setShowModal(true); };
  const openEdit = (c) => { setEditing(c); setForm({ title: c.title, description: c.description || '', category: c.category || '', status: c.status }); setShowModal(true); };

  const save = async (e) => {
    e.preventDefault();
    if (editing) await api.put(`/courses/${editing.id}`, form);
    else await api.post('/courses', form);
    setShowModal(false); load();
  };

  const del = async (id) => { if (!confirm('Delete course?')) return; await api.delete(`/courses/${id}`); load(); };

  const toggleStatus = async (c) => {
    await api.put(`/courses/${c.id}`, { ...c, status: c.status === 'published' ? 'draft' : 'published' });
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-display text-2xl font-bold text-white">My Courses</h1>
        <button onClick={openNew} className="btn-gold text-sm py-2">+ New Course</button>
      </div>
      {loading ? <p className="text-gray-400">Loading...</p> : courses.length === 0 ? (
        <div className="card text-center py-12"><p className="text-4xl mb-4">📚</p><p className="text-gray-400">No courses yet.</p></div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {courses.map(c => (
            <div key={c.id} className="card hover:border-gold-500/40 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-display text-gold-400 font-semibold">{c.title}</h3>
                <button onClick={() => toggleStatus(c)} className={`text-xs px-2 py-1 rounded-full border transition-colors ${c.status === 'published' ? 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20' : 'bg-gray-700 text-gray-400 border-gray-600 hover:bg-green-500/10 hover:text-green-400'}`}>
                  {c.status}
                </button>
              </div>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">{c.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs bg-gold-500/10 text-gold-400 border border-gold-500/20 px-2 py-1 rounded-full">{c.category || 'General'}</span>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(c)} className="text-blue-400 text-sm px-3 py-1 border border-blue-400/30 rounded-lg">Edit</button>
                  <button onClick={() => del(c.id)} className="text-red-400 text-sm px-3 py-1 border border-red-400/30 rounded-lg">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {showModal && (
        <Modal title={editing ? 'Edit Course' : 'New Course'} onClose={() => setShowModal(false)}>
          <form onSubmit={save} className="space-y-4">
            <div><label className="label">Title</label><input className="input-field" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></div>
            <div><label className="label">Description</label><textarea className="input-field" rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
            <div><label className="label">Category</label><input className="input-field" placeholder="e.g. Bible Study, Youth" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} /></div>
            <div><label className="label">Status</label>
              <select className="input-field" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="draft">Draft</option><option value="published">Published</option>
              </select>
            </div>
            <div className="flex gap-3"><button type="submit" className="btn-gold">Save</button><button type="button" onClick={() => setShowModal(false)} className="btn-outline">Cancel</button></div>
          </form>
        </Modal>
      )}
    </div>
  );
};

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ course_id: '', title: '', description: '', due_date: '' });

  const load = async () => {
    setLoading(true);
    try {
      const cr = await api.get('/courses');
      setCourses(cr.data.data || []);
      // Load assignments per course
      const allAssignments = [];
      for (const c of cr.data.data || []) {
        try {
          const ar = await api.get(`/courses/${c.id}`);
          // assignments would be in course detail
        } catch {}
      }
      setAssignments(allAssignments);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-display text-2xl font-bold text-white">Assignments</h1>
        <button onClick={() => setShowModal(true)} className="btn-gold text-sm py-2" disabled={courses.length === 0}>+ New Assignment</button>
      </div>
      {courses.length === 0 && <div className="card text-center py-8"><p className="text-gray-400">Create a course first before adding assignments.</p><Link to="/teacher/courses" className="text-gold-400 hover:underline text-sm mt-2 inline-block">Go to Courses →</Link></div>}
      <div className="card text-center py-12"><p className="text-4xl mb-4">📝</p><p className="text-gray-400">Assignment management coming — create courses first to link assignments.</p></div>
      {showModal && (
        <Modal title="New Assignment" onClose={() => setShowModal(false)}>
          <form className="space-y-4" onSubmit={e => { e.preventDefault(); setShowModal(false); }}>
            <div><label className="label">Course</label>
              <select className="input-field" value={form.course_id} onChange={e => setForm({ ...form, course_id: e.target.value })} required>
                <option value="">Select course</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>
            <div><label className="label">Title</label><input className="input-field" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></div>
            <div><label className="label">Description</label><textarea className="input-field" rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
            <div><label className="label">Due Date</label><input type="datetime-local" className="input-field" value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} /></div>
            <div className="flex gap-3"><button type="submit" className="btn-gold">Save</button><button type="button" onClick={() => setShowModal(false)} className="btn-outline">Cancel</button></div>
          </form>
        </Modal>
      )}
    </div>
  );
};

const TeacherDashboard = () => (
  <DashboardLayout title="Teacher" roleColor="text-green-400" navItems={NAV}>
    <Routes>
      <Route index element={<Overview />} />
      <Route path="courses" element={<Courses />} />
      <Route path="lessons" element={<div className="space-y-4"><h1 className="font-display text-2xl font-bold text-white">Lessons</h1><div className="card"><p className="text-gray-400 mb-4">Select a course to manage its lessons.</p><Link to="/teacher/courses" className="btn-gold text-sm py-2">Go to Courses</Link></div></div>} />
      <Route path="assignments" element={<Assignments />} />
      <Route path="submissions" element={<div className="card text-center py-12"><p className="text-4xl mb-4">📬</p><p className="text-gray-400">No submissions yet. Students will submit assignments here.</p></div>} />
    </Routes>
  </DashboardLayout>
);

export default TeacherDashboard;
