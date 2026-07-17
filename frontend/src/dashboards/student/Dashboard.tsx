import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { SidebarLayout } from '../../SidebarLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { Badge } from '../../components/ui/badge';
import { 
  BookOpen, 
  FileText, 
  Headphones, 
  TrendingUp, 
  Users, 
  Award,
  Clock,
  ChevronRight,
  Calendar,
  CheckCircle2,
  BarChart3,
  ArrowRight,
  Megaphone,
  BookMarked,
  ListTodo,
  Settings,
  PanelTop,
  Sparkles,
  Zap,
  Target,
  Star,
  Flame,
  Gift,
  Crown,
  Rocket,
  Lightbulb,
  UserCircle,  
  Bell,         
  Terminal
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: authUser } = useAuth();

  // Get user info from auth context, or use location state as fallback
  const locationState = location.state as { role?: string; userName?: string; userEmail?: string; view?: 'student' | 'teacher' | 'pastor' | 'editor' | 'admin' | 'developer' } | null;
  const [user] = useState({
    full_name: authUser?.full_name || locationState?.userName || 'Demo User',
    email: authUser?.email || locationState?.userEmail || 'demo@church.com'
  });
  const [role] = useState(locationState?.role || 'student');
  // Default to teacher view if user is a teacher, otherwise student view
  const [activeView, setActiveView] = useState<'student' | 'teacher' | 'pastor' | 'editor' | 'admin' | 'developer'>(
    locationState?.view ?? (locationState?.role === 'teacher' ? 'teacher' : locationState?.role === 'pastor' ? 'pastor' : locationState?.role === 'editor' ? 'editor' : locationState?.role === 'admin' ? 'admin' : locationState?.role === 'developer' ? 'developer' : 'student')
  );

  // Helper function to navigate with proper role prefix
  const navigateTo = (path: string) => {
    // If path already has a role prefix or starts with /, use it as-is
    if (path.startsWith('/student') || path.startsWith('/teacher') || path.startsWith('/pastor') || 
        path.startsWith('/editor') || path.startsWith('/admin') || path.startsWith('/developer') ||
        path.startsWith('/')) {
      navigate(path, {
        state: {
          ...((location.state as Record<string, unknown>) || {}),
          role,
          view: activeView,
        },
      });
      return;
    }
    
    // Otherwise, prepend the current role
    const fullPath = `/${role}${path.startsWith('/') ? path : `/${path}`}`;
    navigate(fullPath, {
      state: {
        ...((location.state as Record<string, unknown>) || {}),
        role,
        view: activeView,
      },
    });
  };

  // Mock data based on database schema
  const studentStats = {
    enrolledCourses: 3,
    completedLessons: 24,
    totalLessons: 48,
    certificates: 1,
    hoursLearned: 18,
  };

  const myCourses = [
    {
      id: 1,
      title: 'Introduction to Biblical Studies',
      teacher: 'Pastor John',
      progress: 65,
      nextLesson: 'Chapter 4: The Pentateuch',
      totalChapters: 12,
      completedChapters: 7,
      thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    },
    {
      id: 2,
      title: 'Amharic Bible Study',
      teacher: 'Teacher Mary',
      progress: 40,
      nextLesson: 'Chapter 3: የዘፍጥረት መጽሐፍ',
      totalChapters: 10,
      completedChapters: 4,
      thumbnail: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=300&fit=crop',
    },
    {
      id: 3,
      title: 'Christian Leadership Principles',
      teacher: 'Pastor David',
      progress: 20,
      nextLesson: 'Chapter 2: Servant Leadership',
      totalChapters: 8,
      completedChapters: 1,
      thumbnail: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&h=300&fit=crop',
    },
  ];

  const upcomingAssignments = [
    {
      id: 1,
      title: 'Chapter 4 Assignment: Old Testament Analysis',
      course: 'Biblical Studies',
      dueDate: 'Feb 18, 2026',
      status: 'pending',
    },
    {
      id: 2,
      title: 'Leadership Essay Submission',
      course: 'Christian Leadership',
      dueDate: 'Feb 20, 2026',
      status: 'pending',
    },
  ];

  const recentPodcasts = [
    {
      id: 1,
      title: 'Sunday Sermon: Walking in Faith',
      author: 'Pastor John',
      duration: '45 min',
      thumbnail: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=200&h=200&fit=crop',
    },
    {
      id: 2,
      title: 'Daily Devotional - Feb 15',
      author: 'Pastor Michael',
      duration: '15 min',
      thumbnail: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=200&h=200&fit=crop',
    },
  ];

  const weeklyActivity = [
    { label: 'Mon', value: 24 },
    { label: 'Tue', value: 38 },
    { label: 'Wed', value: 52 },
    { label: 'Thu', value: 44 },
    { label: 'Fri', value: 60 },
    { label: 'Sat', value: 36 },
    { label: 'Sun', value: 48 },
  ];

  const completionPercentage = (studentStats.completedLessons / studentStats.totalLessons) * 100;

  // Teacher-specific data
  const teacherStats = {
    totalStudents: 45,
    activeCourses: 3,
    pendingAssignments: 12,
    completionRate: 78,
  };

  const teacherSubmissions = [
    {
      id: 1,
      student: 'Abebe Kebede',
      assignment: 'Chapter 4 Assignment: Old Testament Analysis',
      course: 'Introduction to Biblical Studies',
      submittedAt: 'Today, 8:15 AM',
      grade: 'A-',
      comment: 'Strong scripture references and a clear argument.',
      status: 'graded',
    },
    {
      id: 2,
      student: 'Tigist Alemayehu',
      assignment: 'Leadership Essay Submission',
      course: 'Christian Leadership Principles',
      submittedAt: 'Today, 10:30 AM',
      grade: 'B+',
      comment: 'Good structure. Add one more leadership example next time.',
      status: 'graded',
    },
    {
      id: 3,
      student: 'Dawit Tesfaye',
      assignment: 'Amharic Bible Study Reflection',
      course: 'Amharic Bible Study',
      submittedAt: 'Today, 11:05 AM',
      grade: 'Pending',
      comment: 'Awaiting review and feedback.',
      status: 'submitted',
    },
  ];

  const navigateWithTeacherState = (path: string) => {
    navigate(path, {
      state: {
        ...((location.state as Record<string, unknown>) || {}),
        role: 'teacher',
        view: 'teacher',
      },
    });
  };
  
  const pastorStats = {
    pendingApprovals: 2,
    podcastDrafts: 1,
    announcements: 1,
    reach: '1.2k',
  };

  const adminStats = {
    totalUsers: 9,
    pendingCourses: 3,
    contentItems: 4,
    systemAlerts: 2,
  };

  const developerStats = {
    totalUsers: 9,
    debugTickets: 4,
    systemHealth: 'Live',
    activeSites: 1,
  };

  if (role === 'admin') {
    return (
      <SidebarLayout
        userRole={role}
        userName={user.full_name}
        userEmail={user.email}
        activeView={activeView}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            Welcome back, Admin {user.full_name}! 
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-3 py-1 text-sm font-medium text-amber-600">
              <Sparkles className="h-4 w-4" />
              Admin
            </span>
          </h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-500" />
            Approve courses, manage users, and oversee the whole platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="group hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-700">
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <Users className="h-4 w-4 text-amber-500" />
                Total Users
              </CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                {adminStats.totalUsers}
                <span className="text-sm font-normal text-muted-foreground">accounts</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">All active platform accounts</p>
            </CardContent>
          </Card>
          <Card className="group hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-700">
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-amber-500" />
                Courses Pending Approval
              </CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                {adminStats.pendingCourses}
                <span className="text-sm font-normal text-muted-foreground">pending</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Submitted by teachers</p>
            </CardContent>
          </Card>
          <Card className="group hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-700">
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-amber-500" />
                Content Items
              </CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                {adminStats.contentItems}
                <span className="text-sm font-normal text-muted-foreground">items</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Managed posts and podcasts</p>
            </CardContent>
          </Card>
          <Card className="group hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-700">
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-amber-500" />
                System Alerts
              </CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                {adminStats.systemAlerts}
                <span className="text-sm font-normal text-muted-foreground">alerts</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Items needing attention</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2 border border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="h-5 w-5 text-amber-500" />
                Admin Actions
              </CardTitle>
              <CardDescription>Manage the full platform from one place</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="justify-start hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700 transition-all group border-slate-200 dark:border-slate-700" onClick={() => navigateTo('/admin/users')}>
                <Users className="h-4 w-4 mr-2 text-amber-500 group-hover:scale-110 transition-transform" />
                Manage Users
              </Button>
              <Button variant="outline" className="justify-start hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700 transition-all group border-slate-200 dark:border-slate-700" onClick={() => navigateTo('/admin/courses')}>
                <BookOpen className="h-4 w-4 mr-2 text-amber-500 group-hover:scale-110 transition-transform" />
                Review Courses
              </Button>
              <Button variant="outline" className="justify-start hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700 transition-all group border-slate-200 dark:border-slate-700" onClick={() => navigateTo('/admin/content')}>
                <FileText className="h-4 w-4 mr-2 text-amber-500 group-hover:scale-110 transition-transform" />
                Content Management
              </Button>
              <Button variant="outline" className="justify-start hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700 transition-all group border-slate-200 dark:border-slate-700" onClick={() => navigateTo('/admin/analytics')}>
                <BarChart3 className="h-4 w-4 mr-2 text-amber-500 group-hover:scale-110 transition-transform" />
                Analytics
              </Button>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-500" />
                Pending Course Approvals
              </CardTitle>
              <CardDescription>Teacher-created courses awaiting approval</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { title: 'Christian Ethics 101', teacher: 'Teacher Mary' },
                { title: 'Biblical Leadership', teacher: 'Pastor John' },
                { title: 'Amharic Devotional Study', teacher: 'Teacher Dawit' },
              ].map((course) => (
                <div key={course.title} className="rounded-lg border border-slate-200 dark:border-slate-700 p-3 hover:border-amber-200 hover:bg-amber-50/50 dark:hover:bg-amber-900/20 transition-all cursor-pointer">
                  <p className="font-medium">{course.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    Submitted by {course.teacher}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-amber-500" />
                Platform Insights
              </CardTitle>
              <CardDescription>Quick stats at a glance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                  <span className="text-sm">Total Courses</span>
                  <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">12</Badge>
                </div>
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                  <span className="text-sm">Total Podcasts</span>
                  <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">8</Badge>
                </div>
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                  <span className="text-sm">Active Teachers</span>
                  <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">4</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Students</span>
                  <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">{adminStats.totalUsers}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-amber-500" />
                Quick Tips
              </CardTitle>
              <CardDescription>Get the most out of the platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3 rounded-lg bg-amber-50/50 dark:bg-amber-900/10 p-3 border border-amber-200/50 dark:border-amber-800/30">
                <Lightbulb className="h-5 w-5 text-amber-500 mt-0.5" />
                <p className="text-sm">Review pending courses daily to keep content fresh</p>
              </div>
              <div className="flex items-start gap-3 rounded-lg bg-amber-50/50 dark:bg-amber-900/10 p-3 border border-amber-200/50 dark:border-amber-800/30">
                <Star className="h-5 w-5 text-amber-500 mt-0.5" />
                <p className="text-sm">Engage with users through the messaging system</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarLayout>
    );
  }

  if (role === 'editor') {
    return (
      <SidebarLayout
        userRole={role}
        userName={user.full_name}
        userEmail={user.email}
        activeView={activeView}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            Welcome back, Editor {user.full_name}! 
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/20 px-3 py-1 text-sm font-medium text-blue-600">
              <Sparkles className="h-4 w-4" />
              Editor
            </span>
          </h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <Zap className="h-4 w-4 text-blue-500" />
            Create content drafts and submit them for admin review before publishing
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-12">
          <Card className="xl:col-span-5 overflow-hidden border-primary/15 bg-gradient-to-br from-secondary/10 via-background to-background border border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="text-secondary flex items-center gap-2">
                <Crown className="h-5 w-5 text-blue-500" />
                Editor Workbench
              </CardTitle>
              <CardDescription className="text-muted-foreground">Draft, refine, and submit content for admin review</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=700&fit=crop"
                alt="Editor workspace"
                className="h-48 w-full rounded-2xl object-cover shadow-sm"
              />
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border bg-background p-3 hover:shadow-md transition-shadow border-slate-200 dark:border-slate-700">
                  <p className="text-xs text-muted-foreground">Drafts</p>
                  <p className="mt-1 text-2xl font-bold">5</p>
                </div>
                <div className="rounded-xl border bg-background p-3 hover:shadow-md transition-shadow border-slate-200 dark:border-slate-700">
                  <p className="text-xs text-muted-foreground">Ready for review</p>
                  <p className="mt-1 text-2xl font-bold">3</p>
                </div>
                <div className="rounded-xl border bg-background p-3 hover:shadow-md transition-shadow border-slate-200 dark:border-slate-700">
                  <p className="text-xs text-muted-foreground">Published</p>
                  <p className="mt-1 text-2xl font-bold">7</p>
                </div>
                <div className="rounded-xl border bg-background p-3 hover:shadow-md transition-shadow border-slate-200 dark:border-slate-700">
                  <p className="text-xs text-muted-foreground">Admin feedback</p>
                  <p className="mt-1 text-2xl font-bold">2</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="xl:col-span-7 border border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="h-5 w-5 text-blue-500" />
                Editor Actions
              </CardTitle>
              <CardDescription>Draft content and send it for admin approval</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              <Button variant="outline" className="justify-start hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all group border-slate-200 dark:border-slate-700" onClick={() => navigateTo('/editor/content')}>
                <FileText className="h-4 w-4 mr-2 text-blue-500 group-hover:scale-110 transition-transform" />
                Write Posts
              </Button>
              <Button variant="outline" className="justify-start hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all group border-slate-200 dark:border-slate-700" onClick={() => navigateTo('/editor/podcasts')}>
                <Headphones className="h-4 w-4 mr-2 text-blue-500 group-hover:scale-110 transition-transform" />
                Record Podcasts
              </Button>
              <Button variant="outline" className="justify-start hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all group border-slate-200 dark:border-slate-700" onClick={() => navigateTo('/editor/promotions')}>
                <Megaphone className="h-4 w-4 mr-2 text-blue-500 group-hover:scale-110 transition-transform" />
                Schedule Announcements
              </Button>
              <Button variant="outline" className="justify-start hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all group border-slate-200 dark:border-slate-700" onClick={() => navigateTo('/editor/content')}>
                <BarChart3 className="h-4 w-4 mr-2 text-blue-500 group-hover:scale-110 transition-transform" />
                Content Analytics
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 border border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookMarked className="h-5 w-5 text-blue-500" />
                Publishing Pipeline
              </CardTitle>
              <CardDescription>Editor drafts before admin verification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { title: 'Sunday Morning Sermon', status: 'Draft', color: 'bg-yellow-100 text-yellow-700' },
                { title: 'Youth Ministry Update', status: 'Ready for review', color: 'bg-blue-100 text-blue-700' },
                { title: 'Weekly Podcast Outline', status: 'Awaiting admin approval', color: 'bg-purple-100 text-purple-700' },
              ].map((item) => (
                <div key={item.title} className="rounded-lg border border-slate-200 dark:border-slate-700 p-3 hover:border-blue-200 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all cursor-pointer">
                  <p className="font-medium">{item.title}</p>
                  <p className={`text-xs mt-1 inline-block px-2 py-0.5 rounded-full ${item.color}`}>{item.status}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-500" />
                Submission Rules
              </CardTitle>
              <CardDescription>How editor content moves forward</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-bold dark:bg-blue-900/30 dark:text-blue-400">1</span>
                <p>Draft content in the editor workspace.</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-bold dark:bg-blue-900/30 dark:text-blue-400">2</span>
                <p>Submit it for admin review.</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-bold dark:bg-blue-900/30 dark:text-blue-400">3</span>
                <p>Admin verifies and approves before posting.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarLayout>
    );
  }

  if (role === 'developer') {
    return (
      <SidebarLayout
        userRole={role}
        userName={user.full_name}
        userEmail={user.email}
        activeView={activeView}
        onViewChange={setActiveView}
      >
        {activeView === 'developer' ? (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                Welcome back, Developer {user.full_name}! 
                <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/20 px-3 py-1 text-sm font-medium text-purple-600">
                  <Sparkles className="h-4 w-4" />
                  Developer
                </span>
              </h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <Zap className="h-4 w-4 text-purple-500" />
                Full site access, manage users, and debug the platform
              </p>
            </div>

            <div className="grid gap-6 xl:grid-cols-12">
              <Card className="xl:col-span-5 overflow-hidden border-primary/15 bg-gradient-to-br from-slate-50 via-background to-background border border-slate-200 dark:border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Terminal className="h-5 w-5 text-purple-500" />
                    Developer Console
                  </CardTitle>
                  <CardDescription>Platform control and debugging tools</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <img
                    src="https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200&h=700&fit=crop"
                    alt="Developer workspace"
                    className="h-48 w-full rounded-2xl object-cover shadow-sm"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border bg-background p-3 hover:shadow-md transition-shadow border-slate-200 dark:border-slate-700">
                      <p className="text-xs text-muted-foreground">Users</p>
                      <p className="mt-1 text-2xl font-bold">{developerStats.totalUsers}</p>
                    </div>
                    <div className="rounded-xl border bg-background p-3 hover:shadow-md transition-shadow border-slate-200 dark:border-slate-700">
                      <p className="text-xs text-muted-foreground">Debug tickets</p>
                      <p className="mt-1 text-2xl font-bold">{developerStats.debugTickets}</p>
                    </div>
                    <div className="rounded-xl border bg-background p-3 hover:shadow-md transition-shadow border-slate-200 dark:border-slate-700">
                      <p className="text-xs text-muted-foreground">System health</p>
                      <p className="mt-1 text-2xl font-bold text-green-500">{developerStats.systemHealth}</p>
                    </div>
                    <div className="rounded-xl border bg-background p-3 hover:shadow-md transition-shadow border-slate-200 dark:border-slate-700">
                      <p className="text-xs text-muted-foreground">Active sites</p>
                      <p className="mt-1 text-2xl font-bold">{developerStats.activeSites}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="xl:col-span-7 border border-slate-200 dark:border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Rocket className="h-5 w-5 text-purple-500" />
                    Developer Actions
                  </CardTitle>
                  <CardDescription>Manage users, inspect content, and monitor the system</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 md:grid-cols-2">
                  <Button variant="outline" className="justify-start hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700 transition-all group border-slate-200 dark:border-slate-700" onClick={() => navigateTo('/developer/users')}>
                    <Users className="h-4 w-4 mr-2 text-purple-500 group-hover:scale-110 transition-transform" />
                    Manage Users
                  </Button>
                  <Button variant="outline" className="justify-start hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700 transition-all group border-slate-200 dark:border-slate-700" onClick={() => navigateTo('/developer/content')}>
                    <FileText className="h-4 w-4 mr-2 text-purple-500 group-hover:scale-110 transition-transform" />
                    Inspect Content
                  </Button>
                  <Button variant="outline" className="justify-start hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700 transition-all group border-slate-200 dark:border-slate-700" onClick={() => navigateTo('/developer/analytics')}>
                    <BarChart3 className="h-4 w-4 mr-2 text-purple-500 group-hover:scale-110 transition-transform" />
                    System Analytics
                  </Button>
                  <Button variant="outline" className="justify-start hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700 transition-all group border-slate-200 dark:border-slate-700" onClick={() => navigateTo('/developer/settings')}>
                    <Settings className="h-4 w-4 mr-2 text-purple-500 group-hover:scale-110 transition-transform" />
                    Debug & Settings
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-2 border border-slate-200 dark:border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookMarked className="h-5 w-5 text-purple-500" />
                    System Notes
                  </CardTitle>
                  <CardDescription>What the developer can manage</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2 rounded-lg bg-purple-50/50 dark:bg-purple-900/10 p-3 border border-purple-200/50 dark:border-purple-800/30">
                    <CheckCircle2 className="h-4 w-4 text-purple-500 mt-0.5" />
                    <p>Full access to user administration and platform routes.</p>
                  </div>
                  <div className="flex items-start gap-2 rounded-lg bg-purple-50/50 dark:bg-purple-900/10 p-3 border border-purple-200/50 dark:border-purple-800/30">
                    <CheckCircle2 className="h-4 w-4 text-purple-500 mt-0.5" />
                    <p>Debug and verify content across the church platform.</p>
                  </div>
                  <div className="flex items-start gap-2 rounded-lg bg-purple-50/50 dark:bg-purple-900/10 p-3 border border-purple-200/50 dark:border-purple-800/30">
                    <CheckCircle2 className="h-4 w-4 text-purple-500 mt-0.5" />
                    <p>Switch to Student View to use the learning experience.</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-slate-200 dark:border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-purple-500" />
                    Developer Workflow
                  </CardTitle>
                  <CardDescription>Image-based role flow</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-purple-700 text-xs font-bold dark:bg-purple-900/30 dark:text-purple-400">1</span>
                    <p>Open the developer dashboard.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-purple-700 text-xs font-bold dark:bg-purple-900/30 dark:text-purple-400">2</span>
                    <p>Use the tools to manage and debug.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-purple-700 text-xs font-bold dark:bg-purple-900/30 dark:text-purple-400">3</span>
                    <p>Switch to Student View when needed.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                Welcome back, Developer {user.full_name}! 
                <span className="inline-flex items-center gap-1 rounded-full bg-green-500/20 px-3 py-1 text-sm font-medium text-green-600">
                  <UserCircle className="h-4 w-4" />
                  Student Mode
                </span>
              </h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <Zap className="h-4 w-4 text-green-500" />
                Student mode gives you the same learning experience as a regular learner
              </p>
            </div>
            <div className="grid gap-6 xl:grid-cols-12">
              <Card className="xl:col-span-3 border border-slate-200 dark:border-slate-700">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BookMarked className="h-4 w-4 text-green-500" />
                    Quick Links
                  </CardTitle>
                  <CardDescription>Learning actions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start hover:bg-green-50 hover:border-green-200 hover:text-green-700 transition-all group border-slate-200 dark:border-slate-700" onClick={() => navigateTo('/student/courses')}>
                    <BookOpen className="h-4 w-4 mr-2 text-green-500 group-hover:scale-110 transition-transform" />
                    Browse Courses
                  </Button>
                  <Button variant="outline" className="w-full justify-start hover:bg-green-50 hover:border-green-200 hover:text-green-700 transition-all group border-slate-200 dark:border-slate-700" onClick={() => navigateTo('/student/podcasts')}>
                    <Headphones className="h-4 w-4 mr-2 text-green-500 group-hover:scale-110 transition-transform" />
                    Listen Podcasts
                  </Button>
                  <Button variant="outline" className="w-full justify-start hover:bg-green-50 hover:border-green-200 hover:text-green-700 transition-all group border-slate-200 dark:border-slate-700" onClick={() => navigateTo('/student/assignments')}>
                    <FileText className="h-4 w-4 mr-2 text-green-500 group-hover:scale-110 transition-transform" />
                    My Assignments
                  </Button>
                </CardContent>
              </Card>

              <Card className="xl:col-span-9 border border-slate-200 dark:border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PanelTop className="h-5 w-5 text-green-500" />
                    Learning Overview
                  </CardTitle>
                  <CardDescription>Your student dashboard view</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">This student view behaves like the standard e-learning dashboard.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </SidebarLayout>
    );
  }

  if (role === 'pastor' && activeView === 'pastor') {
    return (
      <SidebarLayout
        userRole={role}
        userName={user.full_name}
        userEmail={user.email}
        activeView={activeView}
        onViewChange={setActiveView}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            Welcome back, Pastor {user.full_name}! 
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-3 py-1 text-sm font-medium text-amber-600">
              <Sparkles className="h-4 w-4" />
              Pastor
            </span>
          </h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-500" />
            Manage members, church content, and ministry updates
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="group hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-700">
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-amber-500" />
                Pending Approvals
              </CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                {pastorStats.pendingApprovals}
                <span className="text-sm font-normal text-muted-foreground">pending</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Content waiting for review</p>
            </CardContent>
          </Card>
          <Card className="group hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-700">
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <Headphones className="h-4 w-4 text-amber-500" />
                Podcast Drafts
              </CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                {pastorStats.podcastDrafts}
                <span className="text-sm font-normal text-muted-foreground">drafts</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Sermons and uploads in draft</p>
            </CardContent>
          </Card>
          <Card className="group hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-700">
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <Megaphone className="h-4 w-4 text-amber-500" />
                Announcements
              </CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                {pastorStats.announcements}
                <span className="text-sm font-normal text-muted-foreground">scheduled</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Scheduled church notices</p>
            </CardContent>
          </Card>
          <Card className="group hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-700">
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-amber-500" />
                Community Reach
              </CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                {pastorStats.reach}
                <span className="text-sm font-normal text-muted-foreground">engaged</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Monthly active engagement</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2 border border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="h-5 w-5 text-amber-500" />
                Pastor Actions
              </CardTitle>
              <CardDescription>Quick management actions for church leaders</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="justify-start hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700 transition-all group border-slate-200 dark:border-slate-700" onClick={() => navigateTo('/pastor/users')}>
                <Users className="h-4 w-4 mr-2 text-amber-500 group-hover:scale-110 transition-transform" />
                Members
              </Button>
              <Button variant="outline" className="justify-start hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700 transition-all group border-slate-200 dark:border-slate-700" onClick={() => navigateTo('/pastor/content')}>
                <FileText className="h-4 w-4 mr-2 text-amber-500 group-hover:scale-110 transition-transform" />
                Church Management
              </Button>
              <Button variant="outline" className="justify-start hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700 transition-all group border-slate-200 dark:border-slate-700" onClick={() => navigateTo('/pastor/promotions')}>
                <Calendar className="h-4 w-4 mr-2 text-amber-500 group-hover:scale-110 transition-transform" />
                Events
              </Button>
              <Button variant="outline" className="justify-start hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700 transition-all group border-slate-200 dark:border-slate-700" onClick={() => navigateTo('/pastor/analytics')}>
                <BarChart3 className="h-4 w-4 mr-2 text-amber-500 group-hover:scale-110 transition-transform" />
                Donations & Reports
              </Button>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-500" />
                Overview
              </CardTitle>
              <CardDescription>Church activity snapshot</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-3 hover:border-amber-200 hover:bg-amber-50/50 dark:hover:bg-amber-900/20 transition-all">
                <p className="text-xs text-muted-foreground">Sermon planning</p>
                <p className="font-medium">2 drafts ready for review</p>
              </div>
              <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-3 hover:border-amber-200 hover:bg-amber-50/50 dark:hover:bg-amber-900/20 transition-all">
                <p className="text-xs text-muted-foreground">Membership updates</p>
                <p className="font-medium">5 new requests this week</p>
              </div>
              <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-3 hover:border-amber-200 hover:bg-amber-50/50 dark:hover:bg-amber-900/20 transition-all">
                <p className="text-xs text-muted-foreground">Giving trends</p>
                <p className="font-medium text-green-600">Up 18% month over month</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout
      userRole={role}
      userName={user.full_name}
      userEmail={user.email}
      activeView={activeView}
      onViewChange={setActiveView}
    >
      {/* Render different dashboards based on active view */}
      {role === 'teacher' && activeView === 'teacher' ? (
        // Teacher Dashboard
        <>
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              Welcome back, Teacher {user.full_name}! 
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/20 px-3 py-1 text-sm font-medium text-blue-600">
                <Sparkles className="h-4 w-4" />
                Teacher
              </span>
            </h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-500" />
              Manage courses and track student progress
            </p>
          </div>

          {/* Teacher Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="group hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-700">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardDescription>Total Students</CardDescription>
                  <div className="p-2 bg-blue-100 rounded-lg group-hover:scale-110 transition-transform">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{teacherStats.totalStudents}</div>
                <p className="text-xs text-muted-foreground mt-1">Across all courses</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-700">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardDescription>Active Courses</CardDescription>
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:scale-110 transition-transform">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{teacherStats.activeCourses}</div>
                <p className="text-xs text-muted-foreground mt-1">Currently teaching</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-700">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardDescription>Pending Reviews</CardDescription>
                  <div className="p-2 bg-orange-100 rounded-lg group-hover:scale-110 transition-transform">
                    <FileText className="h-5 w-5 text-orange-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{teacherStats.pendingAssignments}</div>
                <p className="text-xs text-muted-foreground mt-1">Assignments to grade</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-700">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardDescription>Completion Rate</CardDescription>
                  <div className="p-2 bg-green-100 rounded-lg group-hover:scale-110 transition-transform">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{teacherStats.completionRate}%</div>
                <Progress value={teacherStats.completionRate} className="mt-2 bg-slate-200 dark:bg-slate-700" />
              </CardContent>
            </Card>
          </div>

          {/* Teacher Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                  Courses
                </CardTitle>
                <CardDescription>Courses you manage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {myCourses.map((course) => (
                  <div key={course.id} className="p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer border border-transparent hover:border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold">{course.title}</h4>
                      <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">{course.totalChapters} chapters</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {Math.floor(Math.random() * 20 + 10)} enrolled students
                    </p>
                    <Button size="sm" variant="outline" className="w-full hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all" onClick={() => navigateTo('/teacher/courses')}>
                      Manage Course
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  Pending Assignments
                </CardTitle>
                <CardDescription>Assignments waiting for review</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingAssignments.map((assignment) => (
                  <div key={assignment.id} className="p-3 bg-muted rounded-lg border border-transparent hover:border-orange-200 transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h5 className="font-medium text-sm">{assignment.title}</h5>
                        <p className="text-xs text-muted-foreground mt-1">
                          {assignment.course}
                        </p>
                      </div>
                      <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">{Math.floor(Math.random() * 8 + 3)}</Badge>
                    </div>
                    <Button size="sm" variant="outline" className="w-full mt-2 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-700 transition-all" onClick={() => navigateTo('/teacher/assignments')}>
                      Review Submissions
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="w-full hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all"
                  onClick={() => navigateTo('/teacher/assignments')}
                >
                  View All Assignments
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6 border border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                Submitted Students
              </CardTitle>
              <CardDescription>Recent student submissions with grades and comments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {teacherSubmissions.map((submission) => (
                <div key={submission.id} className="flex flex-col gap-3 rounded-lg border bg-muted/40 p-4 md:flex-row md:items-center md:justify-between border-slate-200 dark:border-slate-700 hover:border-blue-200 transition-all">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">{submission.student}</p>
                      <Badge variant={submission.status === 'graded' ? 'default' : 'secondary'} className={submission.status === 'graded' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}>
                        {submission.grade}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{submission.assignment}</p>
                    <p className="text-xs text-muted-foreground">{submission.course} • Submitted {submission.submittedAt}</p>
                  </div>
                  <div className="max-w-xl rounded-lg bg-background p-3 text-sm text-muted-foreground border border-slate-200 dark:border-slate-700">
                    {submission.comment}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      ) : (
        // Enhanced Student Dashboard
        <>
          <div className="space-y-6 text-[#4B2F18] bg-gradient-to-br from-[#F6EBD8] via-[#FEF6E8] to-white p-6 rounded-[32px] shadow-[0_20px_60px_rgba(134,80,20,0.08)]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2 text-[#865014] flex items-center gap-3">
                  Welcome back, {user.full_name}! 
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-3 py-1 text-sm font-medium text-amber-600">
                    <Sparkles className="h-4 w-4" />
                    Student
                  </span>
                </h1>
                <p className="text-[#7F6243] flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-500" />
                  Continue your learning journey and grow in faith
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button className="inline-flex items-center justify-center gap-2 rounded-full bg-[#865014] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#865014]/30 transition-all hover:bg-[#6d410f] hover:shadow-xl hover:scale-105 min-w-[180px]" onClick={() => navigateTo('/student/courses')}>
                  <BookOpen className="h-4 w-4" />
                  Continue Learning
                </Button>
                <Button variant="outline" className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#E0AE3F]/60 bg-white/80 px-6 py-3 text-sm font-semibold text-[#865014] transition-all hover:bg-[#E0AE3F]/10 hover:border-[#E0AE3F] hover:shadow-lg min-w-[180px]" onClick={() => navigateTo('/student/assignments')}>
                  <ListTodo className="h-4 w-4 text-[#865014]" />
                  View Assignments
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-2xl bg-white/80 backdrop-blur p-4 border border-[#E0AE3F]/30 shadow-sm hover:shadow-md transition-all hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[#865014] font-medium">Enrolled</p>
                    <p className="text-2xl font-bold text-[#4B2F18]">{studentStats.enrolledCourses}</p>
                  </div>
                  <div className="rounded-full bg-amber-100 p-2">
                    <BookOpen className="h-5 w-5 text-[#865014]" />
                  </div>
                </div>
              </div>
              <div className="rounded-2xl bg-white/80 backdrop-blur p-4 border border-[#E0AE3F]/30 shadow-sm hover:shadow-md transition-all hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[#865014] font-medium">Lessons</p>
                    <p className="text-2xl font-bold text-[#4B2F18]">{studentStats.completedLessons}/{studentStats.totalLessons}</p>
                  </div>
                  <div className="rounded-full bg-green-100 p-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </div>
              <div className="rounded-2xl bg-white/80 backdrop-blur p-4 border border-[#E0AE3F]/30 shadow-sm hover:shadow-md transition-all hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[#865014] font-medium">Hours</p>
                    <p className="text-2xl font-bold text-[#4B2F18]">{studentStats.hoursLearned}h</p>
                  </div>
                  <div className="rounded-full bg-blue-100 p-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </div>
              <div className="rounded-2xl bg-white/80 backdrop-blur p-4 border border-[#E0AE3F]/30 shadow-sm hover:shadow-md transition-all hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[#865014] font-medium">Certificates</p>
                    <p className="text-2xl font-bold text-[#4B2F18]">{studentStats.certificates}</p>
                  </div>
                  <div className="rounded-full bg-purple-100 p-2">
                    <Award className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Card */}
            <div className="rounded-2xl bg-white/80 backdrop-blur border border-[#E0AE3F]/30 p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div>
                  <p className="text-sm font-medium text-[#4B2F18]">Learning Progress</p>
                  <p className="text-xs text-[#7F6243]">Stay on track with your current path</p>
                </div>
                <Badge className="bg-[#865014] text-white px-3 py-1 text-sm">{completionPercentage.toFixed(0)}%</Badge>
              </div>
              <Progress value={completionPercentage} className="h-3 rounded-full bg-[#E0AE3F]/20" />
              <div className="flex justify-between mt-2 text-xs text-[#7F6243]">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Weekly Activity */}
            <div className="rounded-2xl bg-white/80 backdrop-blur border border-[#E0AE3F]/30 p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-[#4B2F18]">Weekly Activity</h3>
                  <p className="text-xs text-[#7F6243]">Your learning engagement</p>
                </div>
                <Badge variant="outline" className="border-[#E0AE3F]/30 text-[#865014]">
                  <Flame className="h-3 w-3 mr-1 text-amber-500" />
                  7 day streak
                </Badge>
              </div>
              <div className="flex h-48 items-end gap-3 rounded-2xl bg-[#FEF6E8] p-4">
                {weeklyActivity.map((item) => (
                  <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
                    <div className="relative w-full h-36 flex items-end">
                      <div
                        className="w-full rounded-t-lg bg-gradient-to-t from-amber-500/80 to-amber-400/40 transition-all hover:scale-105 hover:from-amber-500"
                        style={{ height: `${item.value}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-[#865014]">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* My Courses */}
            <div className="rounded-2xl bg-white/80 backdrop-blur border border-[#E0AE3F]/30 p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="font-semibold text-[#4B2F18]">Continue Learning</h3>
                  <p className="text-xs text-[#7F6243]">Pick up where you left off</p>
                </div>
                <Button variant="outline" className="border-[#E0AE3F]/30 text-[#865014] hover:bg-[#E0AE3F]/10" onClick={() => navigateTo('/student/courses')}>
                  View All
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
              <div className="space-y-4">
                {myCourses.map((course) => (
                  <div key={course.id} className="group flex gap-4 rounded-xl border border-[#E0AE3F]/30 bg-white p-4 transition-all hover:shadow-lg hover:border-[#E0AE3F] hover:scale-[1.02]">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <h4 className="font-bold text-[#4B2F18]">{course.title}</h4>
                        <Badge variant="outline" className="border-[#E0AE3F]/30 text-[#865014]">
                          {course.completedChapters}/{course.totalChapters}
                        </Badge>
                      </div>
                      <p className="text-sm text-[#7F6243] mb-2">By {course.teacher}</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm text-[#7F6243]">
                          <span>Progress</span>
                          <span className="font-medium text-[#4B2F18]">{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2 rounded-full bg-[#E0AE3F]/20" />
                      </div>
                      <Button size="sm" className="mt-3 bg-[#865014] text-white hover:bg-[#6d410f] hover:shadow-lg transition-all w-full justify-center group-hover:scale-105" onClick={() => navigateTo('/student/courses')}>
                        Continue: {course.nextLesson}
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Assignments & Podcasts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-2xl bg-white/80 backdrop-blur border border-[#E0AE3F]/30 p-6 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-[#4B2F18]">Assignments</h3>
                    <p className="text-xs text-[#7F6243]">Due soon</p>
                  </div>
                  <Badge className="bg-[#865014] text-white">{upcomingAssignments.length}</Badge>
                </div>
                <div className="space-y-3">
                  {upcomingAssignments.map((assignment) => (
                    <div key={assignment.id} className="p-3 rounded-xl bg-white border border-[#E0AE3F]/30 hover:border-[#E0AE3F] hover:shadow transition-all">
                      <div className="flex items-start gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-[#865014] mt-0.5" />
                        <div className="flex-1">
                          <h5 className="font-medium text-sm text-[#4B2F18]">{assignment.title}</h5>
                          <p className="text-xs text-[#7F6243] mt-1">{assignment.course}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#865014] font-semibold">Due: {assignment.dueDate}</span>
                        <Button size="sm" variant="outline" className="border-[#E0AE3F]/30 text-[#865014] hover:bg-[#E0AE3F]/10 hover:border-[#E0AE3F]">Start</Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full border-[#E0AE3F]/30 text-[#865014] hover:bg-[#E0AE3F]/10" onClick={() => navigateTo('/student/assignments')}>View All Assignments</Button>
                </div>
              </div>

              <div className="rounded-2xl bg-white/80 backdrop-blur border border-[#E0AE3F]/30 p-6 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-[#4B2F18]">Latest Podcasts</h3>
                    <p className="text-xs text-[#7F6243]">New sermons & teachings</p>
                  </div>
                  <Headphones className="h-5 w-5 text-[#865014]" />
                </div>
                <div className="space-y-3">
                  {recentPodcasts.map((podcast) => (
                    <div key={podcast.id} className="flex gap-3 cursor-pointer rounded-xl border border-[#E0AE3F]/30 bg-white p-3 transition-all hover:border-[#E0AE3F] hover:shadow hover:scale-[1.02]">
                      <img src={podcast.thumbnail} alt={podcast.title} className="w-16 h-16 object-cover rounded-lg" />
                      <div className="flex-1">
                        <h5 className="font-medium text-sm text-[#4B2F18] line-clamp-2">{podcast.title}</h5>
                        <p className="text-xs text-[#7F6243]">{podcast.author} • {podcast.duration}</p>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full rounded-full border-2 border-[#E0AE3F]/60 text-[#865014] hover:bg-[#E0AE3F]/10 hover:border-[#E0AE3F]" onClick={() => navigateTo('/student/podcasts')}>
                    <Headphones className="h-4 w-4 mr-2 text-[#865014]" /> Browse All Podcasts
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-2xl bg-white/80 backdrop-blur border border-[#E0AE3F]/30 p-6 shadow-sm hover:shadow-md transition-all">
              <h3 className="font-semibold text-[#4B2F18] mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: BookOpen, label: 'Browse Courses', path: '/student/courses' },
                  { icon: Headphones, label: 'Listen Podcasts', path: '/student/podcasts' },
                  { icon: FileText, label: 'My Assignments', path: '/student/assignments' },
                  { icon: Award, label: 'Certificates', path: '/student/certificates' },
                ].map((action) => (
                  <Button
                    key={action.label}
                    variant="outline"
                    className="h-auto flex-col py-4 border-2 border-[#E0AE3F]/30 bg-white/50 text-[#865014] hover:bg-[#E0AE3F]/10 hover:border-[#E0AE3F] hover:shadow-lg transition-all hover:scale-105"
                    onClick={() => navigateTo(action.path)}
                  >
                    <action.icon className="h-6 w-6 mb-2 text-[#865014]" />
                    <span className="text-sm font-medium">{action.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </SidebarLayout>
  );
}