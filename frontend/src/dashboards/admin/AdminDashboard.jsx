import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../services/api';

const NAV = [
  { path: '/admin', icon: '🏠', label: 'Overview' },
  { path: '/admin/users', icon: '👥', label: 'Users' },
  { path: '/admin/roles', icon: '🛡️', label: 'Roles' },
  { path: '/admin/audit', icon: '📋', label: 'Audit Logs' },
];

const Overview = () => {
  const [userCount, setUserCount] = useState(0);
  useEffect(() => {
    api.get('/users').then(r => setUserCount(r.data.data.length)).catch(() => {});
  }, []);
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-white mb-1">Admin Dashboard</h1>
        <p className="text-gray-400">Full system control</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[{ label: 'Total Users', value: userCount, icon: '👥' }, { label: 'Active Roles', value: '6', icon: '🛡️' }, { label: 'Courses', value: '0', icon: '📚' }, { label: 'Audit Logs', value: '0', icon: '📋' }].map(s => (
          <div key={s.label} className="card flex items-center gap-4">
            <div className="text-3xl">{s.icon}</div>
            <div>
              <p className="text-gray-400 text-sm">{s.label}</p>
              <p className="text-white text-2xl font-bold font-display">{s.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ROLES_LIST = ['student', 'teacher', 'pastor', 'editor', 'developer', 'admin'];

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedRoles, setSelectedRoles] = useState([]);

  const load = () => api.get('/users').then(r => setUsers(r.data.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const openEdit = (user) => {
    setEditingUser(user);
    setSelectedRoles([...user.roles]);
  };

  const toggleRole = (role) => {
    setSelectedRoles(prev => prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]);
  };

  const saveRoles = async () => {
    await api.put(`/users/${editingUser.id}/roles`, { roles: selectedRoles });
    setEditingUser(null);
    load();
  };

  const deleteUser = async (id) => {
    if (!confirm('Delete this user?')) return;
    await api.delete(`/users/${id}`);
    load();
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-white">User Management</h1>

      {editingUser && (
        <div className="card border-gold-500/30">
          <h3 className="font-display text-gold-400 mb-4">Edit Roles: {editingUser.full_name}</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {ROLES_LIST.map(role => (
              <button key={role}
                onClick={() => toggleRole(role)}
                className={`px-3 py-1.5 rounded-full text-sm border transition-colors capitalize ${selectedRoles.includes(role) ? 'bg-gold-500 text-black border-gold-500' : 'border-gray-600 text-gray-400 hover:border-gray-400'}`}>
                {role}
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={saveRoles} className="btn-gold text-sm py-2">Save Roles</button>
            <button onClick={() => setEditingUser(null)} className="btn-outline text-sm py-2">Cancel</button>
          </div>
        </div>
      )}

      {loading ? <p className="text-gray-400">Loading...</p> : (
        <div className="card overflow-hidden p-0">
          <table className="w-full">
            <thead className="bg-gray-800 border-b border-gray-700">
              <tr>
                {['Name', 'Email', 'Roles', 'Joined', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-gray-400 text-sm font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                  <td className="px-4 py-3 text-white text-sm">{u.full_name}</td>
                  <td className="px-4 py-3 text-gray-400 text-sm">{u.email}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {u.roles.map(r => (
                        <span key={r} className="text-xs bg-gold-500/10 text-gold-400 border border-gold-500/20 px-2 py-0.5 rounded-full capitalize">{r}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-sm">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(u)} className="text-blue-400 hover:text-blue-300 text-xs">Edit Roles</button>
                      <button onClick={() => deleteUser(u.id)} className="text-red-400 hover:text-red-300 text-xs">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const AdminDashboard = () => (
  <DashboardLayout title="Admin" roleColor="text-red-400" navItems={NAV}>
    <Routes>
      <Route index element={<Overview />} />
      <Route path="users" element={<Users />} />
      <Route path="roles" element={<div className="card text-center py-12"><p className="text-4xl mb-4">🛡️</p><p className="text-gray-400">Role management coming soon.</p></div>} />
      <Route path="audit" element={<div className="card text-center py-12"><p className="text-4xl mb-4">📋</p><p className="text-gray-400">Audit logs coming soon.</p></div>} />
    </Routes>
  </DashboardLayout>
);

export default AdminDashboard;
