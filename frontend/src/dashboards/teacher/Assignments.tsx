import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { teacherService } from '../../services/teacher-service';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { 
  FileText, 
  AlertCircle, 
  Upload, 
  CheckCircle2, 
  Calendar, 
  Users, 
  Award,
  Plus
} from 'lucide-react';

type AssignmentStatus = 'received' | 'inReview' | 'graded';

type TeacherAssignment = {
  id: number | string;
  title: string;
  description: string;
  course: string;
  chapter?: string;
  dueDate?: string;
  status: AssignmentStatus;
  submissions: number;
  grade?: string | null;
  studentName?: string;
  submittedAt?: string | null;
  feedback?: string | null;
};

const Assignments: React.FC = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState<TeacherAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'received' | 'inReview' | 'graded'>('received');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAssignment, setNewAssignment] = useState({ 
    title: '', 
    course: '', 
    description: '', 
    dueDate: '' 
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadAssignments = async () => {
      try {
        setLoading(true);
        const { data } = await teacherService.getAssignments();
        if (!mounted) return;
        
        const mapped = (data.data || []).map((assignment: any, index: number) => ({
          id: assignment.id ?? `assignment-${index}`,
          title: assignment.title || assignment.name || 'Untitled Assignment',
          description: assignment.description || assignment.details || 'No description provided.',
          course: assignment.course || assignment.course_name || 'General',
          chapter: assignment.chapter || undefined,
          dueDate: assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : undefined,
          status: assignment.status === 'graded' ? 'graded' : 
                  assignment.status === 'submitted' || assignment.status === 'inReview' ? 'inReview' : 'received',
          submissions: assignment.submissions || 0,
          grade: assignment.grade || null,
          studentName: assignment.student_name || undefined,
          submittedAt: assignment.submitted_at ? new Date(assignment.submitted_at).toLocaleDateString() : undefined,
          feedback: assignment.feedback || null,
        }));
        
        setAssignments(mapped.length ? mapped : getMockAssignments());
      } catch (error) {
        console.error('Failed to fetch assignments', error);
        // Load mock data if API fails
        setAssignments(getMockAssignments());
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadAssignments();
    return () => {
      mounted = false;
    };
  }, []);

  const getMockAssignments = (): TeacherAssignment[] => {
    return [
      {
        id: 'received-1',
        title: 'Chapter 4 Assignment: Old Testament Analysis',
        description: 'Write a 500-word essay analyzing the key themes in the Pentateuch and their relevance to modern Christian life.',
        course: 'Introduction to Biblical Studies',
        chapter: 'Chapter 4',
        dueDate: 'Feb 18, 2026',
        status: 'received',
        submissions: 3,
        grade: null,
        studentName: undefined,
      },
      {
        id: 'review-1',
        title: 'Leadership Essay Submission',
        description: 'Reflect on a biblical leader and explain how their example demonstrates servant leadership principles.',
        course: 'Christian Leadership Principles',
        chapter: 'Chapter 2',
        dueDate: 'Feb 20, 2026',
        status: 'inReview',
        submissions: 1,
        grade: null,
        studentName: 'Tigist Alemayehu',
        submittedAt: 'Feb 15, 2026',
      },
      {
        id: 'graded-1',
        title: 'New Testament Overview Assignment',
        description: 'Compare and contrast the four Gospel accounts, highlighting unique perspectives each author brings.',
        course: 'New Testament Deep Dive',
        chapter: 'Chapter 1',
        dueDate: 'Feb 22, 2026',
        status: 'graded',
        submissions: 1,
        grade: 'A-',
        studentName: 'Abebe Kebede',
        submittedAt: 'Feb 14, 2026',
        feedback: 'Well researched! Your comparison of the synoptic gospels was particularly strong.',
      },
    ];
  };

  const sectionAssignments = assignments.filter((assignment) => {
    if (activeTab === 'received') return assignment.status === 'received';
    if (activeTab === 'inReview') return assignment.status === 'inReview';
    return assignment.status === 'graded';
  });

  const stats = {
    received: assignments.filter((assignment) => assignment.status === 'received').length,
    inReview: assignments.filter((assignment) => assignment.status === 'inReview').length,
    graded: assignments.filter((assignment) => assignment.status === 'graded').length,
  };

  const handleCreateAssignment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newAssignment.title.trim() || !newAssignment.course.trim()) return;

    setSaving(true);

    try {
      // In a real app, you'd call an API here
      // await teacherService.createAssignment(newAssignment);
      
      const createdAssignment: TeacherAssignment = {
        id: Date.now(),
        title: newAssignment.title.trim(),
        description: newAssignment.description.trim() || 'No description provided.',
        course: newAssignment.course.trim(),
        chapter: 'New Assignment',
        dueDate: newAssignment.dueDate || new Date().toLocaleDateString(),
        status: 'received',
        submissions: 0,
        grade: null,
      };

      setAssignments((current) => [createdAssignment, ...current]);
      setNewAssignment({ title: '', course: '', description: '', dueDate: '' });
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Failed to create assignment', error);
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadgeClass = (status: AssignmentStatus) => {
    if (status === 'received') return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800';
    if (status === 'inReview') return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800';
    return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
  };

  const getStatusIcon = (status: AssignmentStatus) => {
    if (status === 'received') return <AlertCircle className="h-3.5 w-3.5" />;
    if (status === 'inReview') return <Upload className="h-3.5 w-3.5" />;
    return <CheckCircle2 className="h-3.5 w-3.5" />;
  };

  const getStatusLabel = (status: AssignmentStatus) => {
    if (status === 'received') return 'Received';
    if (status === 'inReview') return 'In Review';
    return 'Graded';
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-lg text-muted-foreground">
        Loading assignments…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Assignments</h1>
          <p className="text-muted-foreground">
            Organize received, in-review, and graded assignments.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="inline-flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Assignment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>Create New Assignment</DialogTitle>
              <DialogDescription>
                Fill in the assignment details to add a new task for students.
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleCreateAssignment}>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="assignment-title">Title *</Label>
                  <Input
                    id="assignment-title"
                    value={newAssignment.title}
                    onChange={(event) => setNewAssignment((current) => ({ ...current, title: event.target.value }))}
                    placeholder="Enter assignment title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assignment-course">Course *</Label>
                  <Input
                    id="assignment-course"
                    value={newAssignment.course}
                    onChange={(event) => setNewAssignment((current) => ({ ...current, course: event.target.value }))}
                    placeholder="Enter course name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assignment-description">Description</Label>
                  <Textarea
                    id="assignment-description"
                    value={newAssignment.description}
                    onChange={(event) => setNewAssignment((current) => ({ ...current, description: event.target.value }))}
                    placeholder="Add a short assignment description"
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assignment-due-date">Due date</Label>
                  <Input
                    id="assignment-due-date"
                    type="date"
                    value={newAssignment.dueDate}
                    onChange={(event) => setNewAssignment((current) => ({ ...current, dueDate: event.target.value }))}
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? 'Saving…' : 'Add Assignment'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Button
          variant={activeTab === 'received' ? 'secondary' : 'ghost'}
          className="w-full"
          onClick={() => setActiveTab('received')}
        >
          Received ({stats.received})
        </Button>
        <Button
          variant={activeTab === 'inReview' ? 'secondary' : 'ghost'}
          className="w-full"
          onClick={() => setActiveTab('inReview')}
        >
          In Review ({stats.inReview})
        </Button>
        <Button
          variant={activeTab === 'graded' ? 'secondary' : 'ghost'}
          className="w-full"
          onClick={() => setActiveTab('graded')}
        >
          Graded ({stats.graded})
        </Button>
      </div>

      <div className="space-y-4">
        {sectionAssignments.length === 0 ? (
          <Card className="border-dashed border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No assignments found in this section</p>
              <p className="text-sm text-muted-foreground">
                Create a new assignment to get started.
              </p>
            </CardContent>
          </Card>
        ) : (
          sectionAssignments.map((assignment) => (
            <Card key={assignment.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-lg">{assignment.title}</CardTitle>
                  <CardDescription>{assignment.course}</CardDescription>
                </div>
                <div className={getStatusBadgeClass(assignment.status) + ' inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold whitespace-nowrap'}>
                  {getStatusIcon(assignment.status)}
                  {getStatusLabel(assignment.status)}
                </div>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-[1.5fr_0.9fr]">
                <div className="space-y-3">
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {assignment.description}
                  </p>
                  <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                    {assignment.dueDate && (
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-4 w-4" /> Due: {assignment.dueDate}
                      </span>
                    )}
                    {assignment.studentName && (
                      <span className="inline-flex items-center gap-1">
                        <Users className="h-4 w-4" /> {assignment.studentName}
                      </span>
                    )}
                    {assignment.grade && (
                      <span className="inline-flex items-center gap-1">
                        <Award className="h-4 w-4" /> Grade: {assignment.grade}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2 justify-between">
                  <div className="grid gap-2">
                    <Badge className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                      {assignment.submissions} submissions
                    </Badge>
                    {assignment.submittedAt && (
                      <Badge className="bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800">
                        Submitted: {assignment.submittedAt}
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 justify-end">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => navigate(`/teacher/submissions/${assignment.id}`)}
                    >
                      Review
                    </Button>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Assignments;