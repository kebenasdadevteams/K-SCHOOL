import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
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
} from 'lucide-react';

type ActiveView = 'student' | 'teacher' | 'pastor' | 'editor' | 'admin' | 'developer';

interface RoleDashboardProps {
  defaultRole?: ActiveView;
}

export default function RoleDashboard({ defaultRole }: RoleDashboardProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const locationState = (location.state as { role?: string; userName?: string; userEmail?: string; view?: ActiveView }) || {};

  const [user] = useState({
    full_name: locationState.userName || 'Demo User',
    email: locationState.userEmail || 'demo@church.com',
  });

  const [role] = useState<ActiveView>((locationState.role as ActiveView) || defaultRole || 'student');

  const [activeView, setActiveView] = useState<ActiveView>(
    (locationState.view as ActiveView) ?? (locationState.role === 'teacher' ? 'teacher' : (locationState.role === 'pastor' ? 'pastor' : (locationState.role === 'editor' ? 'editor' : (locationState.role === 'admin' ? 'admin' : (locationState.role === 'developer' ? 'developer' : 'student')))))
  );

  // Shared mock data
  const studentStats = {
    enrolledCourses: 3,
    completedLessons: 24,
    totalLessons: 48,
    certificates: 1,
    hoursLearned: 18,
  };

  const myCourses = [
    { id: 1, title: 'Introduction to Biblical Studies', teacher: 'Pastor John', progress: 65, nextLesson: 'Chapter 4: The Pentateuch', totalChapters: 12, completedChapters: 7, thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop' },
    { id: 2, title: 'Amharic Bible Study', teacher: 'Teacher Mary', progress: 40, nextLesson: 'Chapter 3: የዘፍጥረት መጽሐፍ', totalChapters: 10, completedChapters: 4, thumbnail: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=300&fit=crop' },
    { id: 3, title: 'Christian Leadership Principles', teacher: 'Pastor David', progress: 20, nextLesson: 'Chapter 2: Servant Leadership', totalChapters: 8, completedChapters: 1, thumbnail: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&h=300&fit=crop' },
  ];

  const upcomingAssignments = [
    { id: 1, title: 'Chapter 4 Assignment: Old Testament Analysis', course: 'Biblical Studies', dueDate: 'Feb 18, 2026', status: 'pending' },
    { id: 2, title: 'Leadership Essay Submission', course: 'Christian Leadership', dueDate: 'Feb 20, 2026', status: 'pending' },
  ];

  const recentPodcasts = [
    { id: 1, title: 'Sunday Sermon: Walking in Faith', author: 'Pastor John', duration: '45 min', thumbnail: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=200&h=200&fit=crop' },
    { id: 2, title: 'Daily Devotional - Feb 15', author: 'Pastor Michael', duration: '15 min', thumbnail: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=200&h=200&fit=crop' },
  ];

  const weeklyActivity = [
    { label: 'Mon', value: 24 }, { label: 'Tue', value: 38 }, { label: 'Wed', value: 52 }, { label: 'Thu', value: 44 }, { label: 'Fri', value: 60 }, { label: 'Sat', value: 36 }, { label: 'Sun', value: 48 },
  ];

  const completionPercentage = (studentStats.completedLessons / studentStats.totalLessons) * 100;

  const teacherStats = { totalStudents: 45, activeCourses: 3, pendingAssignments: 12, completionRate: 78 };
  const teacherSubmissions = [
    { id: 1, student: 'Abebe Kebede', assignment: 'Chapter 4 Assignment: Old Testament Analysis', course: 'Introduction to Biblical Studies', submittedAt: 'Today, 8:15 AM', grade: 'A-', comment: 'Strong scripture references and a clear argument.', status: 'graded' },
    { id: 2, student: 'Tigist Alemayehu', assignment: 'Leadership Essay Submission', course: 'Christian Leadership Principles', submittedAt: 'Today, 10:30 AM', grade: 'B+', comment: 'Good structure. Add one more leadership example next time.', status: 'graded' },
    { id: 3, student: 'Dawit Tesfaye', assignment: 'Amharic Bible Study Reflection', course: 'Amharic Bible Study', submittedAt: 'Today, 11:05 AM', grade: 'Pending', comment: 'Awaiting review and feedback.', status: 'submitted' },
  ];

  const pastorStats = { pendingApprovals: 2, podcastDrafts: 1, announcements: 1, reach: '1.2k' };
  const adminStats = { totalUsers: 9, pendingCourses: 3, contentItems: 4, systemAlerts: 2 };
  const developerStats = { totalUsers: 9, debugTickets: 4, systemHealth: 'Live', activeSites: 1 };

  // Helper function to navigate with proper paths
  const navigateTo = (path: string) => {
    // If the path already starts with a slash, use it as-is
    if (path.startsWith('/')) {
      navigate(path, { 
        state: { 
          ...(location.state as Record<string, unknown> || {}), 
          role, 
          view: activeView 
        } 
      });
      return;
    }
    
    // Otherwise, prepend the current role
    const fullPath = `/${role}${path.startsWith('/') ? path : `/${path}`}`;
    navigate(fullPath, { 
      state: { 
        ...(location.state as Record<string, unknown> || {}), 
        role, 
        view: activeView 
      } 
    });
  };

  const navigateWithTeacherState = (path: string) => {
    const fullPath = path.startsWith('/') ? path : `/teacher/${path}`;
    navigate(fullPath, { 
      state: { 
        ...(location.state as Record<string, unknown> || {}), 
        role: 'teacher', 
        view: 'teacher' 
      } 
    });
  };

  const switchView = (view: ActiveView) => {
    setActiveView(view);
    // Navigate to the dashboard of the selected view
    navigate(`/${view}`, { 
      state: { 
        ...(location.state as Record<string, unknown> || {}), 
        role: view === 'student' ? role : view, 
        view 
      } 
    });
  };

  // Render role-specific layout using SidebarLayout
  return (
    <>
      {/* Admin */}
      {role === 'admin' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Users</CardDescription>
                <CardTitle className="text-3xl">{adminStats.totalUsers}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">All active platform accounts</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Courses Pending Approval</CardDescription>
                <CardTitle className="text-3xl">{adminStats.pendingCourses}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Submitted by teachers</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Content Items</CardDescription>
                <CardTitle className="text-3xl">{adminStats.contentItems}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Managed posts and podcasts</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>System Alerts</CardDescription>
                <CardTitle className="text-3xl">{adminStats.systemAlerts}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Items needing attention</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Admin Actions</CardTitle>
                <CardDescription>Manage the full platform from one place</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="justify-start" onClick={() => navigateTo('users')}>
                  <Users className="h-4 w-4 mr-2" /> Manage Users
                </Button>
                <Button variant="outline" className="justify-start" onClick={() => navigateTo('courses')}>
                  <BookOpen className="h-4 w-4 mr-2" /> Review Courses
                </Button>
                <Button variant="outline" className="justify-start" onClick={() => navigateTo('content')}>
                  <FileText className="h-4 w-4 mr-2" /> Content Management
                </Button>
                <Button variant="outline" className="justify-start" onClick={() => navigateTo('podcasts')}>
                  <Headphones className="h-4 w-4 mr-2" /> Podcasts
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pending Course Approvals</CardTitle>
                <CardDescription>Teacher-created courses awaiting approval</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[{ title: 'Christian Ethics 101', teacher: 'Teacher Mary' }, { title: 'Biblical Leadership', teacher: 'Pastor John' }, { title: 'Amharic Devotional Study', teacher: 'Teacher Dawit' }].map((course) => (
                  <div key={course.title} className="rounded-lg border p-3">
                    <p className="font-medium">{course.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">Submitted by {course.teacher}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Editor */}
      {role === 'editor' && (
        <>
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Welcome, Editor!</h1>
            <p className="text-muted-foreground">Manage content and podcasts</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Content Items</CardDescription>
                <CardTitle className="text-3xl">24</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Published content</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Podcasts</CardDescription>
                <CardTitle className="text-3xl">12</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Total episodes</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Drafts</CardDescription>
                <CardTitle className="text-3xl">5</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">In progress</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Pending Review</CardDescription>
                <CardTitle className="text-3xl">3</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Awaiting approval</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Content management shortcuts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" onClick={() => navigateTo('content')}>
                  <FileText className="h-4 w-4 mr-2" /> Manage Content
                </Button>
                <Button className="w-full justify-start" onClick={() => navigateTo('podcasts')}>
                  <Headphones className="h-4 w-4 mr-2" /> Manage Podcasts
                </Button>
                <Button className="w-full justify-start" onClick={() => navigateTo('settings')}>
                  <Settings className="h-4 w-4 mr-2" /> Editor Settings
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest content updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-lg border p-3">
                  <p className="font-medium">New podcast episode uploaded</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="font-medium">Article published: "Faith in Action"</p>
                  <p className="text-xs text-muted-foreground">5 hours ago</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="font-medium">Content draft saved: "Community Outreach"</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Developer */}
      {role === 'developer' && (
        <>
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Developer Dashboard</h1>
            <p className="text-muted-foreground">System health and technical overview</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>System Status</CardDescription>
                <CardTitle className="text-3xl text-green-600">Live</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">All systems operational</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Users</CardDescription>
                <CardTitle className="text-3xl">{developerStats.totalUsers}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Platform users</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Debug Tickets</CardDescription>
                <CardTitle className="text-3xl">{developerStats.debugTickets}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Open issues</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Active Sites</CardDescription>
                <CardTitle className="text-3xl">{developerStats.activeSites}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Live deployments</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Technical Actions</CardTitle>
                <CardDescription>Developer tools and settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" onClick={() => navigateTo('users')}>
                  <Users className="h-4 w-4 mr-2" /> User Management
                </Button>
                <Button className="w-full justify-start" onClick={() => navigateTo('content')}>
                  <FileText className="h-4 w-4 mr-2" /> Content Management
                </Button>
                <Button className="w-full justify-start" onClick={() => navigateTo('settings')}>
                  <Settings className="h-4 w-4 mr-2" /> System Settings
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>Current system status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center border-b pb-2">
                  <span>Database</span>
                  <Badge className="bg-green-500">Operational</Badge>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span>API Server</span>
                  <Badge className="bg-green-500">Operational</Badge>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span>Storage</span>
                  <Badge className="bg-yellow-500">85% Used</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Background Jobs</span>
                  <Badge className="bg-green-500">Running</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Pastor */}
      {role === 'pastor' && (
        <>
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Pastor Dashboard</h1>
            <p className="text-muted-foreground">Manage church ministry and congregation</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Congregation</CardDescription>
                <CardTitle className="text-3xl">156</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Active members</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Sermons</CardDescription>
                <CardTitle className="text-3xl">24</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Published sermons</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Events</CardDescription>
                <CardTitle className="text-3xl">8</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Upcoming events</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Donations</CardDescription>
                <CardTitle className="text-3xl">$12.4k</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Ministry Actions</CardTitle>
                <CardDescription>Manage church activities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" onClick={() => navigateTo('users')}>
                  <Users className="h-4 w-4 mr-2" /> Manage Members
                </Button>
                <Button className="w-full justify-start" onClick={() => navigateTo('podcasts')}>
                  <Headphones className="h-4 w-4 mr-2" /> Manage Sermons
                </Button>
                <Button className="w-full justify-start" onClick={() => navigateTo('promotions')}>
                  <Megaphone className="h-4 w-4 mr-2" /> Events & Announcements
                </Button>
                <Button className="w-full justify-start" onClick={() => navigateTo('settings')}>
                  <Settings className="h-4 w-4 mr-2" /> Church Settings
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest church updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-lg border p-3">
                  <p className="font-medium">New member joined: Tigist Hailu</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="font-medium">Sermon uploaded: "Walking in Faith"</p>
                  <p className="text-xs text-muted-foreground">Yesterday</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="font-medium">Event created: Community Outreach</p>
                  <p className="text-xs text-muted-foreground">2 days ago</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Teacher */}
      {role === 'teacher' && (
        <>
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Welcome back, {user.full_name.split(' ')[0]}!</h1>
              <p className="text-muted-foreground">Manage courses and track student progress</p>
            </div>

            <div className="flex items-center gap-3">
              <Button variant={activeView === 'teacher' ? 'default' : 'ghost'} onClick={() => switchView('teacher')}>Teacher View</Button>
              <Button variant={activeView === 'student' ? 'default' : 'outline'} onClick={() => switchView('student')}>Student View</Button>
              <Button onClick={() => navigateTo('assignments')}>View Assignments</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Active Courses</CardDescription>
                <CardTitle className="text-3xl">{teacherStats.activeCourses}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Currently teaching</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Students</CardDescription>
                <CardTitle className="text-3xl">{teacherStats.totalStudents}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Across all courses</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Pending Reviews</CardDescription>
                <CardTitle className="text-3xl">{teacherStats.pendingAssignments}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Assignments to grade</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Completion Rate</CardDescription>
                <CardTitle className="text-3xl">{teacherStats.completionRate}%</CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={teacherStats.completionRate} className="h-2 rounded-full" />
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Courses</CardTitle>
                <CardDescription>Courses you manage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {myCourses.map((course) => (
                  <div key={course.id} className="rounded-lg border p-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium">{course.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{course.completedChapters} completed · {course.totalChapters} chapters</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">{course.totalChapters} chapters</Badge>
                      <div className="mt-3">
                        <Button size="sm" onClick={() => navigateTo(`manage-courses/${course.id}`)}>Manage Course</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pending Assignments</CardTitle>
                <CardDescription>Assignments waiting for review</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {teacherSubmissions.slice(0,3).map((s) => (
                  <div key={s.id} className="rounded-md border p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{s.assignment}</p>
                        <p className="text-xs text-muted-foreground">{s.course}</p>
                      </div>
                      <div className="text-right">
                        <Badge>{s.grade}</Badge>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Button size="sm" onClick={() => navigateTo('assignments')}>Review Submissions</Button>
                    </div>
                  </div>
                ))}
                <div>
                  <Button variant="ghost" onClick={() => navigateTo('assignments')}>View All Assignments</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Student */}
      {role === 'student' && (
        <>
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Welcome back, {user.full_name.split(' ')[0]}!</h1>
            <p className="text-muted-foreground">Track your courses and complete lessons</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Students</CardDescription>
                <CardTitle className="text-3xl">{studentStats.enrolledCourses * 7}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Across all courses</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Active Courses</CardDescription>
                <CardTitle className="text-3xl">{studentStats.enrolledCourses}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Currently enrolled</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Completed Lessons</CardDescription>
                <CardTitle className="text-3xl">{studentStats.completedLessons}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Keep up the good work</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Certificates</CardDescription>
                <CardTitle className="text-3xl">{studentStats.certificates}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Earned certificates</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Courses</CardTitle>
                <CardDescription>Your enrolled courses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {myCourses.map((c) => (
                  <div key={c.id} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{c.title}</p>
                        <p className="text-xs text-muted-foreground">{c.teacher}</p>
                      </div>
                      <div className="w-48">
                        <Progress value={c.progress} />
                        <p className="text-xs text-right mt-1">{c.progress}% complete</p>
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full" onClick={() => navigateTo('courses')}>
                  View All Courses <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pending Assignments</CardTitle>
                <CardDescription>Upcoming tasks</CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingAssignments.map((a) => (
                  <div key={a.id} className="rounded-md border p-3 mb-3">
                    <p className="font-medium">{a.title}</p>
                    <p className="text-xs text-muted-foreground">Due: {a.dueDate}</p>
                    <Button size="sm" className="mt-2 w-full" variant="outline" onClick={() => navigateTo('assignments')}>
                      View Details
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </>
  );
}