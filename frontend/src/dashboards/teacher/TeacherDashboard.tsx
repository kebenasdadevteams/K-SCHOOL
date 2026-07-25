import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { SidebarLayout } from '../components/SidebarLayout';
import api from '../../services/api';
import { teacherService } from '../../services/teacher-service';
import { useAuth } from '../../contexts/AuthContext';
import ManageCourses from './ManageCourses';
import Assignments from './Assignments';
import Messages from './Messages';
import Notifications from './Notifications';
import Profile from './Profile';
import TeacherSettings from './Settings';
import { 
  BookOpen, 
  Users, 
  FileText, 
  ChevronRight,
  TrendingUp,
  Calendar,
  UserPlus
} from 'lucide-react';

// UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { Badge } from '../../components/ui/badge';

// Teacher-specific data based on the images
const teacherStatsInitial = {
  totalStudents: 0,
  activeCourses: 0,
  pendingReviews: 0,
  completionRate: 0,
};

const pendingAssignmentsInitial: Array<{ id: number; title: string; course: string; submissions: number; dueDate?: string }> = [];
const activityInitial: Array<{ student: string; action: string; course: string; time: string }> = [];

// Teacher Overview Component
const TeacherOverview: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(teacherStatsInitial);
  const [courses, setCourses] = useState<any[]>([]);
  const [pendingAssignments, setPendingAssignments] = useState<any[]>(pendingAssignmentsInitial);
  const [activity, setActivity] = useState(activityInitial);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const loadOverview = async () => {
      try {
        setLoading(true);
        const [statsResp, coursesResp, assignmentsResp, submissionsResp] = await Promise.all([
          teacherService.getStats(),
          api.get('/courses'),
          teacherService.getAssignments(),
          teacherService.getSubmissions(),
        ]);

        if (!mounted) return;

        setStats(statsResp.data.data || teacherStatsInitial);
        setCourses(coursesResp.data.data || []);
        setPendingAssignments((assignmentsResp.data.data || []).slice(0, 3).map((assignment: any) => ({
          ...assignment,
          dueDate: assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : undefined,
        })));
        setActivity((submissionsResp.data.data || []).slice(0, 3).map((submission: any) => ({
          student: submission.student_name,
          action: submission.status === 'pending' ? 'submitted assignment' : 'received grade',
          course: submission.course,
          time: submission.submittedAt ? new Date(submission.submittedAt).toLocaleTimeString() : 'just now',
        })));
      } catch (error) {
        console.error('Failed to load teacher overview', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadOverview();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.full_name || 'Teacher'}! 🎉
        </h1>
        <p className="text-muted-foreground">
          Manage courses and track student progress
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Total Students</CardDescription>
              <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900/20">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Active Courses</CardDescription>
              <div className="p-2 bg-purple-100 rounded-lg dark:bg-purple-900/20">
                <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.activeCourses}</div>
            <p className="text-xs text-muted-foreground mt-1">Currently teaching</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Pending Reviews</CardDescription>
              <div className="p-2 bg-orange-100 rounded-lg dark:bg-orange-900/20">
                <FileText className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.pendingReviews}</div>
            <p className="text-xs text-muted-foreground mt-1">Assignments to grade</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Completion Rate</CardDescription>
              <div className="p-2 bg-green-100 rounded-lg dark:bg-green-900/20">
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.completionRate}%</div>
            <Progress value={stats.completionRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Courses Section */}
        <Card>
          <CardHeader>
            <CardTitle>Courses</CardTitle>
            <CardDescription>Courses you manage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {(courses.length > 0 ? courses : []).map((course: any) => {
              const chapterCount = course.sections?.reduce((sum: number, section: any) => sum + (section.chapters?.length || 0), 0) || course.lessons?.length || 0;
              return (
                <div 
                  key={course.id} 
                  className="p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer"
                  onClick={() => navigate(`/teacher/courses/${course.id}`)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold">{course.title}</h4>
                    <Badge variant="secondary">{chapterCount} chapters</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {course.students || 0} enrolled students
                  </p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/teacher/courses/${course.id}/manage`);
                    }}
                  >
                    Manage Course
                  </Button>
                </div>
              );
            })}
            {courses.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No courses yet</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => navigate('/teacher/courses/new')}
                >
                  Create Your First Course
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending Assignments Section */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Assignments</CardTitle>
            <CardDescription>Assignments waiting for review</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingAssignments.map((assignment: any) => (
              <div key={assignment.id} className="p-3 bg-muted rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h5 className="font-medium text-sm">{assignment.title}</h5>
                    <p className="text-xs text-muted-foreground mt-1">
                      {assignment.course}
                    </p>
                  </div>
                  <Badge variant="secondary">{assignment.submissions}</Badge>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full mt-2"
                  onClick={() => navigate('/teacher/assignments')}
                >
                  Review Submissions
                </Button>
              </div>
            ))}
            {pendingAssignments.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No pending assignments</p>
              </div>
            )}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate('/teacher/assignments')}
            >
              View All Assignments
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Section */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest student submissions and course updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activity.length > 0 ? activity.map((activityItem, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between py-3 border-b border-border last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {activityItem.student} <span className="font-normal text-muted-foreground">{activityItem.action}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{activityItem.course}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{activityItem.time}</span>
              </div>
            )) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No recent activity</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Courses Management Component
const CoursesManagement: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const loadCourses = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/courses');
        if (!mounted) return;
        setCourses(data.data || []);
      } catch (error) {
        console.error('Failed to fetch teacher courses', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadCourses();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Courses</h1>
          <p className="text-muted-foreground">Manage your courses and track progress</p>
        </div>
        <Button onClick={() => navigate('/teacher/courses/new')}>
          <BookOpen className="h-4 w-4 mr-2" />
          Create Course
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course: any) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{course.title}</CardTitle>
              <CardDescription>{course.chapters} chapters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Students</span>
                  <span className="font-medium">{course.enrolledStudents ?? course.students ?? 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Progress</span>
                  <span className="font-medium">{course.progress}%</span>
                </div>
                <Progress value={course.progress} />
                <Button 
                  variant="outline" 
                  className="w-full mt-2"
                  onClick={() => navigate(`/teacher/courses/${course.id}`)}
                >
                  Manage Course
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Students Management Component
const StudentsManagement: React.FC = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Array<{ id: number; name: string; email: string; courses: number; progress: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadStudents = async () => {
      try {
        setLoading(true);
        const { data } = await teacherService.getStudents();
        if (!mounted) return;
        setStudents((data.data || []).map((student: any) => ({
          id: student.id,
          name: student.full_name,
          email: student.email,
          courses: student.courses || 0,
          progress: student.progress || 0,
        })));
      } catch (error) {
        console.error('Failed to fetch teacher students', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadStudents();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Students</h1>
          <p className="text-muted-foreground">Manage your class roster</p>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Student
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Student</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Courses</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Progress</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3 font-medium">{student.name}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{student.email}</td>
                    <td className="px-4 py-3">{student.courses}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Progress value={student.progress} className="w-24" />
                        <span className="text-sm font-medium">{student.progress}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Button size="sm" variant="outline" onClick={() => navigate(`/teacher/students/${student.id}`)}>
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Submissions Review Component
const SubmissionsReview: React.FC = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<Array<{
    id: number;
    student: string;
    studentId: number;
    assignment: string;
    course: string;
    submitted: string;
    status: string;
    grade?: number;
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadSubmissions = async () => {
      try {
        setLoading(true);
        const { data } = await teacherService.getSubmissions();
        if (!mounted) return;
        setSubmissions((data.data || []).map((submission: any) => ({
          id: submission.id,
          student: submission.student_name,
          studentId: submission.student_id,
          assignment: submission.assignment_title,
          course: submission.course,
          submitted: submission.submittedAt ? new Date(submission.submittedAt).toLocaleString() : '',
          status: submission.status,
          grade: submission.grade,
        })));
      } catch (error) {
        console.error('Failed to fetch submissions', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadSubmissions();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Submissions</h1>
          <p className="text-muted-foreground">Review and grade student submissions</p>
        </div>
        <Badge variant="secondary">{submissions.filter(s => s.status === 'pending').length} pending</Badge>
      </div>

      <div className="space-y-4">
        {submissions.map((submission) => (
          <Card key={submission.id}>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold">{submission.student}</h4>
                    <Badge variant={submission.status === 'pending' ? 'secondary' : 'default'}>
                      {submission.status}
                    </Badge>
                  </div>
                  <p className="text-sm">{submission.assignment}</p>
                  <p className="text-xs text-muted-foreground">{submission.course} • Submitted {submission.submitted}</p>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => navigate(`/teacher/submissions/${submission.id}/review`)}
                >
                  {submission.status === 'pending' ? 'Review Submission' : 'View Grade'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Main Teacher Dashboard Component
const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <SidebarLayout
      userRole="teacher"
      userName={user?.full_name || 'Teacher'}
      userEmail={user?.email || 'teacher@church.com'}
    >
      <Routes>
        <Route index element={<TeacherOverview />} />
        <Route path="courses" element={<ManageCourses />} />
        <Route path="courses/new" element={<ManageCourses mode="create" />} />
        <Route path="courses/:id" element={<ManageCourses />} />
        <Route path="courses/:id/manage" element={<ManageCourses />} />
        <Route path="lessons" element={<div className="space-y-4"><h1 className="text-2xl font-bold">Lessons</h1><div className="card"><p className="text-muted-foreground mb-4">Select a course to manage its lessons.</p></div></div>} />
        <Route path="assignments" element={<Assignments />} />
        <Route path="submissions" element={<SubmissionsReview />} />
        <Route path="submissions/:id" element={<div className="space-y-4"><h1 className="text-2xl font-bold">Submission Details</h1><div className="card"><p>Review submission</p></div></div>} />
        <Route path="submissions/:id/review" element={<div className="space-y-4"><h1 className="text-2xl font-bold">Review Submission</h1><div className="card"><p>Grade and provide feedback</p></div></div>} />
        <Route path="students" element={<StudentsManagement />} />
        <Route path="students/:id" element={<div className="space-y-4"><h1 className="text-2xl font-bold">Student Profile</h1><div className="card"><p>Student details and progress</p></div></div>} />
        <Route path="messages" element={<Messages />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<TeacherSettings />} />
      </Routes>
    </SidebarLayout>
  );
};

export default TeacherDashboard;