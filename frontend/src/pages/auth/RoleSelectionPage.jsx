import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../assets/logo.png';

const ROLES = {
  student:   { icon: '📖', desc: 'Courses, assignments & learning',   path: '/student',   color: 'border-amber-500/30 hover:border-amber-500' },
  teacher:   { icon: '🏫', desc: 'Manage courses & grade students',   path: '/teacher',   color: 'border-green-500/30 hover:border-green-500' },
  pastor:    { icon: '⛪', desc: 'Church members & attendance',       path: '/pastor',    color: 'border-purple-500/30 hover:border-purple-500' },
  editor:    { icon: '✏️', desc: 'Posts, events & website content',   path: '/editor',    color: 'border-blue-500/30 hover:border-blue-500' },
  developer: { icon: '💻', desc: 'System health & diagnostics',       path: '/developer', color: 'border-cyan-500/30 hover:border-cyan-500' },
  admin:     { icon: '🛡️', desc: 'Full system access & user control', path: '/admin',     color: 'border-red-500/30 hover:border-red-500' },
};

const RoleSelectionPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6">
      <div className="text-center mb-10">
        <img src={logo} alt="Logo" className="h-14 w-14 object-contain mx-auto mb-4 rounded-full"
          onError={e => e.target.style.display = 'none'} />
        <h1 className="font-display text-3xl font-bold text-white mb-2">Hello, {user?.full_name} 👋</h1>
        <p className="text-gray-400">Select your role to continue</p>
      </div>
      <div className={`grid gap-4 w-full max-w-2xl ${
        (user?.roles?.length || 0) <= 2 ? 'grid-cols-1 sm:grid-cols-2 max-w-lg' : 'grid-cols-2 md:grid-cols-3'}`}>
        {(user?.roles || []).map(role => {
          const r = ROLES[role]; if (!r) return null;
          return (
            <button key={role} onClick={() => navigate(r.path)}
              className={`bg-gray-900 border ${r.color} rounded-2xl p-6 text-left transition-all duration-200 hover:bg-gray-800 group`}>
              <div className="text-3xl mb-3">{r.icon}</div>
              <h3 className="text-white font-display font-semibold capitalize mb-1">{role}</h3>
              <p className="text-gray-500 text-xs">{r.desc}</p>
              <p className="text-amber-400 text-xs mt-3 group-hover:underline">Enter →</p>
            </button>
          );
        })}
      </div>
      <button onClick={logout} className="mt-10 text-gray-600 hover:text-gray-400 text-sm transition-colors">
        Sign out
      </button>
    </div>
  );
};
export default RoleSelectionPage;
