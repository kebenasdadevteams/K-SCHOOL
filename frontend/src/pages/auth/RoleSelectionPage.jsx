import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../assets/logo.png';

const ROLES = {
  student:   { icon: '📖', desc: 'Courses, assignments & learning',   path: '/student',   color: 'border-secondary/30 hover:border-secondary' },
  teacher:   { icon: '🏫', desc: 'Manage courses & grade students',   path: '/teacher',   color: 'border-primary/20 hover:border-primary' },
  pastor:    { icon: '⛪', desc: 'Church members & attendance',       path: '/pastor',    color: 'border-secondary/30 hover:border-secondary' },
  editor:    { icon: '✏️', desc: 'Posts, events & website content',   path: '/editor',    color: 'border-primary/20 hover:border-primary' },
  developer: { icon: '💻', desc: 'System health & diagnostics',       path: '/developer', color: 'border-secondary/30 hover:border-secondary' },
  admin:     { icon: '🛡️', desc: 'Full system access & user control', path: '/admin',     color: 'border-secondary/30 hover:border-secondary' },
};

const RoleSelectionPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6">
      <div className="text-center mb-10">
        <img src={logo} alt="Logo" className="h-14 w-14 object-contain mx-auto mb-4 rounded-full"
          onError={e => e.target.style.display = 'none'} />
        <h1 className="font-display text-3xl font-bold text-primary mb-2">Hello, {user?.full_name} 👋</h1>
        <p className="text-muted-foreground">Select your role to continue</p>
      </div>
      <div className={`grid gap-4 w-full max-w-2xl ${
        (user?.roles?.length || 0) <= 2 ? 'grid-cols-1 sm:grid-cols-2 max-w-lg' : 'grid-cols-2 md:grid-cols-3'}`}>
        {(user?.roles || []).map(role => {
          const r = ROLES[role]; if (!r) return null;
          return (
            <button
              key={role}
              onClick={() => {
                localStorage.setItem('kschool_last_role', role);
                navigate(r.path);
              }}
              className={`bg-card border border-border ${r.color} rounded-2xl p-6 text-left transition-all duration-200 hover:bg-secondary/10 group`}>
              <div className="text-3xl mb-3">{r.icon}</div>
              <h3 className="text-primary font-display font-semibold capitalize mb-1">{role}</h3>
              <p className="text-muted-foreground text-xs">{r.desc}</p>
              <p className="text-secondary text-xs mt-3 group-hover:underline">Enter →</p>
            </button>
          );
        })}
      </div>
      <button onClick={logout} className="mt-10 text-muted-foreground hover:text-foreground text-sm transition-colors">
        Sign out
      </button>
    </div>
  );
};
export default RoleSelectionPage;
