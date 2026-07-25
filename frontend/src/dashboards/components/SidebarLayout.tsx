import { ReactNode, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import {
  Home,
  BookOpen,
  FileText,
  Megaphone,
  Users,
  Headphones,
  Calendar,
  Settings,
  LogOut,
  Menu,
  X,
  Church,
  BarChart3,
  Shield,
  GraduationCap,
  UserCircle,
  Mail,
  Bell,
  HelpCircle,
  ChevronDown,
  LayoutDashboard,
  FolderOpen,
  Radio,
  Gift,
  UserPlus,
  TrendingUp,
  Cog,
  ChevronRight,
  Sparkles
} from 'lucide-react';

type ActiveView = 'student' | 'teacher' | 'pastor' | 'editor' | 'admin' | 'developer';

interface SidebarLayoutProps {
  children: ReactNode;
  userRole?: string;
  userName?: string;
  userEmail?: string;
  onViewChange?: (view: ActiveView) => void;
  activeView?: ActiveView;
}

export function SidebarLayout({
  children,
  userRole = 'student',
  userName = 'Demo User',
  userEmail = 'demo@church.com',
  onViewChange,
  activeView: externalActiveView
}: SidebarLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: authUser, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktopSidebarVisible, setIsDesktopSidebarVisible] = useState(true);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [sidebarCounts, setSidebarCounts] = useState({
    content: 0,
    podcasts: 0,
    users: 0,
    courses: 0,
    assignments: 0,
    messages: 0,
    notifications: 0,
  });

  const actualUserName = authUser?.full_name || userName || 'Demo User';
  const actualUserEmail = authUser?.email || userEmail || 'demo@church.com';
  const settingsKey = `church-cms-settings-${userRole}-${externalActiveView ?? (userRole === 'teacher' ? 'teacher' : userRole === 'pastor' ? 'pastor' : userRole === 'editor' ? 'editor' : userRole === 'admin' ? 'admin' : userRole === 'developer' ? 'developer' : 'student')}`;

  const readProfile = () => {
    try {
      const stored = localStorage.getItem(settingsKey);
      if (stored) {
        const parsed = JSON.parse(stored) as { displayName?: string; emailAddress?: string };
        return {
          name: parsed.displayName || actualUserName,
          email: parsed.emailAddress || actualUserEmail,
        };
      }
    } catch {
      // Fall back to props when local storage is not available or malformed.
    }

    return { name: actualUserName, email: actualUserEmail };
  };

  const [{ name: profileName, email: profileEmail }, setProfile] = useState(() => readProfile());
  const [internalActiveView, setInternalActiveView] = useState<ActiveView>(
    userRole === 'teacher'
      ? 'teacher'
      : userRole === 'pastor'
        ? 'pastor'
        : userRole === 'editor'
          ? 'editor'
          : userRole === 'admin'
            ? 'admin'
            : userRole === 'developer'
              ? 'developer'
            : 'student'
  );

  const activeView = externalActiveView !== undefined ? externalActiveView : internalActiveView;

  const handleViewChange = (view: ActiveView) => {
    const nextRole = view === 'student' ? 'student' : view;
    setInternalActiveView(view);
    onViewChange?.(view);
    localStorage.setItem('kschool_last_role', view);

    const targetPath =
      view === 'student'
        ? '/student'
        : view === 'teacher'
          ? '/teacher'
          : view === 'pastor'
            ? '/pastor'
            : view === 'editor'
              ? '/editor'
              : view === 'developer'
                ? '/developer'
                : view === 'admin'
                  ? '/admin'
                  : '/student';

    navigate(targetPath, {
      state: {
        ...((location.state as Record<string, unknown>) || {}),
        role: nextRole,
        view,
      },
    });
  };

  const handleLogout = () => {
    try { logout(); } catch (e) {}
    navigate('/');
  };

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const loadSidebarCounts = async () => {
      try {
        const shouldLoadContent = ['admin', 'editor', 'teacher', 'pastor', 'developer'].includes(activeView);
        const shouldLoadUsers = activeView === 'admin';
        const shouldLoadStudentActivity = activeView === 'student';
        const shouldLoadTeacherCourses = activeView === 'teacher';

        const requests = [
          api.get('/activity/messages'),
          api.get('/activity/notifications'),
        ];

        if (shouldLoadContent) {
          requests.push(api.get('/content/all'));
          requests.push(api.get('/content/podcasts'));
        }

        if (shouldLoadUsers) {
          requests.push(api.get('/users'));
        }

        if (shouldLoadStudentActivity) {
          requests.push(api.get('/activity/enrollments'));
          requests.push(api.get('/activity/assignments'));
        }

        if (shouldLoadTeacherCourses) {
          requests.push(api.get('/courses'));
        }

        const results = await Promise.allSettled(requests);
        let index = 0;

        const messagesResult = results[index++];
        const notificationsResult = results[index++];

        const messages = messagesResult.status === 'fulfilled' ? messagesResult.value.data?.data || [] : [];
        const notifications = notificationsResult.status === 'fulfilled' ? notificationsResult.value.data?.data || [] : [];

        const counts: Record<string, number> = {
          content: sidebarCounts.content,
          podcasts: sidebarCounts.podcasts,
          users: sidebarCounts.users,
          courses: sidebarCounts.courses,
          assignments: sidebarCounts.assignments,
          messages: messages.length,
          notifications: notifications.filter((item: any) => !item.is_read).length,
        };

        if (shouldLoadContent) {
          const contentResult = results[index++];
          const podcastsResult = results[index++];
          counts.content = contentResult.status === 'fulfilled' ? contentResult.value.data?.data?.length || 0 : 0;
          counts.podcasts = podcastsResult.status === 'fulfilled' ? podcastsResult.value.data?.data?.length || 0 : 0;
        }

        if (shouldLoadUsers) {
          const usersResult = results[index++];
          counts.users = usersResult.status === 'fulfilled' ? usersResult.value.data?.data?.length || 0 : 0;
        }

        if (shouldLoadStudentActivity) {
          const enrollmentsResult = results[index++];
          const assignmentsResult = results[index++];
          const enrollments = enrollmentsResult.status === 'fulfilled' ? enrollmentsResult.value.data?.data || [] : [];
          const assignments = assignmentsResult.status === 'fulfilled' ? assignmentsResult.value.data?.data || [] : [];
          counts.courses = enrollments.length;
          counts.assignments = assignments.filter((item: any) => item.status !== 'graded').length;
        }

        if (shouldLoadTeacherCourses) {
          const teacherCoursesResult = results[index++];
          counts.courses = teacherCoursesResult.status === 'fulfilled' ? teacherCoursesResult.value.data?.data?.length || 0 : 0;
        }

        setSidebarCounts((prev) => ({ ...prev, ...counts }));
      } catch (error) {
        console.error('Unable to load sidebar counts', error);
      }
    };

    loadSidebarCounts();
  }, [activeView]);

  useEffect(() => {
    const syncProfile = () => setProfile(readProfile());

    syncProfile();
    window.addEventListener('storage', syncProfile);
    window.addEventListener('church-cms-profile-updated', syncProfile as EventListener);

    return () => {
      window.removeEventListener('storage', syncProfile);
      window.removeEventListener('church-cms-profile-updated', syncProfile as EventListener);
    };
  }, [settingsKey, userEmail, userName]);

  const userRoles = Array.isArray(authUser?.roles)
    ? authUser.roles.map((role: string) => String(role).trim().toLowerCase())
    : [];
  const canSwitchRole = userRoles.some((role) => ['teacher', 'pastor', 'editor', 'admin', 'developer'].includes(role))
    || userRole === 'teacher'
    || userRole === 'pastor'
    || userRole === 'editor'
    || userRole === 'admin'
    || userRole === 'developer';

  const roleOptions: Array<{ view: ActiveView; label: string; icon: React.ComponentType<any> }> = [
    { view: 'student', label: 'Student View', icon: UserCircle },
    ...(userRoles.includes('teacher') ? [{ view: 'teacher', label: 'Teacher View', icon: GraduationCap }] : []),
    ...(userRoles.includes('pastor') ? [{ view: 'pastor', label: 'Pastor View', icon: Church }] : []),
    ...(userRoles.includes('editor') ? [{ view: 'editor', label: 'Editor View', icon: FileText }] : []),
    ...(userRoles.includes('admin') ? [{ view: 'admin', label: 'Admin View', icon: Shield }] : []),
    ...(userRoles.includes('developer') ? [{ view: 'developer', label: 'Developer View', icon: Shield }] : []),
  ];

  const currentRoleOption = roleOptions.find((option) => option.view === activeView) ?? roleOptions[0];
  const CurrentRoleIcon = currentRoleOption.icon;

  // Define menu items with icons matching the new theme
  const getMenuItems = () => {
    // Admin view
    if (userRole === 'admin' && activeView === 'admin') {
      return [
        { 
          label: 'Dashboard', 
          icon: LayoutDashboard, 
          path: '/admin',
          description: 'Overview & stats'
        },
        { 
          label: 'Content', 
          icon: FolderOpen, 
          path: '/admin/content',
          description: 'Manage content',
          badge: String(sidebarCounts.content)
        },
        { 
          label: 'Podcasts', 
          icon: Radio, 
          path: '/admin/podcasts',
          description: 'Audio episodes',
          badge: String(sidebarCounts.podcasts)
        },
        { 
          label: 'Messages', 
          icon: Mail, 
          path: '/admin/messages',
          description: 'Communications'
        },
        { 
          label: 'Promotions', 
          icon: Gift, 
          path: '/admin/promotions',
          description: 'Marketing & events'
        },
        { 
          label: 'Users', 
          icon: Users, 
          path: '/admin/users',
          description: 'Manage accounts',
          badge: String(sidebarCounts.users)
        },
        { 
          label: 'Analytics', 
          icon: TrendingUp, 
          path: '/admin/analytics',
          description: 'Platform insights'
        },
        // Add Settings to admin menu
        { 
          label: 'Settings', 
          icon: Cog, 
          path: '/admin/settings',
          description: 'System settings'
        },
      ];
    }

    // If a role is viewing as student, show only student items
    if (canSwitchRole && activeView === 'student') {
      return [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/student', description: 'Your overview' },
        { label: 'My Courses', icon: BookOpen, path: '/student/courses', badge: String(sidebarCounts.courses), description: 'Learning progress' },
        { label: 'Podcasts', icon: Radio, path: '/student/podcasts', description: 'Audio content' },
        { label: 'Assignments', icon: Calendar, path: '/student/assignments', badge: String(sidebarCounts.assignments), description: 'Tasks & deadlines' },
        { label: 'Messages', icon: Mail, path: '/student/messages', badge: String(sidebarCounts.messages), description: 'Communications' },
        { label: 'Notifications', icon: Bell, path: '/student/notifications', badge: String(sidebarCounts.notifications), description: 'Updates & alerts' },
        { label: 'Settings', icon: Cog, path: '/student/settings', description: 'Preferences' },
      ];
    }

    // Teacher view
    if (userRole === 'teacher' && activeView === 'teacher') {
      return [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/teacher', description: 'Teaching overview' },
        { label: 'Manage Courses', icon: BookOpen, path: '/teacher/courses', badge: String(sidebarCounts.courses), description: 'Your classes' },
        { label: 'Assignments', icon: Calendar, path: '/teacher/assignments', badge: String(sidebarCounts.assignments), description: 'Student submissions' },
        { label: 'Students', icon: UserPlus, path: '/teacher/students', description: 'Class roster' },
        { label: 'Settings', icon: Cog, path: '/teacher/settings', description: 'Preferences' },
      ];
    }

    // Editor view
    if (userRole === 'editor' && activeView === 'editor') {
      return [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/editor', description: 'Content overview' },
        { label: 'Content', icon: FolderOpen, path: '/editor/content', badge: String(sidebarCounts.content), description: 'Write & edit' },
        { label: 'Podcasts', icon: Radio, path: '/editor/podcasts', badge: String(sidebarCounts.podcasts), description: 'Audio production' },
        { label: 'Messages', icon: Mail, path: '/editor/messages', description: 'Team communications' },
        { label: 'Notifications', icon: Bell, path: '/editor/notifications', description: 'Updates & alerts' },
        { label: 'Promotions', icon: Megaphone, path: '/editor/promotions', description: 'Campaigns' },
        { label: 'Settings', icon: Cog, path: '/editor/settings', description: 'Preferences' },
      ];
    }

    // Developer view
    if (userRole === 'developer' && activeView === 'developer') {
      return [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/developer', description: 'System health' },
        { label: 'Users', icon: Users, path: '/developer/users', badge: String(sidebarCounts.users), description: 'Manage accounts' },
        { label: 'Content', icon: FolderOpen, path: '/developer/content', description: 'Data management' },
        { label: 'Messages', icon: Mail, path: '/developer/messages', description: 'Team communications' },
        { label: 'Analytics', icon: TrendingUp, path: '/developer/analytics', description: 'Platform metrics' },
        { label: 'Settings', icon: Cog, path: '/developer/settings', description: 'System settings' },
      ];
    }

    // Pastor view
    if (userRole === 'pastor' && activeView === 'pastor') {
      return [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/pastor', description: 'Ministry overview' },
        { label: 'Members', icon: Users, path: '/pastor/users', badge: String(sidebarCounts.users), description: 'Congregation' },
        { label: 'Church Management', icon: FolderOpen, path: '/pastor/content', description: 'Ministry resources' },
        { label: 'Podcasts', icon: Radio, path: '/pastor/podcasts', badge: '7', description: 'Sermons & messages' },
        { label: 'Events', icon: Gift, path: '/pastor/promotions', description: 'Church calendar' },
        { label: 'Donations', icon: TrendingUp, path: '/pastor/analytics', description: 'Giving insights' },
        { label: 'Settings', icon: Cog, path: '/pastor/settings', description: 'Preferences' },
      ];
    }

    // Default student view
    return [
      { label: 'Dashboard', icon: LayoutDashboard, path: '/student', description: 'Your overview' },
      { label: 'My Courses', icon: BookOpen, path: '/student/courses', badge: String(sidebarCounts.courses), description: 'Learning progress' },
      { label: 'Podcasts', icon: Radio, path: '/student/podcasts', description: 'Audio content' },
      { label: 'Assignments', icon: Calendar, path: '/student/assignments', badge: String(sidebarCounts.assignments), description: 'Tasks & deadlines' },
      { label: 'Messages', icon: Mail, path: '/student/messages', badge: String(sidebarCounts.messages), description: 'Communications' },
      { label: 'Notifications', icon: Bell, path: '/student/notifications', badge: String(sidebarCounts.notifications), description: 'Updates & alerts' },
      { label: 'Settings', icon: Cog, path: '/student/settings', description: 'Preferences' },
    ];
  };

  const availableMenuItems = getMenuItems();

  const isActive = (path: string) => location.pathname === path;
  const isStudentDashboard = userRole === 'student' || ((userRole === 'teacher' || userRole === 'pastor' || userRole === 'editor' || userRole === 'admin' || userRole === 'developer') && activeView === 'student');
  
  // Fixed navigateWithState function - uses current activeView
  const navigateWithState = (path: string) => {
    // If the path starts with a role prefix, use it as-is
    // Otherwise, prepend the current active view
    let finalPath = path;
    
    // Check if path already has a role prefix
    const rolePrefixes = ['/student', '/teacher', '/pastor', '/editor', '/admin', '/developer'];
    const hasRolePrefix = rolePrefixes.some(prefix => path.startsWith(prefix));
    
    if (!hasRolePrefix && !path.startsWith('/')) {
      // If path doesn't have a role prefix, prepend the current view
      const viewPath = `/${activeView}`;
      finalPath = path.startsWith(viewPath) ? path : `${viewPath}${path.startsWith('/') ? path : `/${path}`}`;
    }

    navigate(finalPath, {
      state: {
        ...((location.state as Record<string, unknown>) || {}),
        role: userRole,
        view: activeView,
      },
    });
  };

  const toggleExpand = (label: string) => {
    setExpandedItems(prev =>
      prev.includes(label)
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  // Helper function to get the correct path for a given page type
  const getPagePath = (page: string) => {
    return `/${activeView}/${page}`;
  };

  // Remove duplicate Settings from bottom nav since it's now in the main menu
  const bottomNavItems = availableMenuItems;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar - Desktop - Dark theme from the image */}
      <aside className={`hidden lg:flex lg:flex-col w-64 fixed h-full z-40 top-0 left-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700 shadow-2xl ${isDesktopSidebarVisible ? '' : 'lg:hidden'}`}>
        {/* Logo Section */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            {/* Custom Logo Image - Replace with your logo */}
            <div className="relative flex-shrink-0">
              <img 
                src="../kebena_sda_logo.PNG"  // Replace with your logo path
                alt="Kebena Seventh Day"
                className="h-12 w-12 object-contain rounded-xl"
              />
              <div className="absolute -top-1 -right-1">
                <Sparkles className="h-3 w-3 text-amber-300 animate-pulse" />
              </div>
            </div>
            <div>
              <h2 className="font-bold text-white whitespace-nowrap text-sm leading-tight">K-SCHOOL</h2>
              <p className="text-xs text-slate-400 whitespace-nowrap font-medium tracking-wide">E-Learning</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                aria-label="Search dashboard"
                className="h-9 w-full rounded-lg bg-slate-800/50 border border-slate-700/50 px-3 pl-9 text-sm text-slate-200 outline-none placeholder:text-slate-500 transition-all focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
              />
              <svg className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Navigation - with hover and click effects */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2">
            Main Menu
          </div>
          {availableMenuItems.map((item) => {
            const isItemActive = isActive(item.path);
            const isHovered = hoveredItem === item.label;
            const isExpanded = expandedItems.includes(item.label);

            return (
              <div key={item.path}>
                <Button
                  variant="ghost"
                  className={`relative w-full justify-start rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 group ${
                    isItemActive
                      ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-100 border border-amber-500/20 shadow-lg shadow-amber-500/10'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  } ${isHovered ? 'translate-x-1' : ''}`}
                  onClick={() => navigateWithState(item.path)}
                  onMouseEnter={() => setHoveredItem(item.label)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div className="flex items-center w-full">
                    <div className={`relative ${isItemActive ? 'text-amber-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
                      <item.icon className="h-4.5 w-4.5 mr-3 transition-transform duration-200 group-hover:scale-110" />
                      {isItemActive && (
                        <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-amber-400 rounded-full shadow-lg shadow-amber-400/50" />
                      )}
                    </div>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <Badge className="ml-auto bg-amber-500/20 text-amber-300 border-amber-500/30 hover:bg-amber-500/30 transition-colors">
                        {item.badge}
                      </Badge>
                    )}
                    {item.description && (
                      <ChevronRight className={`h-3.5 w-3.5 ml-1 text-slate-600 transition-transform duration-200 ${
                        isHovered || isItemActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                      }`} />
                    )}
                  </div>
                </Button>
                {item.description && (isHovered || isItemActive) && (
                  <div className="px-3 pb-1 text-xs text-slate-500 transition-all duration-200">
                    {item.description}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-slate-700 bg-slate-800/30">
          <div className="flex items-center gap-3 rounded-xl bg-slate-800/50 p-2.5 transition-all hover:bg-slate-700/50 cursor-pointer group">
            <Avatar className="h-10 w-10 ring-2 ring-amber-500/30 ring-offset-2 ring-offset-slate-900">
              <AvatarFallback className="bg-gradient-to-br from-amber-400 to-orange-500 text-white font-bold text-sm">
                {profileName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{profileName}</p>
              <p className="text-xs text-slate-400 truncate">{profileEmail}</p>
            </div>
            <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50 animate-pulse" />
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar with dark theme */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700 shadow-2xl`}
      >
        <div className="p-6 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30">
              <Church className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-white">K-SCHOOL</h2>
              <p className="text-xs text-slate-400">E-Learning Platform</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSidebarOpen(false)}
            className="text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="px-6 pt-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              aria-label="Search dashboard"
              className="h-9 w-full rounded-lg bg-slate-800/50 border border-slate-700/50 px-3 pl-9 text-sm text-slate-200 outline-none placeholder:text-slate-500 transition-all focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
            />
            <svg className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2">
            Main Menu
          </div>
          {availableMenuItems.map((item) => {
            const isItemActive = isActive(item.path);
            return (
              <Button
                key={item.path}
                variant="ghost"
                className={`w-full justify-start rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isItemActive
                    ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-100 border border-amber-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
                onClick={() => {
                  navigateWithState(item.path);
                  setIsSidebarOpen(false);
                }}
              >
                <item.icon className={`h-4.5 w-4.5 mr-3 ${isItemActive ? 'text-amber-400' : 'text-slate-500'}`} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <Badge className="ml-auto bg-amber-500/20 text-amber-300 border-amber-500/30">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-700 bg-slate-800/30">
          <div className="flex items-center gap-3 rounded-xl bg-slate-800/50 p-2.5">
            <Avatar className="h-10 w-10 ring-2 ring-amber-500/30 ring-offset-2 ring-offset-slate-900">
              <AvatarFallback className="bg-gradient-to-br from-amber-400 to-orange-500 text-white font-bold">
                {profileName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{profileName}</p>
              <p className="text-xs text-slate-400 truncate">{profileEmail}</p>
            </div>
            <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50 animate-pulse" />
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div
        className={`min-h-screen transition-all duration-300 ease-in-out ${
          isDesktopSidebarVisible ? 'lg:ml-64' : 'lg:ml-0'
        }`}
      >
        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
          <div className="px-4 py-4 flex items-center justify-between gap-4">
            {/* Left side */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden text-slate-600 hover:bg-slate-100"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="hidden lg:flex text-slate-600 hover:bg-slate-100"
                onClick={() => setIsDesktopSidebarVisible(!isDesktopSidebarVisible)}
              >
                <Menu className="h-5 w-5" />
              </Button>

              <div className="hidden lg:block">
                <h1 className="text-xl font-bold text-slate-800">
                  {availableMenuItems.find(item => isActive(item.path))?.label || 'Dashboard'}
                </h1>
                <p className="text-xs text-slate-500">
                  {availableMenuItems.find(item => isActive(item.path))?.description || 'Welcome back!'}
                </p>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <Button 
                type="button"
                variant="ghost" 
                size="icon" 
                className="relative text-slate-600 hover:bg-slate-100" 
                aria-label="Messages" 
                onClick={() => navigateWithState(`/${activeView}/messages`)}
              >
                <Mail className="h-4.5 w-4.5" />
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white shadow-lg shadow-rose-500/30">
                  {sidebarCounts.messages}
                </span>
              </Button>

              <Button 
                type="button"
                variant="ghost" 
                size="icon" 
                className="relative text-slate-600 hover:bg-slate-100" 
                aria-label="Notifications" 
                onClick={() => navigateWithState(`/${activeView}/notifications`)}
              >
                <Bell className="h-4.5 w-4.5" />
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white shadow-lg shadow-rose-500/30">
                  {sidebarCounts.notifications}
                </span>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="hidden md:flex text-slate-600 hover:bg-slate-100"
                aria-label="Help"
                onClick={() => navigateWithState(`/${activeView}/settings`)}
              >
                <HelpCircle className="h-4.5 w-4.5" />
              </Button>

              {/* Role Switcher */}
              {canSwitchRole ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 transition-colors hover:bg-slate-200"
                    >
                      <CurrentRoleIcon className="h-4 w-4 text-slate-600" />
                      <span className="text-sm font-medium text-slate-700">{currentRoleOption.label}</span>
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[220px] z-50 bg-white border border-slate-200 shadow-lg rounded-lg">
                    {roleOptions.map((option) => (
                      <DropdownMenuItem
                        key={option.view}
                        onClick={() => handleViewChange(option.view)}
                        className="cursor-pointer hover:bg-slate-100 text-slate-700"
                      >
                        <div className="flex items-center gap-2">
                          <option.icon className="h-4 w-4" />
                          <span>{option.label}</span>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : null}

              <Badge variant="outline" className="capitalize hidden sm:flex bg-slate-100 border-slate-200 text-slate-700">
                <Shield className="h-3 w-3 mr-1" />
                {userRole}
              </Badge>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-3 rounded-lg bg-slate-100 px-3 py-2 transition-colors hover:bg-slate-200"
                    aria-label="Open user menu"
                  >
                    <Avatar className="h-9 w-9 ring-2 ring-amber-500/30 ring-offset-2 ring-offset-white">
                      <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-500 text-white font-bold">
                        {profileName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-slate-800">{profileName}</p>
                      <p className="text-xs text-slate-500">{profileEmail}</p>
                    </div>
                    <ChevronDown className="hidden h-4 w-4 text-slate-400 md:block" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 z-50 bg-white border border-slate-200 shadow-lg rounded-lg">
                  <DropdownMenuLabel className="bg-slate-50 px-2 py-1.5 rounded-t-lg">
                    <div className="space-y-1">
                      <p className="font-medium text-slate-800">{profileName}</p>
                      <p className="text-xs text-slate-500">{profileEmail}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-1" />
                  <DropdownMenuItem 
                    onClick={() => navigateWithState(`/${activeView}/profile`)} 
                    className="cursor-pointer hover:bg-slate-100 text-slate-700"
                  >
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => navigateWithState(`/${activeView}/messages`)} 
                    className="cursor-pointer hover:bg-slate-100 text-slate-700"
                  >
                    Messages
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => navigateWithState(`/${activeView}/notifications`)} 
                    className="cursor-pointer hover:bg-slate-100 text-slate-700"
                  >
                    Notifications
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => navigateWithState(`/${activeView}/settings`)} 
                    className="cursor-pointer hover:bg-slate-100 text-slate-700"
                  >
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-1" />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer hover:bg-rose-50 text-rose-600">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="overflow-y-auto flex flex-col p-4 lg:p-6 pb-24 lg:pb-6 min-h-screen">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="mx-auto grid max-w-3xl grid-cols-5 gap-1 px-2 py-2">
          {bottomNavItems.slice(0, 5).map((item) => (
            <Button
              key={item.path}
              variant={isActive(item.path) ? 'default' : 'ghost'}
              className={`h-auto flex-col gap-1 px-2 py-2 transition-all ${
                isActive(item.path)
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
              onClick={() => navigateWithState(item.path)}
            >
              <div className="relative flex items-center justify-center">
                <item.icon className="h-4.5 w-4.5" />
                {item.badge && (
                  <Badge
                    variant="secondary"
                    className="absolute -right-2 -top-2 min-w-4 px-1 text-[10px] bg-rose-500 text-white border-0"
                  >
                    {item.badge}
                  </Badge>
                )}
              </div>
              <span className="max-w-full truncate text-[10px] font-medium leading-none">
                {item.label}
              </span>
            </Button>
          ))}
        </div>
      </nav>
    </div>
  );
}