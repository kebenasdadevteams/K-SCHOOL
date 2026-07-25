import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import api from '../../services/api';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Progress } from '../../components/ui/progress';
import { ArrowLeft, Plus, BookOpen, Users, Clock, ChevronRight, Lock, Play, MessageSquare, ClipboardCheck } from 'lucide-react';

export default function Courses() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [courseError, setCourseError] = useState('');

  // Get user info from navigation state, or use defaults
  const locationState = location.state as { role?: string; userName?: string; userEmail?: string; view?: 'student' | 'teacher' | 'pastor' | 'editor' | 'admin' | 'developer' } | null;
  const [user] = useState({
    full_name: locationState?.userName || 'Demo User',
    email: locationState?.userEmail || 'demo@church.com'
  });
  const [role] = useState(locationState?.role || 'admin');
  const [activeView, setActiveView] = useState<'student' | 'teacher' | 'pastor' | 'editor' | 'admin' | 'developer'>(
    locationState?.view ?? (locationState?.role === 'teacher' ? 'teacher' : locationState?.role === 'pastor' ? 'pastor' : locationState?.role === 'editor' ? 'editor' : locationState?.role === 'admin' ? 'admin' : 'admin')
  );
  const isStudentView = activeView === 'student';
  const isTeacherManager = role === 'teacher' && activeView === 'teacher';
  const isAdminView = role === 'admin' && activeView === 'admin';

  useEffect(() => {
    if (!isStudentView && !isAdminView && !isTeacherManager) {
      navigate('/dashboard', {
        replace: true,
        state: {
          ...((location.state as Record<string, unknown>) || {}),
          role,
          view: 'student',
        },
      });
    }
  }, [isStudentView, isAdminView, isTeacherManager, location.state, navigate, role]);

  useEffect(() => {
    const loadCourses = async () => {
      setLoadingCourses(true);
      setCourseError('');
      try {
        const { data } = await api.get('/courses');
        const courseRows = data.data || [];
        setCourses(courseRows.map((course: any) => ({
          id: course.id,
          title: course.title || 'Untitled Course',
          description: course.description || 'No description available.',
          teacher: course.teacher_name || 'Unknown',
          thumbnail: course.image_url || course.imageUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
          students: course.enrollment_count || 0,
          chapters: Array.isArray(course.sections) ? course.sections.length : 0,
          duration: course.duration || 'TBD',
          progress: 0,
          status: course.status || 'draft',
          category: course.category || 'General',
          created_at: course.created_at,
        })));
      } catch (error) {
        console.error('Unable to load courses', error);
        setCourseError('Unable to load courses from the server. Showing fallback data.');
      } finally {
        setLoadingCourses(false);
      }
    };
    loadCourses();
  }, []);

  const pendingCourseApprovals = courses
    .filter((course) => course.status === 'submitted')
    .map((course) => ({
      id: course.id,
      title: course.title,
      teacher: course.teacher,
      submittedAt: course.created_at ? new Date(course.created_at).toLocaleDateString() : 'Pending',
    }));

  const approveCourse = async (courseId: number) => {
    try {
      await api.put(`/courses/${courseId}`, { status: 'published' });
      setCourses((current) => current.map((course) =>
        course.id === courseId ? { ...course, status: 'published' } : course
      ));
    } catch (error) {
      console.error('Unable to approve course', error);
    }
  };  

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

  const selectedCourseData = courses.find((course) => course.id === selectedCourse) || courses[0] || {
    id: 0,
    title: 'No course available',
    description: 'No course data was found.',
    teacher: 'Unknown',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    students: 0,
    chapters: 0,
    duration: 'TBD',
    progress: 0,
  };
  const selectedCourseAssignments = teacherAssignmentQueue.filter((item) => item.courseId === selectedCourseData.id);
  const selectedCourseFeedback = teacherCourseFeedback.filter((item) => item.courseId === selectedCourseData.id);

  return (
    <>
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
            <CardTitle className="text-3xl">4</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{isTeacherManager ? 'Total Students' : 'Enrolled Courses'}</CardDescription>
            <CardTitle className="text-3xl">{isTeacherManager ? '172' : '3'}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{isAdminView ? 'Courses Awaiting Approval' : isTeacherManager ? 'Pending Assignment Reviews' : 'Active Lessons'}</CardDescription>
            <CardTitle className="text-3xl">{isAdminView ? String(pendingCourseApprovals.length) : isTeacherManager ? String(teacherAssignmentQueue.length) : '12'}</CardTitle>
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
                    src={selectedCourseData.thumbnail} 
                    alt={selectedCourseData.title}
                    className="w-full h-40 object-cover rounded-lg mb-4"
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
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium">{selectedCourseData.duration}</span>
                  </div>
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
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{selectedCourseData.progress}%</span>
                        </div>
                        <Progress value={selectedCourseData.progress} />
                      </div>
                      <Button className="w-full">
                        Continue Learning
                      </Button>
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
                      <Button variant="outline" className="w-full" onClick={() => navigate('/assignments')}>
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
        // Courses Grid
        <div className="space-y-4">
          {isTeacherManager && !isAdminView && (
            <div className="flex justify-end">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card 
                key={course.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedCourse(course.id)}
              >
              <CardHeader className="p-0">
                <img 
                  src={course.thumbnail} 
                  alt={course.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-bold text-lg mb-2">{course.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {course.description}
                    </p>
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

                  {!isTeacherManager && course.progress > 0 && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} />
                    </div>
                  )}

                  <Button className="w-full">
                    {isTeacherManager ? 'Manage Course' : course.progress > 0 ? 'Continue' : 'Start Course'}
                  </Button>
                </div>
              </CardContent>
            </Card>
            ))}
          </div>
        </div>
      )}
    </>
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