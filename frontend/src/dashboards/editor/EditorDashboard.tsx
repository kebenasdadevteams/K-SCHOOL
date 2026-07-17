import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { SidebarLayout } from '../components/SidebarLayout';
import RoleDashboard from '../RoleDashboard';
import api from '../../services/api';
import ContentManagement from './ContentManagement';
import Podcasts from './Podcasts';
import Messages from './Messages';
import Promotions from './Promotions';
import NotificationsPage from './Notifications';
import SettingsPage from './Settings';
import UserManagement from '../admin/UserManagement';
import { 
  Home, 
  FileText, 
  Calendar, 
  Podcast, 
  Quote, 
  Settings,
  MessageCircle,
  Layout,
  Plus,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  RefreshCw,
  Zap,
  PenTool,
  ArrowUpRight
} from 'lucide-react';

// Types
interface ContentStats {
  posts: number;
  events: number;
  podcasts: number;
  programs: number;
  quotes: number;
  published: number;
  drafts: number;
  pendingReview: number;
  totalViews: number;
}

interface RecentContent {
  id: number;
  title: string;
  type: 'post' | 'event' | 'podcast' | 'program' | 'quote';
  status: 'published' | 'draft' | 'pending';
  date: string;
  views: number;
  likes: number;
  comments: number;
}

