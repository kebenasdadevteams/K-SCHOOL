// src/dashboards/student/Courses.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SidebarLayout } from '../../SidebarLayout';
import api from '../../services/api';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Progress } from '../../components/ui/progress';
import { 
  ArrowLeft, 
  Plus, 
  BookOpen, 
  Users, 
  Clock, 
  ChevronRight, 
  Lock, 
  Play, 
  MessageSquare, 
  ClipboardCheck,
  Search,
  LayoutGrid,
  List,
  RefreshCw,
  GraduationCap,
  CheckCircle,
  Star,
  Award,
  Calendar,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

export default function Courses() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [courses, setCourses] = useState<Array<{
    id: number;
    title: string;
    description: string;
    teacher?: string;
    teacher_name?: string;
    category?: string;
    students?: number;
    chapters?: number;
    duration?: string;
    progress?: number;
    thumbnail?: string;
    level?: string;
    rating?: number;
    status?: string;
    enrolled_at?: string;
    total_assignments?: number;
    submitted_assignments?: number;
    graded_assignments?: number;
    course_status?: string;
    published_at?: string;
    image_url?: string;
  }>>([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<number[]>([]);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<'enrolled' | 'available'>('enrolled');

  // Get user info from navigation state, or use defaults
  const locationState = location.state as { role?: string; userName?: string; userEmail?: string; view?: 'student' | 'teacher' | 'pastor' | 'editor' | 'admin' | 'developer' } | null;
  const [user] = useState({
    full_name: locationState?.userName || 'Demo User',
    email: locationState?.userEmail || 'demo@church.com'
  });
  const [role] = useState(locationState?.role || 'student');
  const [activeView, setActiveView] = useState<'student' | 'teacher' | 'pastor' | 'editor' | 'admin' | 'developer'>(
    locationState?.view ?? 'student'
  );
  const isStudentView = activeView === 'student';
  const isTeacherManager = role === 'teacher' && activeView === 'teacher';
  const isAdminView = role === 'admin' && activeView === 'admin';
  const [pendingCourseApprovals, setPendingCourseApprovals] = useState([
    { id: 1, title: 'Christian Ethics 101', teacher: 'Teacher Mary', submittedAt: '2h ago' },
    { id: 2, title: 'Biblical Leadership', teacher: 'Pastor John', submittedAt: '1d ago' },
    { id: 3, title: 'Amharic Devotional Study', teacher: 'Teacher Dawit', submittedAt: '3d ago' },
  ]);

  const approveCourse = (courseId: number) => {
    setPendingCourseApprovals((current) => current.filter((course) => course.id !== courseId));
  };

  const loadCourses = async () => {
    try {
      setLoading(true);
      const [coursesResult, enrollmentsResult] = await Promise.allSettled([
        api.get('/courses'),
        api.get('/activity/enrollments')
      ]);

      const allCourses = (coursesResult.status === 'fulfilled' ? coursesResult.value.data.data : []).map((course: any) => ({
        id: Number(course.id),
        title: course.title || 'Untitled Course',
        description: course.description || 'No description available.',
        teacher: course.teacher_name || course.teacher || 'Instructor',
        // Fix: Use image_url first, then imageUrl, then thumbnail, then fallback
        thumbnail: course.image_url || course.imageUrl || course.thumbnail || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
        image_url: course.image_url || course.imageUrl || '',
        students: course.students || course.enrollment_count || 0,
        chapters: Array.isArray(course.sections) ? course.sections.length : course.chapters || 0,
        duration: course.duration || 'Self-paced',
        progress: course.progress || 0,
        category: course.category || 'General',
        level: course.level || 'beginner',
        rating: course.rating || 0,
        status: course.status || 'draft',
        published_at: course.published_at,
      }));

      const enrolledItems = enrollmentsResult.status === 'fulfilled' ? enrollmentsResult.value.data.data : [];
      const enrolledIds = enrolledItems.map((item: any) => Number(item.course_id));
      const enrolledMap = enrolledItems.reduce((acc: Record<number, any>, item: any) => {
        const key = Number(item.course_id);
        acc[key] = {
          enrolled_at: item.enrolled_at,
          total_assignments: item.total_assignments || 0,
          submitted_assignments: item.submitted_assignments || 0,
          graded_assignments: item.graded_assignments || 0,
          course_status: item.status,
        };
        return acc;
      }, {} as Record<number, any>);

      const publishedCourses = allCourses.filter((c: any) => c.status === 'published' || c.status === 'approved');
      setEnrolledCourseIds(enrolledIds);
      setCourses(publishedCourses.map((course) => ({
        ...course,
        teacher: course.teacher || course.teacher_name || 'Instructor',
        enrolled_at: enrolledMap[course.id]?.enrolled_at,
        total_assignments: enrolledMap[course.id]?.total_assignments || 0,
        submitted_assignments: enrolledMap[course.id]?.submitted_assignments || 0,
        graded_assignments: enrolledMap[course.id]?.graded_assignments || 0,
      })));

      if (enrollmentsResult.status === 'rejected') {
        console.warn('Unable to load enrollments', enrollmentsResult.reason);
      }
      if (coursesResult.status === 'rejected') {
        throw coursesResult.reason;
      }
    } catch (error) {
      console.error('Unable to load courses', error);
      toast.error('Failed to load courses');
      setCourses([]);
      setEnrolledCourseIds([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleEnroll = async (courseId: number) => {
    setIsEnrolling(true);
    try {
      // Fix: Send course_id (with underscore) instead of courseId
      const { data } = await api.post('/activity/enroll', { course_id: courseId });
      if (data?.success) {
        toast.success('🎉 Successfully enrolled in the course!');
        await loadCourses();
        setActiveTab('enrolled');
      } else {
        toast.error(data?.message || 'Failed to enroll in course');
      }
    } catch (error: any) {
      console.error('Enrollment error:', error);
      toast.error(error.response?.data?.message || 'Failed to enroll in course');
    } finally {
      setIsEnrolling(false);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-700 border-green-200';
      case 'intermediate': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'advanced': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress === 100) return 'bg-emerald-500';
    if (progress >= 70) return 'bg-blue-500';
    if (progress >= 30) return 'bg-amber-500';
    return 'bg-slate-300';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Filter courses based on search
  const filterCourses = (courseList: any[]) => {
    if (!searchQuery) return courseList;
    const query = searchQuery.toLowerCase();
    return courseList.filter(course => 
      course.title.toLowerCase().includes(query) ||
      course.description.toLowerCase().includes(query) ||
      course.teacher.toLowerCase().includes(query) ||
      course.category?.toLowerCase().includes(query)
    );
  };

  const availableCourses = courses.filter((course) => !enrolledCourseIds.includes(Number(course.id)));
  const enrolledCourses = courses.filter((course) => enrolledCourseIds.includes(Number(course.id)));
  
  const filteredAvailable = filterCourses(availableCourses);
  const filteredEnrolled = filterCourses(enrolledCourses);

  const chapters = [
    {
      id: 1,
      title: 'Chapter 1: Introduction to the Bible',
      lessons: 5,
      duration: '45 min',
      isLocked: false,
      completed: true,
    },
    {
      id: 2,
      title: 'Chapter 2: The Old Testament Overview',
      lessons: 6,
      duration: '60 min',
      isLocked: false,
      completed: true,
    },
    {
      id: 3,
      title: 'Chapter 3: Understanding Genesis',
      lessons: 8,
      duration: '90 min',
      isLocked: false,
      completed: false,
    },
    {
      id: 4,
      title: 'Chapter 4: The Pentateuch',
      lessons: 7,
      duration: '75 min',
      isLocked: true,
      completed: false,
    },
  ];

  const teacherAssignmentQueue = [
    { id: 1, student: 'Abebe Kebede', courseId: 1, assignment: 'Chapter 4 Reflection', submittedAt: '2h ago', status: 'submitted' },
    { id: 2, student: 'Tigist Alemayehu', courseId: 1, assignment: 'Pentateuch Summary', submittedAt: '1d ago', status: 'needs-feedback' },
    { id: 3, student: 'Dawit Tesfaye', courseId: 4, assignment: 'Genesis Study Notes', submittedAt: '3h ago', status: 'submitted' },
  ];

  const teacherCourseFeedback = [
    { id: 1, courseId: 1, student: 'Rahel Solomon', comment: 'Chapter 3 videos are very helpful, please add more examples.', time: 'Today' },
    { id: 2, courseId: 1, student: 'Eden Bekele', comment: 'Could you add a quick quiz after each chapter?', time: 'Yesterday' },
    { id: 3, courseId: 4, student: 'Samuel Mekonnen', comment: 'The Amharic explanation was very clear and practical.', time: '2d ago' },
  ];

  const selectedCourseData = [...enrolledCourses, ...availableCourses].find(
    (course) => course.id === selectedCourse
  ) || null;
  
  const selectedCourseAssignments = selectedCourseData
    ? teacherAssignmentQueue.filter((item) => item.courseId === selectedCourseData.id)
    : [];
  const selectedCourseFeedback = selectedCourseData
    ? teacherCourseFeedback.filter((item) => item.courseId === selectedCourseData.id)
    : [];

  // Show loading state
  if (loading) {
    return (
      <SidebarLayout
        userRole={role}
        userName={user.full_name}
        userEmail={user.email}
        activeView={activeView}
        onViewChange={setActiveView}
      >
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-amber-500 mx-auto mb-4" />
            <p className="text-slate-500">Loading your courses...</p>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  // Show empty state
  if (courses.length === 0) {
    return (
      <SidebarLayout
        userRole={role}
        userName={user.full_name}
        userEmail={user.email}
        activeView={activeView}
        onViewChange={setActiveView}
      >
        <div className="rounded-3xl border border-muted/40 bg-muted/20 p-10 text-center text-muted-foreground">
          <BookOpen className="h-16 w-16 mx-auto mb-4 text-slate-300" />
          <h2 className="text-2xl font-semibold text-foreground mb-2">No courses available yet</h2>
          <p className="max-w-xl mx-auto text-sm leading-6">
            We couldn't find any courses to show right now. Please refresh or check back later.
          </p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={loadCourses}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
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
      {/* Main Content */}
      {isAdminView && (
        <Card className="mb-8 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle>Course Approval Queue</CardTitle>
            <CardDescription>Review courses submitted by teachers before they go live</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingCourseApprovals.length === 0 ? (
              <p className="text-sm text-muted-foreground">No courses waiting for approval.</p>
            ) : (
              pendingCourseApprovals.map((course) => (
                <div key={course.id} className="flex flex-col gap-3 rounded-lg border bg-background p-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-medium">{course.title}</p>
                    <p className="text-xs text-muted-foreground">Submitted by {course.teacher} • {course.submittedAt}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => navigate('/content', { state: { ...((location.state as Record<string, unknown>) || {}), role } })}>
                      Review Details
                    </Button>
                    <Button onClick={() => approveCourse(course.id)}>Approve</Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Courses</CardDescription>
            <CardTitle className="text-3xl">{courses.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{isTeacherManager ? 'Total Students' : 'Enrolled Courses'}</CardDescription>
            <CardTitle className="text-3xl">{isTeacherManager ? '172' : enrolledCourses.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{isAdminView ? 'Courses Awaiting Approval' : isTeacherManager ? 'Pending Assignment Reviews' : 'Available Courses'}</CardDescription>
            <CardTitle className="text-3xl">{isAdminView ? String(pendingCourseApprovals.length) : isTeacherManager ? String(teacherAssignmentQueue.length) : availableCourses.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{isAdminView ? 'Approvals Ready' : isTeacherManager ? 'New Course Feedback' : 'Avg. Completion'}</CardDescription>
            <CardTitle className="text-3xl">{isAdminView ? '3' : isTeacherManager ? String(teacherCourseFeedback.length) : '65%'}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {selectedCourse ? (
        // Course Detail View
        <div>
          <Button 
            variant="ghost" 
            className="mb-4"
            onClick={() => setSelectedCourse(null)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Course Info */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <img 
                    src={selectedCourseData.thumbnail || selectedCourseData.image_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop'} 
                    alt={selectedCourseData.title}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop';
                    }}
                  />
                  <CardTitle>{selectedCourseData.title}</CardTitle>
                  <CardDescription>{selectedCourseData.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Teacher</span>
                    <span className="font-medium">{selectedCourseData.teacher}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Students</span>
                    <span className="font-medium">{selectedCourseData.students}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Level</span>
                    <Badge className={getLevelColor(selectedCourseData.level || 'beginner')}>
                      {selectedCourseData.level || 'Beginner'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium">{selectedCourseData.duration}</span>
                  </div>
                  {selectedCourseData.rating && selectedCourseData.rating > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Rating</span>
                      <span className="font-medium flex items-center gap-1">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        {selectedCourseData.rating.toFixed(1)}
                      </span>
                    </div>
                  )}

                  {isTeacherManager ? (
                    <>
                      <div className="rounded-lg border bg-muted/30 p-3 text-sm">
                        <p className="font-medium">Teacher tools</p>
                        <p className="text-muted-foreground mt-1">Manage chapters, review assignments, and respond to student feedback.</p>
                      </div>
                      <Button className="w-full">Manage Course</Button>
                    </>
                  ) : (
                    <>
                      {enrolledCourseIds.includes(selectedCourseData.id) && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{selectedCourseData.progress}%</span>
                          </div>
                          <Progress value={selectedCourseData.progress} />
                        </div>
                      )}
                      {enrolledCourseIds.includes(selectedCourseData.id) ? (
                        <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                          <Play className="h-4 w-4 mr-2" />
                          Continue Learning
                        </Button>
                      ) : (
                        <Button 
                          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                          onClick={() => handleEnroll(selectedCourseData.id)}
                          disabled={isEnrolling}
                        >
                          {isEnrolling ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Plus className="h-4 w-4 mr-2" />
                          )}
                          Enroll Now
                        </Button>
                      )}
                      {enrolledCourseIds.includes(selectedCourseData.id) && selectedCourseData.enrolled_at && (
                        <div className="text-xs text-slate-400 text-center pt-2 border-t border-slate-100">
                          <Calendar className="h-3 w-3 inline mr-1" />
                          Enrolled on {formatDate(selectedCourseData.enrolled_at)}
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Chapters List */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>{isTeacherManager ? 'Manage Chapters' : 'Course Chapters'}</CardTitle>
                  <CardDescription>
                    {chapters.length} chapters • {selectedCourseData.chapters} total lessons
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {chapters.map((chapter) => (
                    <Card key={chapter.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {chapter.completed ? (
                                <Badge className="bg-green-600">Completed</Badge>
                              ) : chapter.isLocked ? (
                                <Badge variant="secondary">
                                  <Lock className="h-3 w-3 mr-1" />
                                  Locked
                                </Badge>
                              ) : (
                                <Badge variant="outline">In Progress</Badge>
                              )}
                            </div>
                            <CardTitle className="text-lg">{chapter.title}</CardTitle>
                            <CardDescription className="flex items-center gap-4 mt-2">
                              <span className="flex items-center gap-1">
                                <Play className="h-4 w-4" />
                                {chapter.lessons} lessons
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {chapter.duration}
                              </span>
                            </CardDescription>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            disabled={!isTeacherManager && chapter.isLocked}
                          >
                            {isTeacherManager ? 'Manage' : <ChevronRight className="h-4 w-4" />}
                          </Button>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}

                  {isTeacherManager && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Chapter
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New Chapter</DialogTitle>
                          <DialogDescription>
                            Add a new chapter to this course
                          </DialogDescription>
                        </DialogHeader>
                        <AddChapterForm />
                      </DialogContent>
                    </Dialog>
                  )}
                </CardContent>
              </Card>

              {isTeacherManager && (
                <div className="grid grid-cols-1 gap-6 mt-6 xl:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ClipboardCheck className="h-5 w-5" />
                        Assignment Review Queue
                      </CardTitle>
                      <CardDescription>Review submissions and give feedback to students</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {selectedCourseAssignments.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No pending submissions for this course.</p>
                      ) : (
                        selectedCourseAssignments.map((item) => (
                          <div key={item.id} className="rounded-lg border p-3">
                            <p className="font-medium text-sm">{item.assignment}</p>
                            <p className="text-xs text-muted-foreground mt-1">{item.student} • {item.submittedAt}</p>
                            <div className="mt-3 flex gap-2">
                              <Button size="sm" variant="outline">Review</Button>
                              <Button size="sm">Give Feedback</Button>
                            </div>
                          </div>
                        ))
                      )}
                      <Button variant="outline" className="w-full" onClick={() => navigate('/student/assignments')}>
                        Open Assignments Page
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        Course Feedback
                      </CardTitle>
                      <CardDescription>Review student feedback about this course</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {selectedCourseFeedback.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No new feedback for this course.</p>
                      ) : (
                        selectedCourseFeedback.map((item) => (
                          <div key={item.id} className="rounded-lg border p-3">
                            <p className="text-sm">{item.comment}</p>
                            <p className="mt-2 text-xs text-muted-foreground">{item.student} • {item.time}</p>
                            <Button size="sm" variant="outline" className="mt-3">Reply</Button>
                          </div>
                        ))
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        // Courses Grid with Tabs and Search
        <>
          {/* Tabs and Controls */}
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between mb-6">
            <div className="flex gap-2 border-b border-slate-200 md:border-b-0">
              <button
                className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                  activeTab === 'enrolled'
                    ? 'text-amber-600 border-b-2 border-amber-500'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
                onClick={() => setActiveTab('enrolled')}
              >
                My Enrolled Courses
                {enrolledCourses.length > 0 && (
                  <Badge className="ml-2 bg-amber-500 text-white text-xs">
                    {enrolledCourses.length}
                  </Badge>
                )}
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                  activeTab === 'available'
                    ? 'text-amber-600 border-b-2 border-amber-500'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
                onClick={() => setActiveTab('available')}
              >
                Available Courses
                {availableCourses.length > 0 && (
                  <Badge className="ml-2 bg-blue-500 text-white text-xs">
                    {availableCourses.length}
                  </Badge>
                )}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 border-slate-200 focus-visible:ring-amber-500/30 bg-white"
                />
              </div>
              <div className="flex bg-white border border-slate-200 rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  className={viewMode === 'grid' ? 'bg-amber-500 text-white' : ''}
                  onClick={() => setViewMode('grid')}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  className={viewMode === 'list' ? 'bg-amber-500 text-white' : ''}
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Course Grid */}
          {isTeacherManager && !isAdminView && (
            <div className="flex justify-end mb-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Submit Course for Approval
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Course</DialogTitle>
                    <DialogDescription>Create a course draft for admin review and approval</DialogDescription>
                  </DialogHeader>
                  <CreateCourseForm />
                </DialogContent>
              </Dialog>
            </div>
          )}

          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-3'
          }>
            {(activeTab === 'enrolled' ? filteredEnrolled : filteredAvailable).length === 0 ? (
              <div className="col-span-full">
                <Card className="border-dashed border-2 border-slate-200 bg-slate-50/30">
                  <CardContent className="text-center py-16">
                    {activeTab === 'enrolled' ? (
                      <>
                        <GraduationCap className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-slate-600 mb-2">No enrolled courses yet</h3>
                        <p className="text-sm text-slate-400">Browse available courses and start learning today!</p>
                        <Button 
                          className="mt-4 bg-amber-500 hover:bg-amber-600 text-white"
                          onClick={() => setActiveTab('available')}
                        >
                          Browse Courses
                        </Button>
                      </>
                    ) : (
                      <>
                        <BookOpen className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-slate-600 mb-2">No courses available</h3>
                        <p className="text-sm text-slate-400">Check back later for new courses</p>
                        <Button 
                          variant="outline" 
                          className="mt-4"
                          onClick={loadCourses}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Refresh
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : viewMode === 'grid' ? (
              (activeTab === 'enrolled' ? filteredEnrolled : filteredAvailable).map((course) => (
                <Card 
                  key={course.id} 
                  className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden group"
                  onClick={() => setSelectedCourse(course.id)}
                >
                  <CardHeader className="p-0 relative">
                    <img 
                      src={course.thumbnail || course.image_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop'}
                      alt={course.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop';
                      }}
                    />
                    {enrolledCourseIds.includes(course.id) && (
                      <Badge className="absolute top-2 right-2 bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Enrolled
                      </Badge>
                    )}
                    <div className="absolute top-2 left-2">
                      <Badge className={getLevelColor(course.level || 'beginner')}>
                        {course.level || 'Beginner'}
                      </Badge>
                    </div>
                    {enrolledCourseIds.includes(course.id) && course.progress > 0 && course.progress < 100 && (
                      <div className="absolute bottom-0 left-0 right-0">
                        <Progress value={course.progress} className="h-1 rounded-none bg-slate-200/50" />
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-bold text-lg mb-1 group-hover:text-amber-600 transition-colors line-clamp-1">
                          {course.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {course.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        {course.category && (
                          <Badge variant="outline" className="text-xs border-slate-200 text-slate-600">
                            {course.category}
                          </Badge>
                        )}
                        {course.rating && course.rating > 0 && (
                          <Badge variant="outline" className="text-xs border-amber-200 text-amber-600">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400 mr-1" />
                            {course.rating.toFixed(1)}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {course.students}
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          {course.chapters} chapters
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {course.duration}
                        </span>
                      </div>

                      <div className="text-sm text-muted-foreground">
                        By {course.teacher}
                      </div>

                      {enrolledCourseIds.includes(course.id) && course.progress > 0 && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium text-amber-600">{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className={`h-1.5 ${getProgressColor(course.progress)}`} />
                        </div>
                      )}

                      <Button 
                        className={`w-full ${
                          enrolledCourseIds.includes(course.id)
                            ? 'bg-amber-500 hover:bg-amber-600 text-white'
                            : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                        }`}
                        onClick={(event) => {
                          event.stopPropagation();
                          if (enrolledCourseIds.includes(course.id)) {
                            setSelectedCourse(course.id);
                          } else {
                            handleEnroll(course.id);
                          }
                        }} 
                        disabled={isEnrolling}
                      >
                        {enrolledCourseIds.includes(course.id) ? (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Continue Learning
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-2" />
                            Enroll Now
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              // List View
              <div className="space-y-2">
                {(activeTab === 'enrolled' ? filteredEnrolled : filteredAvailable).map((course) => (
                  <Card 
                    key={course.id}
                    className="hover:shadow-md transition-shadow cursor-pointer hover:border-amber-200"
                    onClick={() => setSelectedCourse(course.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <img 
                          src={course.thumbnail || course.image_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop'}
                          alt={course.title}
                          className="w-24 h-16 object-cover rounded-lg flex-shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-medium text-slate-800 truncate">{course.title}</h3>
                            {enrolledCourseIds.includes(course.id) && (
                              <Badge className="bg-emerald-500 text-white text-xs">
                                Enrolled
                              </Badge>
                            )}
                            <Badge className={getLevelColor(course.level || 'beginner')}>
                              {course.level || 'Beginner'}
                            </Badge>
                            {course.rating && course.rating > 0 && (
                              <Badge variant="outline" className="text-xs border-amber-200 text-amber-600">
                                <Star className="h-3 w-3 fill-amber-400 text-amber-400 mr-1" />
                                {course.rating.toFixed(1)}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-500 truncate">{course.description}</p>
                          <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
                            <span>{course.teacher}</span>
                            <span>•</span>
                            <span>{course.chapters} chapters</span>
                            <span>•</span>
                            <span>{course.duration}</span>
                            <span>•</span>
                            <span>{course.students} students</span>
                          </div>
                          {enrolledCourseIds.includes(course.id) && course.progress > 0 && (
                            <div className="flex items-center gap-2 mt-1">
                              <Progress value={course.progress} className="h-1 flex-1" />
                              <span className="text-xs font-medium text-amber-600">{course.progress}%</span>
                            </div>
                          )}
                        </div>
                        <Button 
                          size="sm"
                          className={enrolledCourseIds.includes(course.id) ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-500 hover:bg-emerald-600'}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (enrolledCourseIds.includes(course.id)) {
                              setSelectedCourse(course.id);
                            } else {
                              handleEnroll(course.id);
                            }
                          }}
                          disabled={isEnrolling}
                        >
                          {enrolledCourseIds.includes(course.id) ? 'Continue' : 'Enroll'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </SidebarLayout>
  );
}

function CreateCourseForm() {
  return (
    <form className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Course Title</Label>
        <Input id="title" placeholder="Enter course title" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          placeholder="Describe the course content and objectives..." 
          rows={4}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="duration">Duration</Label>
          <Input id="duration" placeholder="e.g., 8 weeks" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price (Birr)</Label>
          <Input id="price" type="number" placeholder="0" defaultValue="0" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="thumbnail">Thumbnail URL</Label>
        <Input id="thumbnail" placeholder="https://example.com/image.jpg" />
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline">Cancel</Button>
        <Button type="submit">Create Course</Button>
      </div>
    </form>
  );
}

function AddChapterForm() {
  return (
    <form className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="chapter_title">Chapter Title</Label>
        <Input id="chapter_title" placeholder="Enter chapter title" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="chapter_content">Chapter Content</Label>
        <Textarea 
          id="chapter_content" 
          placeholder="Enter chapter description and content..." 
          rows={6}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="order">Order Number</Label>
          <Input id="order" type="number" placeholder="1" defaultValue="1" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="locked">Status</Label>
          <select id="locked" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="unlocked">Unlocked</option>
            <option value="locked">Locked</option>
          </select>
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline">Cancel</Button>
        <Button type="submit">Add Chapter</Button>
      </div>
    </form>
  );
}