import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';

const NAV = [
  { path: '/developer', icon: '🏠', label: 'Overview' },
  { path: '/developer/logs', icon: '📋', label: 'Logs' },
  { path: '/developer/health', icon: '💚', label: 'Health' },
  { path: '/developer/api-status', icon: '🔌', label: 'API Status' },
];

const HealthCheck = () => {
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    fetch('/health').then(r => r.json()).then(() => setStatus('ok')).catch(() => setStatus('error'));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-white">System Health</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-display text-gold-400 mb-4">API Server</h3>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${status === 'ok' ? 'bg-green-400' : status === 'error' ? 'bg-red-400' : 'bg-yellow-400 animate-pulse'}`} />
            <span className="text-white capitalize">{status === 'ok' ? 'Online' : status === 'error' ? 'Offline' : 'Checking...'}</span>
          </div>
        </div>
        <div className="card">
          <h3 className="font-display text-gold-400 mb-4">Database</h3>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-gray-500" />
            <span className="text-gray-400">Not monitored</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Overview = () => (
  <div className="space-y-8">
    <div>
      <h1 className="font-display text-2xl font-bold text-white mb-1">Developer Dashboard</h1>
      <p className="text-gray-400">System monitoring and diagnostics</p>
    </div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[{ label: 'API Status', value: 'Online', icon: '🔌' }, { label: 'DB Status', value: 'Active', icon: '🗄️' }, { label: 'Errors (24h)', value: '0', icon: '❌' }, { label: 'Uptime', value: '100%', icon: '⬆️' }].map(s => (
        <div key={s.label} className="card flex items-center gap-4">
          <div className="text-3xl">{s.icon}</div>
          <div>
            <p className="text-gray-400 text-sm">{s.label}</p>
            <p className="text-white text-lg font-bold font-display">{s.value}</p>
          </div>
        </div>
      ))}
    </div>
    <div className="card">
      <h3 className="font-display text-gold-400 text-lg font-semibold mb-4">Environment</h3>
      <div className="space-y-3 font-mono text-sm">
        {[['Frontend', 'React + Vite'], ['Backend', 'Node.js + Express'], ['Database', 'MySQL'], ['Auth', 'JWT'], ['Deployment', 'Vercel + Render']].map(([k, v]) => (
          <div key={k} className="flex justify-between border-b border-gray-800 pb-2">
            <span className="text-gray-400">{k}</span>
            <span className="text-gold-400">{v}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const DeveloperDashboard = () => (
  <DashboardLayout title="Developer" roleColor="text-cyan-400" navItems={NAV}>
    <Routes>
      <Route index element={<Overview />} />
      <Route path="logs" element={<div className="card text-center py-12"><p className="text-4xl mb-4">📋</p><p className="text-gray-400">Log viewer coming soon.</p></div>} />
      <Route path="health" element={<HealthCheck />} />
      <Route path="api-status" element={<div className="card text-center py-12"><p className="text-4xl mb-4">🔌</p><p className="text-gray-400">API status monitor coming soon.</p></div>} />
    </Routes>
  </DashboardLayout>
);

export default DeveloperDashboard;