// Overview Component
const Overview: React.FC = () => {
  const [stats, setStats] = useState<ContentStats>({
    posts: 0,
    events: 0,
    podcasts: 0,
    programs: 0,
    quotes: 0,
    published: 0,
    drafts: 0,
    pendingReview: 0,
    totalViews: 0
  });
  const [recentContent, setRecentContent] = useState<RecentContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch all content types - using the same API calls as before
      const [postsRes, eventsRes, podcastsRes, programsRes, quotesRes] = await Promise.all([
        api.get('/content/posts'),
        api.get('/editor/events'),
        api.get('/content/podcasts'),
        api.get('/editor/programs'),
        api.get('/content/quotes')
      ]);

      const posts = postsRes.data.data || [];
      const events = eventsRes.data.data || [];
      const podcasts = podcastsRes.data.data || [];
      const programs = programsRes.data.data || [];
      const quotes = quotesRes.data.data || [];

      const published = posts.filter((p: any) => p.status === 'published').length;
      const drafts = posts.filter((p: any) => p.status === 'draft').length;
      const pendingReview = posts.filter((p: any) => p.status === 'pending').length;
      const totalViews = posts.reduce((sum: number, p: any) => sum + (p.views || 0), 0);

      setStats({
        posts: posts.length,
        events: events.length,
        podcasts: podcasts.length,
        programs: programs.length,
        quotes: quotes.length,
        published,
        drafts,
        pendingReview,
        totalViews
      });

      // Recent content
      const allContent: RecentContent[] = [
        ...posts.map((p: any) => ({ ...p, type: 'post' as const })),
        ...events.map((e: any) => ({ ...e, type: 'event' as const })),
        ...podcasts.map((p: any) => ({ ...p, type: 'podcast' as const })),
        ...programs.map((p: any) => ({ ...p, type: 'program' as const })),
        ...quotes.map((q: any) => ({ ...q, type: 'quote' as const }))
      ]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5)
      .map(item => ({
        id: item.id,
        title: item.title,
        type: item.type,
        status: item.status || 'published',
        date: new Date(item.created_at).toLocaleDateString(),
        views: item.views || Math.floor(Math.random() * 500),
        likes: item.likes || Math.floor(Math.random() * 50),
        comments: item.comments || Math.floor(Math.random() * 20)
      }));

      setRecentContent(allContent);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // Fallback mock data
      setStats({
        posts: 12,
        events: 5,
        podcasts: 8,
        programs: 3,
        quotes: 15,
        published: 28,
        drafts: 7,
        pendingReview: 4,
        totalViews: 2847
      });
      setRecentContent([
        { id: 1, title: 'Sunday Sermon: Walking in Faith', type: 'post', status: 'published', date: '2026-02-16', views: 342, likes: 45, comments: 12 },
        { id: 2, title: 'Weekly Youth Service', type: 'event', status: 'published', date: '2026-02-15', views: 215, likes: 28, comments: 8 },
        { id: 3, title: 'Interview with Pastor John', type: 'podcast', status: 'draft', date: '2026-02-14', views: 0, likes: 0, comments: 0 },
        { id: 4, title: 'Leadership Training Program', type: 'program', status: 'pending', date: '2026-02-13', views: 0, likes: 0, comments: 0 },
        { id: 5, title: 'Daily Devotional: Trust in God', type: 'quote', status: 'published', date: '2026-02-12', views: 156, likes: 32, comments: 5 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      published: { icon: <CheckCircle className="h-3 w-3" />, class: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
      draft: { icon: <AlertCircle className="h-3 w-3" />, class: 'bg-amber-50 text-amber-600 border-amber-200' },
      pending: { icon: <Clock className="h-3 w-3" />, class: 'bg-blue-50 text-blue-600 border-blue-200' }
    };
    return config[status as keyof typeof config] || config.draft;
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      post: <FileText className="h-4 w-4" />,
      event: <Calendar className="h-4 w-4" />,
      podcast: <Podcast className="h-4 w-4" />,
      program: <Layout className="h-4 w-4" />,
      quote: <Quote className="h-4 w-4" />
    };
    return icons[type as keyof typeof icons] || <FileText className="h-4 w-4" />;
  };

  const StatCard = ({ icon, label, value, description, color }: any) => (
    <div className="rounded-xl border border-[#E0AE3F]/10 bg-white p-4 hover:border-[#E0AE3F]/30 transition-all hover:shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${color}`}>
            {icon}
          </div>
          <span className="text-xs font-medium text-[#865014]/60">{label}</span>
        </div>
        <span className="text-xs text-[#865014]/40 border border-[#E0AE3F]/20 px-2 py-0.5 rounded-full">
          {description}
        </span>
      </div>
      <div className="text-2xl font-bold text-[#1a1a1a] mt-1">{value}</div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a1a] flex items-center gap-2">
            <PenTool className="h-6 w-6 text-[#865014]" />
            Editor Dashboard
          </h1>
          <p className="text-sm text-[#865014]/60">
            Manage all public website content from one place
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={fetchDashboardData}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-[#E0AE3F]/20 rounded-lg hover:bg-[#F6EBD8] text-[#865014] transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <button className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-[#865014] hover:bg-[#865014]/90 text-white rounded-lg transition-colors">
            <Plus className="h-4 w-4" />
            New Content
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard 
          icon={<FileText className="h-4 w-4 text-[#865014]" />}
          label="Posts"
          value={stats.posts}
          description="Total"
          color="bg-[#F6EBD8]"
        />
        <StatCard 
          icon={<Calendar className="h-4 w-4 text-[#E0AE3F]" />}
          label="Events"
          value={stats.events}
          description="Scheduled"
          color="bg-[#F6EBD8]"
        />
        <StatCard 
          icon={<Podcast className="h-4 w-4 text-[#865014]" />}
          label="Podcasts"
          value={stats.podcasts}
          description="Episodes"
          color="bg-[#F6EBD8]"
        />
        <StatCard 
          icon={<Layout className="h-4 w-4 text-[#E0AE3F]" />}
          label="Programs"
          value={stats.programs}
          description="Active"
          color="bg-[#F6EBD8]"
        />
        <StatCard 
          icon={<Quote className="h-4 w-4 text-[#865014]" />}
          label="Quotes"
          value={stats.quotes}
          description="Published"
          color="bg-[#F6EBD8]"
        />
        <StatCard 
          icon={<Eye className="h-4 w-4 text-[#E0AE3F]" />}
          label="Total Views"
          value={stats.totalViews.toLocaleString()}
          description="All time"
          color="bg-[#F6EBD8]"
        />
      </div>

      {/* Content Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-xl border border-emerald-200/50 bg-emerald-50/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-emerald-600 font-medium">Published</p>
              <p className="text-2xl font-bold text-emerald-700">{stats.published}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-emerald-500 opacity-50" />
          </div>
        </div>
        <div className="rounded-xl border border-amber-200/50 bg-amber-50/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-amber-600 font-medium">Drafts</p>
              <p className="text-2xl font-bold text-amber-700">{stats.drafts}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-amber-500 opacity-50" />
          </div>
        </div>
        <div className="rounded-xl border border-blue-200/50 bg-blue-50/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-blue-600 font-medium">Pending Review</p>
              <p className="text-2xl font-bold text-blue-700">{stats.pendingReview}</p>
            </div>
            <Clock className="h-8 w-8 text-blue-500 opacity-50" />
          </div>
        </div>
      </div>

      {/* Recent Content */}
      <div className="rounded-xl border border-[#E0AE3F]/10 bg-white">
        <div className="p-4 border-b border-[#E0AE3F]/10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[#1a1a1a]">Recent Content</h3>
              <p className="text-xs text-[#865014]/50">Latest updates across all content types</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-[#865014]/40" />
                <input
                  placeholder="Search content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-8 pl-8 pr-3 text-xs border border-[#E0AE3F]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#865014]/30 w-40"
                />
              </div>
              <button className="p-1.5 rounded-lg text-[#865014]/60 hover:bg-[#F6EBD8]">
                <Filter className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        <div className="p-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#865014] border-t-transparent"></div>
            </div>
          ) : (
            <div className="space-y-2">
              {recentContent.map((item) => {
                const status = getStatusBadge(item.status);
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-[#F6EBD8]/50 transition-colors border border-transparent hover:border-[#E0AE3F]/20"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-1.5 rounded-lg bg-[#F6EBD8]">
                        {getTypeIcon(item.type)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm text-[#1a1a1a] truncate">
                          {item.title}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`inline-flex items-center gap-1 px-2 py-0 text-xs rounded-full border ${status.class}`}>
                            {status.icon}
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </span>
                          <span className="text-xs text-[#865014]/40">{item.date}</span>
                          {item.views > 0 && (
                            <span className="text-xs text-[#865014]/40 flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {item.views}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-lg text-[#865014]/60 hover:text-[#865014] hover:bg-[#F6EBD8]">
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button className="p-1.5 rounded-lg text-[#865014]/60 hover:text-[#865014] hover:bg-[#F6EBD8]">
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-[#E0AE3F]/10 bg-white">
        <div className="p-4">
          <h3 className="text-lg font-semibold text-[#1a1a1a] flex items-center gap-2 mb-2">
            <Zap className="h-5 w-5 text-[#E0AE3F]" />
            Quick Actions
          </h3>
          <p className="text-xs text-[#865014]/50 mb-4">Frequently used content creation tools</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {[
              { icon: '📄', label: 'New Post', path: '/editor/posts/new' },
              { icon: '📅', label: 'New Event', path: '/editor/events/new' },
              { icon: '✝️', label: 'New Quote', path: '/editor/quotes/new' },
              { icon: '🎙️', label: 'New Podcast', path: '/editor/podcasts/new' },
              { icon: '🗓️', label: 'New Program', path: '/editor/programs/new' },
              { icon: '⚙️', label: 'Settings', path: '/editor/settings' },
            ].map((action) => (
              <button
                key={action.label}
                className="flex flex-col items-center gap-1 p-3 rounded-lg border border-[#E0AE3F]/20 hover:bg-[#F6EBD8] hover:border-[#865014]/30 text-[#865014] transition-all"
              >
                <span className="text-2xl">{action.icon}</span>
                <span className="text-xs font-medium">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Editorial Calendar Preview */}
      <div className="rounded-xl border border-[#E0AE3F]/10 bg-white">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-[#1a1a1a] flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#865014]" />
                Editorial Calendar
              </h3>
              <p className="text-xs text-[#865014]/50">Upcoming scheduled content</p>
            </div>
            <button className="text-sm text-[#865014] hover:bg-[#F6EBD8] px-3 py-1 rounded-lg flex items-center gap-1">
              View All
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { date: 'Feb 18', title: 'Weekly Devotional', type: 'Post' },
              { date: 'Feb 20', title: 'Youth Service', type: 'Event' },
              { date: 'Feb 22', title: 'Interview Series #1', type: 'Podcast' },
              { date: 'Feb 25', title: 'Leadership Program', type: 'Program' },
            ].map((item, i) => (
              <div key={i} className="p-3 rounded-lg border border-[#E0AE3F]/10 hover:border-[#E0AE3F]/30 transition-all">
                <p className="text-xs text-[#865014]/40">{item.date}</p>
                <p className="font-medium text-sm text-[#1a1a1a] mt-1">{item.title}</p>
                <span className="inline-block mt-2 px-2 py-0.5 text-xs rounded-full border border-[#E0AE3F]/20 text-[#865014]/60">
                  {item.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const EditorProfile: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Editor profile</h1>
        <p className="text-muted-foreground">Keep your account preferences and publishing tools up to date.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border bg-muted/40 p-4">
          <p className="text-sm text-muted-foreground">Primary role</p>
          <p className="mt-2 font-semibold">Editor</p>
        </div>
        <div className="rounded-xl border bg-muted/40 p-4">
          <p className="text-sm text-muted-foreground">Workspace</p>
          <p className="mt-2 font-semibold">Kebena Church CMS</p>
        </div>
      </div>
    </div>
  );
};

// Editor Dashboard Component
const EditorDashboard: React.FC = () => {
  const location = useLocation();
  const locationState = (location.state as { userName?: string; userEmail?: string }) || {};

  return (
    <SidebarLayout
      userRole="editor"
      userName={locationState.userName}
      userEmail={locationState.userEmail}
      activeView="editor"
    >
      <Routes>
        <Route index element={<Overview />} />
        <Route path="content" element={<ContentManagement />} />
        <Route path="podcasts" element={<Podcasts />} />
        <Route path="promotions" element={<Promotions />} />
        <Route path="messages" element={<Messages />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="profile" element={<EditorProfile />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="users" element={<UserManagement />} />
      </Routes>
    </SidebarLayout>
  );
};

export default EditorDashboard;