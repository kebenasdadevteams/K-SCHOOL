import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../services/api';

const NAV = [
  { path: '/pastor', icon: '🏠', label: 'Overview' },
  { path: '/pastor/members', icon: '👥', label: 'Members' },
  { path: '/pastor/attendance', icon: '📋', label: 'Attendance' },
  { path: '/pastor/reports', icon: '📊', label: 'Reports' },
];

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
    <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center p-6 border-b border-gray-800">
        <h3 className="font-display text-gold-400 text-xl">{title}</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">✕</button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  </div>
);

const Overview = () => {
  const [count, setCount] = useState(0);
  useEffect(() => { api.get('/pastor/members').then(r => setCount(r.data.data?.length || 0)).catch(() => {}); }, []);
  return (
    <div className="space-y-8">
      <div><h1 className="font-display text-2xl font-bold text-white mb-1">Pastor Dashboard</h1><p className="text-gray-400">Manage your congregation</p></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[{ label: 'Total Members', value: count, icon: '👥' }, { label: "Today's Attendance", value: '0', icon: '📋' }, { label: 'Active Ministries', value: '4', icon: '⛪' }, { label: 'Prayer Requests', value: '0', icon: '🙏' }].map(s => (
          <div key={s.label} className="card flex items-center gap-4">
            <div className="text-3xl">{s.icon}</div>
            <div><p className="text-gray-400 text-sm">{s.label}</p><p className="text-white text-2xl font-bold font-display">{s.value}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Members = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', address: '', membership_date: '', status: 'active' });

  const load = () => { setLoading(true); api.get('/pastor/members').then(r => setMembers(r.data.data || [])).catch(() => setMembers([])).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    await api.post('/pastor/members', form);
    setShowModal(false); setForm({ full_name: '', email: '', phone: '', address: '', membership_date: '', status: 'active' }); load();
  };

  const del = async (id) => { if (!confirm('Remove member?')) return; await api.delete(`/pastor/members/${id}`).catch(() => {}); load(); };

  const filtered = members.filter(m => m.full_name?.toLowerCase().includes(search.toLowerCase()) || m.email?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-display text-2xl font-bold text-white">Church Members</h1>
        <button onClick={() => setShowModal(true)} className="btn-gold text-sm py-2">+ Add Member</button>
      </div>
      <input className="input-field max-w-sm" placeholder="Search members..." value={search} onChange={e => setSearch(e.target.value)} />
      {loading ? <p className="text-gray-400">Loading...</p> : filtered.length === 0 ? (
        <div className="card text-center py-12"><p className="text-4xl mb-4">👥</p><p className="text-gray-400">{search ? 'No members found.' : 'No members yet. Add your first member.'}</p></div>
      ) : (
        <div className="card overflow-hidden p-0">
          <table className="w-full">
            <thead className="bg-gray-800 border-b border-gray-700">
              <tr>{['Name', 'Email', 'Phone', 'Status', 'Actions'].map(h => <th key={h} className="text-left px-4 py-3 text-gray-400 text-sm">{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.map(m => (
                <tr key={m.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="px-4 py-3 text-white text-sm font-medium">{m.full_name}</td>
                  <td className="px-4 py-3 text-gray-400 text-sm">{m.email || '—'}</td>
                  <td className="px-4 py-3 text-gray-400 text-sm">{m.phone || '—'}</td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full border ${m.status === 'active' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-gray-700 text-gray-400 border-gray-600'}`}>{m.status}</span></td>
                  <td className="px-4 py-3"><button onClick={() => del(m.id)} className="text-red-400 text-xs hover:text-red-300">Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {showModal && (
        <Modal title="Add Member" onClose={() => setShowModal(false)}>
          <form onSubmit={save} className="space-y-4">
            <div><label className="label">Full Name</label><input className="input-field" value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} required /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="label">Email</label><input type="email" className="input-field" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
              <div><label className="label">Phone</label><input className="input-field" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
            </div>
            <div><label className="label">Address</label><input className="input-field" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="label">Membership Date</label><input type="date" className="input-field" value={form.membership_date} onChange={e => setForm({ ...form, membership_date: e.target.value })} /></div>
              <div><label className="label">Status</label>
                <select className="input-field" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                  <option value="active">Active</option><option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3"><button type="submit" className="btn-gold">Add Member</button><button type="button" onClick={() => setShowModal(false)} className="btn-outline">Cancel</button></div>
          </form>
        </Modal>
      )}
    </div>
  );
};

const PastorDashboard = () => (
  <DashboardLayout title="Pastor" roleColor="text-purple-400" navItems={NAV}>
    <Routes>
      <Route index element={<Overview />} />
      <Route path="members" element={<Members />} />
      <Route path="attendance" element={<div className="card text-center py-12"><p className="text-4xl mb-4">📋</p><p className="text-gray-400">Attendance tracking coming soon.</p></div>} />
      <Route path="reports" element={<div className="card text-center py-12"><p className="text-4xl mb-4">📊</p><p className="text-gray-400">Reports coming soon.</p></div>} />
    </Routes>
  </DashboardLayout>
);

export default PastorDashboard;
