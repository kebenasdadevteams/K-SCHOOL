import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/logo.png';

const DashboardLayout = ({ title, navItems = [], children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const sidebarW = collapsed ? 'w-16' : 'w-52';

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-amber-500/20 ${collapsed ? 'justify-center' : ''}`}>
        <img src={logo} alt="Logo" className="h-8 w-8 object-contain flex-shrink-0 rounded-full"
          onError={e => e.target.style.display = 'none'} />
        {!collapsed && (
          <div>
            <p className="text-amber-400 font-display font-bold text-sm leading-tight">K-School</p>
            <p className="text-gray-500 text-xs capitalize">{title}</p>
          </div>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map(item => {
          const exact = item.path === `/${title.toLowerCase()}`;
          const isActive = exact
            ? location.pathname === item.path
            : location.pathname.startsWith(item.path);
          return (
            <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}
              title={collapsed ? item.label : ''}
              className={`flex items-center gap-3 px-3 py-2.5 mx-2 rounded-xl text-sm font-medium transition-all
                ${isActive
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'}
                ${collapsed ? 'justify-center px-2' : ''}`}>
              <span className="text-base flex-shrink-0">{item.icon}</span>
              {!collapsed && <span className="flex-1">{item.label}</span>}
              {!collapsed && item.badge != null && (
                <span className="bg-amber-500 text-black text-xs font-bold px-1.5 py-0.5 rounded-full">{item.badge}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User + logout */}
      <div className="border-t border-gray-800 p-3 space-y-2">
        {!collapsed && (
          <div className="flex items-center gap-2 px-2 py-1">
            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-black font-bold text-sm flex-shrink-0">
              {user?.full_name?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-semibold truncate">{user?.full_name}</p>
              <p className="text-gray-500 text-xs truncate">{user?.email}</p>
            </div>
          </div>
        )}
        <button onClick={handleLogout}
          className={`flex items-center gap-2 w-full px-3 py-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm
            ${collapsed ? 'justify-center' : ''}`}>
          <span>🚪</span>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-gray-950">

      {/* ── Desktop Sidebar ── */}
      <aside className={`${sidebarW} hidden md:flex flex-col flex-shrink-0 bg-gray-900 border-r border-gray-800 transition-all duration-300`}>
        <NavContent />
      </aside>

      {/* ── Mobile Sidebar overlay ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-52 bg-gray-900 border-r border-gray-800 flex flex-col z-50">
            <NavContent />
          </aside>
        </div>
      )}

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Topbar */}
        <header className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            {/* Desktop collapse toggle */}
            <button onClick={() => setCollapsed(!collapsed)}
              className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all">
              {collapsed ? '→' : '←'}
            </button>
            {/* Mobile menu toggle */}
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="flex md:hidden items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all">
              ☰
            </button>
            <div>
              <p className="text-white font-semibold text-sm capitalize">{title} Dashboard</p>
              <p className="text-gray-500 text-xs">Welcome, {user?.full_name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/role-selection"
              className="hidden sm:block text-gray-400 hover:text-white text-xs px-3 py-1.5 rounded-lg border border-gray-700 hover:border-gray-600 transition-all">
              Switch Role
            </Link>
            <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-xl px-3 py-1.5">
              <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center text-black font-bold text-xs">
                {user?.full_name?.[0]?.toUpperCase()}
              </div>
              <div className="hidden sm:block">
                <p className="text-white text-xs font-semibold leading-tight">{user?.full_name}</p>
                <p className="text-gray-500 text-xs leading-tight">{user?.email}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content — NOT hidden behind sidebar */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
