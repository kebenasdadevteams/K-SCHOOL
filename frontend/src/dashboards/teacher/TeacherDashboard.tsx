import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { SidebarLayout } from '../components/SidebarLayout';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import ManageCourses from './ManageCourses';
import Messages from './Messages';
import Notifications from './Notifications';
import Profile from './Profile';
import TeacherSettings from './Settings';
import { 
  BookOpen, 
  Users, 
  FileText, 
  ChevronRight,
  BarChart3,
  Clock,
  CheckCircle2,
  TrendingUp,
  Award,
  Calendar,
  Headphones,
  BookMarked,
  ListTodo,
  Settings,
  PanelTop,
  LayoutDashboard,
  UserPlus
} from 'lucide-react';

// UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { Badge } from '../../components/ui/badge';

// Teacher-specific data based on the images
const teacherStats = {
  totalStudents: 45,
  activeCourses: 3,
  pendingReviews: 12,
  completionRate: 78,
};

const myCourses = [
  {
    id: 1,
    title: 'Introduction to Biblical Studies',
    chapters: 12,
    enrolledStudents: 22,
    progress: 65,
  },
  {
    id: 2,
    title: 'Amharic Bible Study',
    chapters: 10,
    enrolledStudents: 27,
    progress: 40,
  },
  {
    id: 3,
    title: 'Christian Leadership Principles',
    chapters: 8,
    enrolledStudents: 26,
    progress: 20,
  },
];

const pendingAssignments = [
  {
    id: 1,
    title: 'Chapter 4 Assignment: Old Testament Analysis',
    course: 'Biblical Studies',
    submissions: 8,
  },
  {
    id: 2,
    title: 'Leadership Essay Submission',
    course: 'Christian Leadership',
    submissions: 9,
  },
];

// Teacher Overview Component
const TeacherOverview: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

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
            <div className="text-3xl font-bold">{teacherStats.totalStudents}</div>
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
            <div className="text-3xl font-bold">{teacherStats.activeCourses}</div>
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
            <div className="text-3xl font-bold">{teacherStats.pendingReviews}</div>
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
            <div className="text-3xl font-bold">{teacherStats.completionRate}%</div>
            <Progress value={teacherStats.completionRate} className="mt-2" />
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
            {myCourses.map((course) => (
              <div 
                key={course.id} 
                className="p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer"
                onClick={() => navigate(`/teacher/courses/${course.id}`)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold">{course.title}</h4>
                  <Badge variant="secondary">{course.chapters} chapters</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {course.enrolledStudents} enrolled students
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
            ))}
          </CardContent>
        </Card>

        {/* Pending Assignments Section */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Assignments</CardTitle>
            <CardDescription>Assignments waiting for review</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingAssignments.map((assignment) => (
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
            {[
              { student: 'Abebe Kebede', action: 'submitted assignment', course: 'Old Testament Analysis', time: '2 hours ago' },
              { student: 'Tigist Alemayehu', action: 'completed course', course: 'Biblical Studies', time: '5 hours ago' },
              { student: 'Dawit Tesfaye', action: 'enrolled in', course: 'Christian Leadership', time: '1 day ago' },
            ].map((activity, index) => (
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
                      {activity.student} <span className="font-normal text-muted-foreground">{activity.action}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.course}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
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
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/courses')
      .then(r => setCourses(r.data.data || []))
      .catch(() => {});
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
        {myCourses.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{course.title}</CardTitle>
              <CardDescription>{course.chapters} chapters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Students</span>
                  <span className="font-medium">{course.enrolledStudents}</span>
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
  
  // Mock student data
  const students = [
    { id: 1, name: 'Abebe Kebede', email: 'abebe@example.com', courses: 2, progress: 78 },
    { id: 2, name: 'Tigist Alemayehu', email: 'tigist@example.com', courses: 3, progress: 92 },
    { id: 3, name: 'Dawit Tesfaye', email: 'dawit@example.com', courses: 1, progress: 45 },
    { id: 4, name: 'Meron Hailu', email: 'meron@example.com', courses: 2, progress: 63 },
  ];

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

// Assignments Management Component
const AssignmentsManagement: React.FC = () => {
  const navigate = useNavigate();
  
  const assignments = [
    { id: 1, title: 'Chapter 4 Assignment: Old Testament Analysis', course: 'Biblical Studies', submissions: 8, dueDate: 'Feb 18, 2026' },
    { id: 2, title: 'Leadership Essay Submission', course: 'Christian Leadership', submissions: 9, dueDate: 'Feb 20, 2026' },
    { id: 3, title: 'Amharic Bible Study Reflection', course: 'Amharic Bible Study', submissions: 5, dueDate: 'Feb 22, 2026' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Assignments</h1>
          <p className="text-muted-foreground">Manage and review student assignments</p>
        </div>
        <Button>
          <FileText className="h-4 w-4 mr-2" />
          Create Assignment
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {assignments.map((assignment) => (
          <Card key={assignment.id}>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold">{assignment.title}</h4>
                  <p className="text-sm text-muted-foreground">{assignment.course}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <Badge variant="secondary">{assignment.submissions} submissions</Badge>
                    <span className="text-xs text-muted-foreground">Due: {assignment.dueDate}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => navigate(`/teacher/submissions/${assignment.id}`)}>
                    Review Submissions
                  </Button>
                  <Button size="sm" variant="ghost">
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Submissions Review Component
const SubmissionsReview: React.FC = () => {
  const navigate = useNavigate();
  
  const submissions = [
    { id: 1, student: 'Abebe Kebede', assignment: 'Chapter 4 Assignment: Old Testament Analysis', course: 'Biblical Studies', submitted: 'Today, 8:15 AM', status: 'pending' },
    { id: 2, student: 'Tigist Alemayehu', assignment: 'Leadership Essay Submission', course: 'Christian Leadership', submitted: 'Today, 10:30 AM', status: 'graded' },
    { id: 3, student: 'Dawit Tesfaye', assignment: 'Amharic Bible Study Reflection', course: 'Amharic Bible Study', submitted: 'Today, 11:05 AM', status: 'pending' },
  ];

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
  const navigate = useNavigate();

  return (
    <SidebarLayout
      userRole="teacher"
      userName={user?.full_name || 'Teacher'}
      userEmail={user?.email || 'teacher@church.com'}
    >
      <Routes>
        <Route index element={<TeacherOverview />} />
        <Route path="courses" element={<CoursesManagement />} />
        <Route path="courses/:id" element={<div className="space-y-4"><h1 className="text-2xl font-bold">Course Details</h1><div className="card"><p>Course management page</p></div></div>} />
        <Route path="courses/:id/manage" element={<div className="space-y-4"><h1 className="text-2xl font-bold">Manage Course</h1><div className="card"><p>Course management tools</p></div></div>} />
        <Route path="courses/new" element={<div className="space-y-4"><h1 className="text-2xl font-bold">Create Course</h1><div className="card"><p>Course creation form</p></div></div>} />
        <Route path="lessons" element={<div className="space-y-4"><h1 className="text-2xl font-bold">Lessons</h1><div className="card"><p className="text-muted-foreground mb-4">Select a course to manage its lessons.</p></div></div>} />
        <Route path="assignments" element={<AssignmentsManagement />} />
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