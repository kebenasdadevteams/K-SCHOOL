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

  const handleLogout = () => { logout(); navigate('/'); };

  const sidebarW = collapsed ? 'w-16' : 'w-52';

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-secondary/20 ${collapsed ? 'justify-center' : ''}`}>
        <img src={logo} alt="Logo" className="h-8 w-8 object-contain flex-shrink-0 rounded-full"
          onError={e => e.target.style.display = 'none'} />
        {!collapsed && (
          <div>
            <p className="text-secondary font-display font-bold text-sm leading-tight">K-School</p>
            <p className="text-muted-foreground text-xs capitalize">{title}</p>
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
                  ? 'bg-secondary/15 text-secondary border border-secondary/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'}
                ${collapsed ? 'justify-center px-2' : ''}`}>
              <span className="text-base flex-shrink-0">{item.icon}</span>
              {!collapsed && <span className="flex-1">{item.label}</span>}
              {!collapsed && item.badge != null && (
                <span className="bg-secondary text-primary-foreground text-xs font-bold px-1.5 py-0.5 rounded-full">{item.badge}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User + logout */}
      <div className="border-t border-border p-3 space-y-2">
        {!collapsed && (
          <div className="flex items-center gap-2 px-2 py-1">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-bold text-sm flex-shrink-0">
              {user?.full_name?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-foreground text-xs font-semibold truncate">{user?.full_name}</p>
              <p className="text-muted-foreground text-xs truncate">{user?.email}</p>
            </div>
          </div>
        )}
        <button onClick={handleLogout}
          className={`flex items-center gap-2 w-full px-3 py-2 rounded-xl text-muted-foreground hover:text-secondary hover:bg-secondary/10 transition-all text-sm
            ${collapsed ? 'justify-center' : ''}`}>
          <span>🚪</span>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-background text-foreground">

      {/* ── Desktop Sidebar ── */}
      <aside className={`${sidebarW} hidden md:flex flex-col flex-shrink-0 bg-card border-r border-border transition-all duration-300`}>
        <NavContent />
      </aside>

      {/* ── Mobile Sidebar overlay ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-52 bg-card border-r border-border flex flex-col z-50">
            <NavContent />
          </aside>
        </div>
      )}

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Topbar */}
        <header className="bg-card border-b border-border px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-3">
            {/* Desktop collapse toggle */}
            <button onClick={() => setCollapsed(!collapsed)}
              className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg text-foreground hover:text-primary hover:bg-secondary/10 transition-all">
              {collapsed ? '→' : '←'}
            </button>
            {/* Mobile menu toggle */}
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="flex md:hidden items-center justify-center w-8 h-8 rounded-lg text-foreground hover:text-primary hover:bg-secondary/10 transition-all">
              ☰
            </button>
            <div>
              <p className="text-foreground font-semibold text-sm capitalize">{title} Dashboard</p>
              <p className="text-muted-foreground text-xs">Welcome, {user?.full_name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-secondary/10 border border-border rounded-xl px-3 py-1.5">
              <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-bold text-xs">
                {user?.full_name?.[0]?.toUpperCase()}
              </div>
              <div className="hidden sm:block">
                <p className="text-foreground text-xs font-semibold leading-tight">{user?.full_name}</p>
                <p className="text-muted-foreground text-xs leading-tight">{user?.email}</p>
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
