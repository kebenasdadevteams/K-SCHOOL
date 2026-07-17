import { FormEvent, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { SidebarLayout } from '../../SidebarLayout';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Upload, 
  Download,
  Sparkles,
  Zap,
  BookOpen,
  Users,
  TrendingUp,
  Award,
  Star,
  ClipboardCheck,
  Send,
  Eye,
  MessageCircle,
  ThumbsUp,
  Timer,
  PlayCircle
} from 'lucide-react';

export default function Assignments() {
  const location = useLocation();

  // Get user info from navigation state, or use defaults
  const locationState = location.state as { role?: string; userName?: string; userEmail?: string; view?: 'student' | 'teacher' | 'pastor' | 'editor' | 'admin' } | null;
  const [user] = useState({
    full_name: locationState?.userName || 'Demo User',
    email: locationState?.userEmail || 'demo@church.com'
  });
  const [role] = useState(locationState?.role || 'student');
  const [activeView, setActiveView] = useState<'student' | 'teacher' | 'pastor' | 'editor' | 'admin'>(
    locationState?.view ?? (locationState?.role === 'teacher' ? 'teacher' : locationState?.role === 'pastor' ? 'pastor' : locationState?.role === 'editor' ? 'editor' : locationState?.role === 'admin' ? 'admin' : 'student')
  );
  const [filter, setFilter] = useState(role === 'teacher' ? 'submitted' : 'all');
  const [reviewingSubmission, setReviewingSubmission] = useState<any | null>(null);

  const studentAssignments = [
    {
      id: 1,
      title: 'Chapter 4 Assignment: Old Testament Analysis',
      course: 'Introduction to Biblical Studies',
      chapter: 'Chapter 4: The Pentateuch',
      student_name: undefined,
      description: 'Write a 500-word essay analyzing the key themes in the Pentateuch and their relevance to modern Christian life.',
      due_date: '2026-02-18',
      submitted_at: null,
      status: 'pending',
      feedback: null,
      grade: null,
    },
    {
      id: 2,
      title: 'Leadership Essay Submission',
      course: 'Christian Leadership Principles',
      chapter: 'Chapter 2: Servant Leadership',
      student_name: undefined,
      description: 'Reflect on a biblical leader and explain how their example demonstrates servant leadership principles.',
      due_date: '2026-02-20',
      submitted_at: '2026-02-15',
      status: 'submitted',
      feedback: 'Excellent work! Your analysis of Moses\' leadership was insightful.',
      grade: 'A',
    },
    {
      id: 3,
      title: 'የመጽሐፍ ቅዱስ ጥናት - ዘፍጥረት 1-3',
      course: 'Amharic Bible Study',
      chapter: 'Chapter 3: የዘፍጥረት መጽሐፍ',
      student_name: undefined,
      description: 'በዘፍጥረት መጽሐፍ 1-3 ላይ የተመሠረተ ጥናት እና ትንታኔ ያቅርቡ።',
      due_date: '2026-02-19',
      submitted_at: null,
      status: 'pending',
      feedback: null,
      grade: null,
    },
    {
      id: 4,
      title: 'New Testament Overview Assignment',
      course: 'New Testament Deep Dive',
      chapter: 'Chapter 1: Introduction to the Gospels',
      student_name: undefined,
      description: 'Compare and contrast the four Gospel accounts, highlighting unique perspectives each author brings.',
      due_date: '2026-02-22',
      submitted_at: '2026-02-14',
      status: 'graded',
      feedback: 'Well researched! Your comparison of the synoptic gospels was particularly strong.',
      grade: 'A-',
    },
  ];

  const [teacherSubmissions, setTeacherSubmissions] = useState([
    {
      id: 1,
      assignmentId: 1,
      title: 'Chapter 4 Assignment: Old Testament Analysis',
      course: 'Introduction to Biblical Studies',
      chapter: 'Chapter 4: The Pentateuch',
      student_name: 'Abebe Kebede',
      description: 'Write a 500-word essay analyzing the key themes in the Pentateuch and their relevance to modern Christian life.',
      due_date: '2026-02-18',
      submitted_at: '2026-02-16',
      status: 'submitted',
      submission: 'The Pentateuch reveals covenant, law, and the beginning of God\'s redemptive story. This essay explains why those themes still matter for Christian discipleship today.',
      feedback: '',
      grade: '',
    },
    {
      id: 2,
      assignmentId: 2,
      title: 'Leadership Essay Submission',
      course: 'Christian Leadership Principles',
      chapter: 'Chapter 2: Servant Leadership',
      student_name: 'Tigist Alemayehu',
      description: 'Reflect on a biblical leader and explain how their example demonstrates servant leadership principles.',
      due_date: '2026-02-20',
      submitted_at: '2026-02-15',
      status: 'graded',
      submission: 'I focused on Moses as an example of servant leadership because he consistently interceded for the people and obeyed God even when the task was difficult.',
      feedback: 'Good structure. Add one more leadership example next time.',
      grade: 'B+',
    },
    {
      id: 3,
      assignmentId: 3,
      title: 'Amharic Bible Study Reflection',
      course: 'Amharic Bible Study',
      chapter: 'Chapter 3: የዘፍጥረት መጽሐፍ',
      student_name: 'Dawit Tesfaye',
      description: 'በዘፍጥረት መጽሐፍ 1-3 ላይ የተመሠረተ ጥናት እና ትንታኔ ያቅርቡ።',
      due_date: '2026-02-19',
      submitted_at: '2026-02-17',
      status: 'submitted',
      submission: 'ፍጥረት 1-3 የእግዚአብሔር ፍጥረት እና የሰው ኃላፊነት ላይ ግልጽ መልዕክት ይዟል።',
      feedback: '',
      grade: '',
    },
    {
      id: 4,
      assignmentId: 4,
      title: 'New Testament Overview Assignment',
      course: 'New Testament Deep Dive',
      chapter: 'Chapter 1: Introduction to the Gospels',
      student_name: 'Abebe Kebede',
      description: 'Compare and contrast the four Gospel accounts, highlighting unique perspectives each author brings.',
      due_date: '2026-02-22',
      submitted_at: '2026-02-14',
      status: 'graded',
      submission: 'The four Gospels present the same Savior from distinct perspectives. Matthew emphasizes fulfillment, Mark emphasizes action, Luke emphasizes compassion, and John emphasizes divinity.',
      feedback: 'Well researched! Your comparison of the synoptic gospels was particularly strong.',
      grade: 'A-',
    },
  ]);

  const assignments = role === 'teacher' ? teacherSubmissions : studentAssignments;

  const filteredAssignments = assignments.filter(assignment => {
    if (filter === 'all') return true;
    return assignment.status === filter;
  });

  const stats = role === 'teacher'
    ? {
        total: assignments.length,
        pending: assignments.filter(a => a.status === 'submitted').length,
        submitted: assignments.filter(a => a.status === 'graded').length,
        graded: new Set(assignments.map(a => a.student_name)).size,
      }
    : {
        total: assignments.length,
        pending: assignments.filter(a => a.status === 'pending').length,
        submitted: assignments.filter(a => a.status === 'submitted').length,
        graded: assignments.filter(a => a.status === 'graded').length,
      };

  const handleTeacherGradeSave = (submissionId: number, grade: string, feedback: string) => {
    setTeacherSubmissions((current) =>
      current.map((submission) =>
        submission.id === submissionId
          ? {
              ...submission,
              grade,
              feedback,
              status: 'graded',
            }
          : submission
      )
    );
  };

  const downloadSubmission = (submission: { title: string; student_name?: string; submission?: string; description?: string }) => {
    const fileContent = [
      `Assignment: ${submission.title}`,
      submission.student_name ? `Student: ${submission.student_name}` : null,
      submission.description ? `Prompt: ${submission.description}` : null,
      submission.submission ? `Submission:\n${submission.submission}` : null,
    ].filter(Boolean).join('\n\n');

    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `${submission.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(downloadUrl);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
      submitted: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
      graded: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
    };
    return colors[status] || 'bg-muted text-muted-foreground border-border';
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, any> = {
      pending: AlertCircle,
      submitted: FileText,
      graded: CheckCircle2,
    };
    return icons[status] || FileText;
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <SidebarLayout
      userRole={role}
      userName={user.full_name}
      userEmail={user.email}
      activeView={activeView}
      onViewChange={setActiveView}
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              {role === 'teacher' ? 'Received Assignments' : 'My Assignments'}
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-3 py-1 text-sm font-medium text-amber-600">
                <Sparkles className="h-4 w-4" />
                {stats.total} {role === 'teacher' ? 'Submissions' : 'Assignments'}
              </span>
            </h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500" />
              {role === 'teacher' 
                ? 'Review submitted assignments from your students' 
                : 'Track your assignments and submissions'}
            </p>
          </div>
          {role === 'teacher' && stats.pending > 0 && (
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 text-sm">
              <AlertCircle className="h-4 w-4 mr-1" />
              {stats.pending} Needs Review
            </Badge>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="group hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-700">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4 text-amber-500" />
              {role === 'teacher' ? 'Total Submissions' : 'Total Assignments'}
            </CardDescription>
            <CardTitle className="text-3xl flex items-center gap-2">
              {stats.total}
              <span className="text-sm font-normal text-muted-foreground">{role === 'teacher' ? 'submissions' : 'assignments'}</span>
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="group hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-700">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Timer className="h-4 w-4 text-amber-500" />
              {role === 'teacher' ? 'Needs Review' : 'Pending'}
            </CardDescription>
            <CardTitle className="text-3xl flex items-center gap-2 text-amber-600">
              {stats.pending}
              <span className="text-sm font-normal text-muted-foreground">waiting</span>
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="group hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-700">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Send className="h-4 w-4 text-blue-500" />
              {role === 'teacher' ? 'Reviewed' : 'Submitted'}
            </CardDescription>
            <CardTitle className="text-3xl flex items-center gap-2 text-blue-600">
              {stats.submitted}
              <span className="text-sm font-normal text-muted-foreground">done</span>
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="group hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-700">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Award className="h-4 w-4 text-green-500" />
              {role === 'teacher' ? 'Students' : 'Graded'}
            </CardDescription>
            <CardTitle className="text-3xl flex items-center gap-2 text-green-600">
              {stats.graded}
              <span className="text-sm font-normal text-muted-foreground">{role === 'teacher' ? 'students' : 'graded'}</span>
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Button 
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
          className={filter === 'all' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg' : 'border-slate-200 dark:border-slate-700 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700 transition-all'}
        >
          All
        </Button>
        {role === 'teacher' ? (
          <>
            <Button 
              variant={filter === 'submitted' ? 'default' : 'outline'}
              onClick={() => setFilter('submitted')}
              className={filter === 'submitted' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg' : 'border-slate-200 dark:border-slate-700 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700 transition-all'}
            >
              <Send className="h-4 w-4 mr-2" />
              Submitted
            </Button>
            <Button 
              variant={filter === 'graded' ? 'default' : 'outline'}
              onClick={() => setFilter('graded')}
              className={filter === 'graded' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg' : 'border-slate-200 dark:border-slate-700 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700 transition-all'}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Graded
            </Button>
          </>
        ) : (
          <>
            <Button 
              variant={filter === 'pending' ? 'default' : 'outline'}
              onClick={() => setFilter('pending')}
              className={filter === 'pending' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg' : 'border-slate-200 dark:border-slate-700 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700 transition-all'}
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              Pending
            </Button>
            <Button 
              variant={filter === 'submitted' ? 'default' : 'outline'}
              onClick={() => setFilter('submitted')}
              className={filter === 'submitted' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg' : 'border-slate-200 dark:border-slate-700 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700 transition-all'}
            >
              <Send className="h-4 w-4 mr-2" />
              Submitted
            </Button>
            <Button 
              variant={filter === 'graded' ? 'default' : 'outline'}
              onClick={() => setFilter('graded')}
              className={filter === 'graded' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg' : 'border-slate-200 dark:border-slate-700 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700 transition-all'}
            >
              <Award className="h-4 w-4 mr-2" />
              Graded
            </Button>
          </>
        )}
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {filteredAssignments.map((assignment) => {
          const StatusIcon = getStatusIcon(assignment.status);
          const isItemOverdue = assignment.status === 'pending' && isOverdue(assignment.due_date);
          
          return (
            <Card key={assignment.id} className="group hover:shadow-xl transition-all duration-300 hover:border-amber-200 dark:hover:border-amber-800 border border-slate-200 dark:border-slate-700">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <Badge variant="outline" className={`${getStatusColor(assignment.status)} flex items-center gap-1`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                      </Badge>
                      {isItemOverdue && (
                        <Badge variant="destructive" className="animate-pulse">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Overdue
                        </Badge>
                      )}
                      {assignment.grade && (
                        <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                          <Star className="h-3 w-3 mr-1" />
                          {assignment.grade}
                        </Badge>
                      )}
                    </div>

                    <CardTitle className="mb-2 group-hover:text-amber-600 transition-colors">
                      {assignment.title}
                    </CardTitle>
                    
                    <div className="space-y-1 mb-3">
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <BookOpen className="h-3 w-3 text-amber-500" />
                        <strong>Course:</strong> {assignment.course}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <FileText className="h-3 w-3 text-amber-500" />
                        <strong>Chapter:</strong> {assignment.chapter}
                      </p>
                      {role === 'teacher' && assignment.student_name && (
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <Users className="h-3 w-3 text-amber-500" />
                          <strong>Student:</strong> {assignment.student_name}
                        </p>
                      )}
                    </div>

                    <CardDescription className="text-base mb-3">
                      {assignment.description}
                    </CardDescription>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                      <span className={`flex items-center gap-1 ${isItemOverdue ? 'text-red-500 font-semibold' : ''}`}>
                        <Calendar className="h-4 w-4" />
                        Due: {assignment.due_date}
                        {isItemOverdue && ' (Overdue)'}
                      </span>
                      {assignment.submitted_at && (
                        <span className="flex items-center gap-1 text-green-600">
                          <Clock className="h-4 w-4" />
                          Submitted: {assignment.submitted_at}
                        </span>
                      )}
                    </div>

                    {assignment.feedback && (
                      <div className="mt-4 p-4 bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-xl border border-amber-200/50 dark:border-amber-800/30">
                        <p className="text-sm font-medium mb-1 flex items-center gap-2">
                          <MessageCircle className="h-4 w-4 text-amber-500" />
                          Feedback:
                        </p>
                        <p className="text-sm text-muted-foreground">{assignment.feedback}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 ml-4 flex-shrink-0">
                    {role === 'student' ? (
                      <>
                        {assignment.status === 'pending' && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg hover:scale-105 transition-all">
                                <Upload className="h-4 w-4 mr-2" />
                                Submit
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Submit Assignment</DialogTitle>
                                <DialogDescription>
                                  Submit your completed assignment for {assignment.title}
                                </DialogDescription>
                              </DialogHeader>
                              <SubmitAssignmentForm assignment={assignment} />
                            </DialogContent>
                          </Dialog>
                        )}
                        {assignment.status === 'submitted' && (
                          <Badge className="bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 px-4 py-2 text-sm">
                            <Clock className="h-4 w-4 mr-1" />
                            Awaiting Review
                          </Badge>
                        )}
                        {assignment.status === 'graded' && (
                          <Button variant="outline" type="button" onClick={() => downloadSubmission(assignment)} className="hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700 transition-all border-slate-200 dark:border-slate-700">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        )}
                      </>
                    ) : (
                      <>
                        <Button 
                          type="button" 
                          onClick={() => setReviewingSubmission(assignment)}
                          className={assignment.status === 'graded' ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:scale-105 transition-all' : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg hover:scale-105 transition-all'}
                        >
                          <ClipboardCheck className="h-4 w-4 mr-2" />
                          {assignment.status === 'graded' ? 'Edit Grade' : 'Review'}
                        </Button>
                        <Button variant="outline" type="button" onClick={() => downloadSubmission(assignment)} className="hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700 transition-all border-slate-200 dark:border-slate-700">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
            </Card>
          );
        })}

        {filteredAssignments.length === 0 && (
          <Card className="border border-slate-200 dark:border-slate-700">
            <CardContent className="py-12 text-center">
              <div className="bg-amber-50/50 dark:bg-amber-900/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-10 w-10 text-amber-500" />
              </div>
              <h3 className="font-bold text-lg mb-2">No assignments found</h3>
              <p className="text-muted-foreground">
                {filter === 'all' 
                  ? 'You don\'t have any assignments yet' 
                  : `No ${filter} assignments`}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {reviewingSubmission && (
        <Dialog open onOpenChange={(open) => !open && setReviewingSubmission(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-500" />
                Grade Submission
              </DialogTitle>
              <DialogDescription>
                Review the submission from {reviewingSubmission.student_name}
              </DialogDescription>
            </DialogHeader>
            <GradeAssignmentForm
              submission={reviewingSubmission}
              onCancel={() => setReviewingSubmission(null)}
              onSave={(grade, feedback) => {
                handleTeacherGradeSave(reviewingSubmission.id, grade, feedback);
                setReviewingSubmission(null);
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </SidebarLayout>
  );
}

function SubmitAssignmentForm({ assignment }: { assignment: any }) {
  const [submissionText, setSubmissionText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      // Show success state
      alert('Assignment submitted successfully!');
    }, 1500);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-900/10 dark:to-orange-900/10 p-4 rounded-xl border border-amber-200/50 dark:border-amber-800/30">
        <h4 className="font-medium mb-2 flex items-center gap-2">
          <ClipboardCheck className="h-4 w-4 text-amber-500" />
          Assignment Details
        </h4>
        <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
          <BookOpen className="h-3 w-3 text-amber-500" />
          <strong>Course:</strong> {assignment.course}
        </p>
        <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
          <FileText className="h-3 w-3 text-amber-500" />
          <strong>Chapter:</strong> {assignment.chapter}
        </p>
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <Calendar className="h-3 w-3 text-amber-500" />
          <strong>Due Date:</strong> {assignment.due_date}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="submission" className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-amber-500" />
          Your Submission
        </Label>
        <Textarea 
          id="submission" 
          placeholder="Type your assignment response here..." 
          rows={10}
          value={submissionText}
          onChange={(e) => setSubmissionText(e.target.value)}
          className="border-slate-200 dark:border-slate-700 focus:border-amber-500 focus:ring-amber-500"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="file" className="flex items-center gap-2">
          <Upload className="h-4 w-4 text-amber-500" />
          Upload File (optional)
        </Label>
        <Input id="file" type="file" className="border-slate-200 dark:border-slate-700 focus:border-amber-500 focus:ring-amber-500" />
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          Accepted formats: PDF, DOC, DOCX (Max 10MB)
        </p>
      </div>

      <div className="flex gap-2 justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
        <Button type="button" variant="outline" className="border-slate-200 dark:border-slate-700">Cancel</Button>
        <Button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg hover:scale-105 transition-all">
          {isSubmitting ? (
            <>
              <Clock className="h-4 w-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Submit Assignment
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

function GradeAssignmentForm({ submission, onSave, onCancel }: { submission: any; onSave: (grade: string, feedback: string) => void; onCancel: () => void }) {
  const [grade, setGrade] = useState(submission.grade || '');
  const [feedback, setFeedback] = useState(submission.feedback || '');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSave(grade, feedback);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10 p-4 rounded-xl border border-blue-200/50 dark:border-blue-800/30">
        <h4 className="font-medium mb-2 flex items-center gap-2">
          <Users className="h-4 w-4 text-blue-500" />
          Student Submission
        </h4>
        <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
          <Users className="h-3 w-3 text-blue-500" />
          <strong>Student:</strong> {submission.student_name}
        </p>
        <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
          <Clock className="h-3 w-3 text-blue-500" />
          <strong>Submitted:</strong> {submission.submitted_at}
        </p>
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <ClipboardCheck className="h-3 w-3 text-blue-500" />
          <strong>Assignment:</strong> {submission.title}
        </p>
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-blue-500" />
          Student's Submission
        </Label>
        <div className="p-4 bg-muted rounded-xl min-h-[200px] whitespace-pre-wrap border border-slate-200 dark:border-slate-700">
          <p className="text-sm">{submission.submission}</p>
        </div>
        <Button variant="outline" size="sm" type="button" className="hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all border-slate-200 dark:border-slate-700">
          <Download className="h-4 w-4 mr-2" />
          Download Attachment
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="grade" className="flex items-center gap-2">
          <Star className="h-4 w-4 text-amber-500" />
          Grade
        </Label>
        <Input 
          id="grade" 
          value={grade} 
          onChange={(event) => setGrade(event.target.value)} 
          placeholder="e.g., A, B+, 95%, etc." 
          className="border-slate-200 dark:border-slate-700 focus:border-amber-500 focus:ring-amber-500"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="feedback" className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-amber-500" />
          Feedback
        </Label>
        <Textarea 
          id="feedback" 
          value={feedback}
          onChange={(event) => setFeedback(event.target.value)}
          placeholder="Provide constructive feedback for the student..." 
          rows={6}
          className="border-slate-200 dark:border-slate-700 focus:border-amber-500 focus:ring-amber-500"
        />
      </div>

      <div className="flex gap-2 justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
        <Button type="button" variant="outline" onClick={onCancel} className="border-slate-200 dark:border-slate-700">Cancel</Button>
        <Button type="submit" className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg hover:scale-105 transition-all">
          <CheckCircle2 className="h-4 w-4 mr-2" />
          Save Grade
        </Button>
      </div>
    </form>
  );
}