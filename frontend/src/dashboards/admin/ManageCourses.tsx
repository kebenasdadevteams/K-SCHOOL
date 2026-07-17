import { type ChangeEvent, useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { SidebarLayout } from '../components/SidebarLayout';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { BookOpen, Clock, MessageSquare, Users, CheckCircle2, Edit3, ArrowRight, Plus, FileText, Upload } from 'lucide-react';

type Chapter = {
  id: number;
  title: string;
  content: string;
};

type Section = {
  id: number;
  title: string;
  chapters: Chapter[];
};

type StudentProgress = {
  id: number;
  name: string;
  progress: number;
  assignment: string;
  status: string;
  feedback: string;
  nextCourse: string;
};

type CourseRecord = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  imageMode: 'link' | 'upload';
  students: number;
  chapters: number;
  completed: number;
  pendingReviews: number;
  feedbackCount: number;
  nextLesson: string;
  status: string;
  sections: Section[];
  studentProgress: StudentProgress[];
};

type OutlineDraft = {
  title: string;
  description: string;
  nextLesson: string;
  sections: Section[];
};

type LessonDraft = {
  title: string;
  imageMode: 'link' | 'upload';
  imageUrl: string;
  imageFileName: string;
  content: string;
  sections: Section[];
};

export default function ManageCourses() {
  const location = useLocation();
  const locationState = location.state as { role?: string; userName?: string; userEmail?: string; view?: 'student' | 'teacher' | 'pastor' | 'editor' | 'admin' | 'developer' } | null;

  const [user] = useState({
    full_name: locationState?.userName || 'Demo Teacher',
    email: locationState?.userEmail || 'teacher@church.com',
  });

  const [activeView] = useState<'student' | 'teacher' | 'pastor' | 'editor' | 'admin' | 'developer'>(
    locationState?.view ?? (locationState?.role === 'teacher' ? 'teacher' : locationState?.role === 'pastor' ? 'pastor' : locationState?.role === 'editor' ? 'editor' : locationState?.role === 'admin' ? 'admin' : locationState?.role === 'developer' ? 'developer' : 'teacher')
  );

  const [courses, setCourses] = useState<CourseRecord[]>([
    {
      id: 1,
      title: 'Introduction to Biblical Studies',
      description: 'A guided course for students learning the foundations of biblical interpretation.',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=700&fit=crop',
      imageMode: 'link',
      students: 45,
      chapters: 4,
      completed: 7,
      pendingReviews: 4,
      feedbackCount: 9,
      nextLesson: 'Chapter 4: The Pentateuch',
      status: 'Active',
      sections: [
        {
          id: 101,
          title: 'Section 1: Foundations',
          chapters: [
            { id: 1001, title: 'Chapter 1: Introduction', content: 'Overview of the Bible and the learning journey.' },
            { id: 1002, title: 'Chapter 2: Background and Context', content: 'Historical and cultural setting.' },
          ],
        },
        {
          id: 102,
          title: 'Section 2: Core Study',
          chapters: [
            { id: 1003, title: 'Chapter 3: Core Themes', content: 'Major themes and practical application.' },
            { id: 1004, title: 'Chapter 4: Practical Reflection', content: 'Reflection and assignment work.' },
          ],
        },
      ],
      studentProgress: [
        { id: 1, name: 'Abebe Kebede', progress: 82, assignment: 'Old Testament Analysis', status: 'On track', feedback: 'Needs stronger application examples.', nextCourse: 'New Testament Deep Dive' },
        { id: 2, name: 'Tigist Alemayehu', progress: 74, assignment: 'Leadership Essay', status: 'Needs review', feedback: 'Good work on structure.', nextCourse: 'Christian Ethics 101' },
        { id: 3, name: 'Dawit Tesfaye', progress: 61, assignment: 'Amharic Reflection', status: 'At risk', feedback: 'Needs to submit next draft.', nextCourse: 'Amharic Bible Study' },
      ],
    },
    {
      id: 2,
      title: 'Christian Leadership Principles',
      description: 'Teaching servant leadership through biblical examples and practical reflection.',
      imageUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=1200&h=700&fit=crop',
      imageMode: 'link',
      students: 28,
      chapters: 1,
      completed: 5,
      pendingReviews: 3,
      feedbackCount: 6,
      nextLesson: 'Chapter 2: Servant Leadership',
      status: 'Active',
      sections: [
        {
          id: 201,
          title: 'Section 1: Leadership Basics',
          chapters: [{ id: 2001, title: 'Chapter 1: Call to Lead', content: 'Leadership is rooted in service.' }],
        },
      ],
      studentProgress: [
        { id: 4, name: 'Rahel Solomon', progress: 88, assignment: 'Leadership Reflection', status: 'On track', feedback: 'Great peer examples.', nextCourse: 'Church Management Basics' },
      ],
    },
    {
      id: 3,
      title: 'Amharic Bible Study',
      description: 'A bilingual study track designed for Amharic-speaking learners.',
      imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=1200&h=700&fit=crop',
      imageMode: 'link',
      students: 67,
      chapters: 2,
      completed: 8,
      pendingReviews: 5,
      feedbackCount: 12,
      nextLesson: 'Chapter 3: የዘፍጥረት መጽሐፍ',
      status: 'Needs attention',
      sections: [
        {
          id: 301,
          title: 'ክፍል 1: መግቢያ',
          chapters: [
            { id: 3001, title: 'ምዕራፍ 1: መግቢያ', content: 'የመጽሐፍ ቅዱስ ጥናት መርሀ ግብር።' },
            { id: 3002, title: 'ምዕራፍ 2: የታሪክ እይታ', content: 'የታሪክ እና የትርጉም እይታ።' },
          ],
        },
      ],
      studentProgress: [
        { id: 5, name: 'Samuel Mekonnen', progress: 55, assignment: 'Genesis Notes', status: 'At risk', feedback: 'Needs uploaded PDF.', nextCourse: 'Amharic Devotional Study' },
      ],
    },
  ]);

  const [selectedCourseId, setSelectedCourseId] = useState(courses[0].id);
  const selectedCourse = courses.find((course) => course.id === selectedCourseId) || courses[0];

  const [activeDialog, setActiveDialog] = useState<null | 'outline' | 'lesson' | 'schedule' | 'review' | 'editor' | 'chapter' | 'progress'>(null);
  const [outlineDraft, setOutlineDraft] = useState<OutlineDraft>({
    title: selectedCourse.title,
    description: selectedCourse.description,
    nextLesson: selectedCourse.nextLesson,
    sections: selectedCourse.sections,
  });
  const [lessonDraft, setLessonDraft] = useState<LessonDraft>({
    title: '',
    imageMode: 'link',
    imageUrl: '',
    imageFileName: '',
    content: '',
    sections: [
      {
        id: 1,
        title: 'Section 1',
        chapters: [{ id: 1, title: 'Chapter 1', content: '' }],
      },
    ],
  });
  const [approvalNotice, setApprovalNotice] = useState('');
  const [editingChapter, setEditingChapter] = useState<null | { sectionId: number; chapterId: number; title: string; content: string }>(null);
  const [progressFeedback, setProgressFeedback] = useState<null | StudentProgress>(null);
  const [progressDraft, setProgressDraft] = useState({
    attachmentName: '',
    comment: '',
    feedback: '',
    nextCourse: '',
  });

  useEffect(() => {
    if (activeDialog === 'outline') {
      setOutlineDraft({
        title: selectedCourse.title,
        description: selectedCourse.description,
        nextLesson: selectedCourse.nextLesson,
        sections: selectedCourse.sections.map((section) => ({
          ...section,
          chapters: section.chapters.map((chapter) => ({ ...chapter })),
        })),
      });
    }
  }, [activeDialog, selectedCourse]);

  const selectedSections = selectedCourse.sections;
  const selectedStudents = selectedCourse.studentProgress;

  const saveOutline = () => {
    setCourses((currentCourses) =>
      currentCourses.map((course) =>
        course.id === selectedCourse.id
          ? {
              ...course,
              title: outlineDraft.title,
              description: outlineDraft.description,
              nextLesson: outlineDraft.nextLesson,
              sections: outlineDraft.sections,
              chapters: outlineDraft.sections.reduce((total, section) => total + section.chapters.length, 0),
            }
          : course
      )
    );
    setActiveDialog(null);
  };

  const openLessonBuilder = () => {
    setLessonDraft({
      title: '',
      imageMode: 'link',
      imageUrl: '',
      imageFileName: '',
      content: '',
      sections: [
        {
          id: 1,
          title: 'Section 1',
          chapters: [{ id: 1, title: 'Chapter 1', content: '' }],
        },
      ],
    });
    setApprovalNotice('');
    setActiveDialog('lesson');
  };

  const addLessonSection = () => {
    setLessonDraft((current) => ({
      ...current,
      sections: [
        ...current.sections,
        {
          id: Date.now(),
          title: `Section ${current.sections.length + 1}`,
          chapters: [{ id: Date.now() + 1, title: 'Chapter 1', content: '' }],
        },
      ],
    }));
  };

  const updateLessonSection = (sectionId: number, value: string) => {
    setLessonDraft((current) => ({
      ...current,
      sections: current.sections.map((section) => (section.id === sectionId ? { ...section, title: value } : section)),
    }));
  };

  const addLessonChapter = (sectionId: number) => {
    setLessonDraft((current) => ({
      ...current,
      sections: current.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              chapters: [...section.chapters, { id: Date.now(), title: `Chapter ${section.chapters.length + 1}`, content: '' }],
            }
          : section
      ),
    }));
  };

  const updateLessonChapter = (sectionId: number, chapterId: number, field: 'title' | 'content', value: string) => {
    setLessonDraft((current) => ({
      ...current,
      sections: current.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              chapters: section.chapters.map((chapter) => (chapter.id === chapterId ? { ...chapter, [field]: value } : chapter)),
            }
          : section
      ),
    }));
  };

  const updateLessonImageMode = (mode: 'link' | 'upload') => {
    setLessonDraft((current) => ({
      ...current,
      imageMode: mode,
      imageUrl: mode === 'upload' ? '' : current.imageUrl,
      imageFileName: mode === 'link' ? '' : current.imageFileName,
    }));
  };

  const handleLessonImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setLessonDraft((current) => ({
      ...current,
      imageMode: 'upload',
      imageFileName: file.name,
      imageUrl: previewUrl,
    }));
  };

  const submitLessonForApproval = () => {
    const chapterCount = lessonDraft.sections.reduce((total, section) => total + section.chapters.length, 0);
    const createdCourseId = Date.now();

    setCourses((currentCourses) => [
      ...currentCourses,
      {
        id: createdCourseId,
        title: lessonDraft.title || 'Untitled Course',
        description: lessonDraft.content || 'Course content awaiting editor review.',
        imageUrl: lessonDraft.imageUrl || '',
        imageMode: lessonDraft.imageMode,
        students: 0,
        chapters: chapterCount,
        completed: 0,
        pendingReviews: 0,
        feedbackCount: 0,
        nextLesson: lessonDraft.sections[0]?.chapters[0]?.title || 'Chapter 1',
        status: 'Pending editor approval',
        sections: lessonDraft.sections.map((section) => ({
          ...section,
          chapters: section.chapters.map((chapter) => ({ ...chapter })),
        })),
        studentProgress: [],
      },
    ]);

    setSelectedCourseId(createdCourseId);
    setApprovalNotice('Course sent to editor for approval.');
    setActiveDialog(null);
  };

  const handleOpenChapterEditor = (sectionId: number, chapter: Chapter) => {
    setEditingChapter({ sectionId, chapterId: chapter.id, title: chapter.title, content: chapter.content });
    setActiveDialog('chapter');
  };

  const saveChapterEdit = () => {
    if (!editingChapter) return;

    setCourses((currentCourses) =>
      currentCourses.map((course) =>
        course.id === selectedCourse.id
          ? {
              ...course,
              sections: course.sections.map((section) =>
                section.id === editingChapter.sectionId
                  ? {
                      ...section,
                      chapters: section.chapters.map((chapter) =>
                        chapter.id === editingChapter.chapterId
                          ? { ...chapter, title: editingChapter.title, content: editingChapter.content }
                          : chapter
                      ),
                    }
                  : section
              ),
            }
          : course
      )
    );

    setEditingChapter(null);
    setActiveDialog(null);
  };

  const openProgressFeedback = (student: StudentProgress) => {
    setProgressFeedback(student);
    setProgressDraft({
      attachmentName: '',
      comment: student.feedback,
      feedback: student.feedback,
      nextCourse: student.nextCourse,
    });
    setActiveDialog('progress');
  };

  const sendProgressFeedback = () => {
    if (!progressFeedback) return;

    setCourses((currentCourses) =>
      currentCourses.map((course) =>
        course.id === selectedCourse.id
          ? {
              ...course,
              studentProgress: course.studentProgress.map((student) =>
                student.id === progressFeedback.id
                  ? {
                      ...student,
                      feedback: progressDraft.feedback,
                      nextCourse: progressDraft.nextCourse,
                      status: 'Feedback sent',
                    }
                  : student
              ),
              feedbackCount: course.feedbackCount + 1,
            }
          : course
      )
    );

    setProgressFeedback(null);
    setActiveDialog(null);
  };

  const courseStats = {
    totalCourses: courses.length,
    totalStudents: courses.reduce((total, course) => total + course.students, 0),
    pendingReviews: courses.reduce((total, course) => total + course.pendingReviews, 0),
    feedbackNotes: courses.reduce((total, course) => total + course.feedbackCount, 0),
  };

  return (
    <SidebarLayout userRole="teacher" userName={user.full_name} userEmail={user.email} activeView={activeView}>
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage Courses</h1>
          <p className="text-muted-foreground">Update lessons, review course submissions, and respond to student feedback.</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setOutlineDraft({
                title: selectedCourse.title,
                description: selectedCourse.description,
                nextLesson: selectedCourse.nextLesson,
                sections: selectedCourse.sections.map((section) => ({
                  ...section,
                  chapters: section.chapters.map((chapter) => ({ ...chapter })),
                })),
              });
              setActiveDialog('outline');
            }}
          >
            <Edit3 className="h-4 w-4 mr-2" />
            Edit Course Outline
          </Button>
          <Button onClick={openLessonBuilder}>
            <BookOpen className="h-4 w-4 mr-2" />
            Create Lesson
          </Button>
        </div>
      </div>

      {approvalNotice && (
        <div className="mb-6 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary">{approvalNotice}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Courses</CardDescription>
            <CardTitle className="text-3xl">{courseStats.totalCourses}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Students</CardDescription>
            <CardTitle className="text-3xl">{courseStats.totalStudents}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending Reviews</CardDescription>
            <CardTitle className="text-3xl">{courseStats.pendingReviews}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Student Feedback</CardDescription>
            <CardTitle className="text-3xl">{courseStats.feedbackNotes}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <Card className="xl:col-span-4">
          <CardHeader>
            <CardTitle>Courses</CardTitle>
            <CardDescription>Select a course to manage it</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {courses.map((course) => (
              <button
                key={course.id}
                type="button"
                onClick={() => setSelectedCourseId(course.id)}
                className={`w-full rounded-xl border p-4 text-left transition-colors ${selectedCourseId === course.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/60'}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{course.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{course.students} students • {course.chapters} chapters</p>
                  </div>
                  <Badge variant={selectedCourseId === course.id ? 'default' : 'secondary'}>{course.status}</Badge>
                </div>
                <div className="mt-3">
                  <Progress value={course.chapters > 0 ? (course.completed / course.chapters) * 100 : 0} />
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        <div className="xl:col-span-8 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle>{selectedCourse.title}</CardTitle>
                  <CardDescription>{selectedCourse.description}</CardDescription>
                </div>
                <Badge>{selectedCourse.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6 overflow-hidden rounded-2xl border bg-muted/20">
                {selectedCourse.imageUrl ? (
                  <img src={selectedCourse.imageUrl} alt={selectedCourse.title} className="h-56 w-full object-cover" />
                ) : (
                  <div className="flex h-56 items-center justify-center text-sm text-muted-foreground">No course image yet</div>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="rounded-xl bg-muted/40 p-4">
                  <p className="text-xs text-muted-foreground">Students</p>
                  <p className="mt-1 text-2xl font-bold">{selectedCourse.students}</p>
                </div>
                <div className="rounded-xl bg-muted/40 p-4">
                  <p className="text-xs text-muted-foreground">Chapters</p>
                  <p className="mt-1 text-2xl font-bold">{selectedCourse.chapters}</p>
                </div>
                <div className="rounded-xl bg-muted/40 p-4">
                  <p className="text-xs text-muted-foreground">Pending Reviews</p>
                  <p className="mt-1 text-2xl font-bold">{selectedCourse.pendingReviews}</p>
                </div>
                <div className="rounded-xl bg-muted/40 p-4">
                  <p className="text-xs text-muted-foreground">Feedback Notes</p>
                  <p className="mt-1 text-2xl font-bold">{selectedCourse.feedbackCount}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 rounded-xl border bg-background p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-medium">Next lesson</p>
                  <p className="text-sm text-muted-foreground">{selectedCourse.nextLesson}</p>
                </div>
                <Button variant="outline" onClick={() => setActiveDialog('editor')}>
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Open lesson editor
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Sections</CardTitle>
                <CardDescription>Click any chapter to edit its title and content.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedSections.map((section) => (
                  <div key={section.id} className="space-y-3 rounded-xl border bg-muted/20 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium">{section.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{section.chapters.length} chapters</p>
                      </div>
                      <Button type="button" variant="outline" onClick={() => addLessonChapter(section.id)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Chapter
                      </Button>
                    </div>
                    <div className="space-y-3 pl-2 border-l">
                      {section.chapters.map((chapter) => (
                        <button
                          key={chapter.id}
                          type="button"
                          onClick={() => handleOpenChapterEditor(section.id, chapter)}
                          className="w-full rounded-xl border bg-background p-4 text-left transition-colors hover:border-primary hover:bg-primary/5"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-medium">{chapter.title}</p>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{chapter.content || 'No content yet'}</p>
                            </div>
                            <Badge variant="secondary">Edit</Badge>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Student Progress</CardTitle>
                <CardDescription>Manage progress, attach assignment PDFs, and send the next course.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedStudents.map((student) => (
                  <div key={student.id} className="rounded-xl border bg-muted/30 p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">Assignment: {student.assignment}</p>
                      </div>
                      <Badge variant={student.status === 'At risk' ? 'destructive' : 'secondary'}>{student.progress}%</Badge>
                    </div>
                    <Progress value={student.progress} />
                    <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                      <span>Status: {student.status}</span>
                      <Button type="button" variant="outline" onClick={() => openProgressFeedback(student)}>Send feedback</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Feedback</CardTitle>
              <CardDescription>Student comments that need a response</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { student: 'Rahel Solomon', message: 'Can we add one more example for chapter 3?', time: '2h ago' },
                { student: 'Samuel Mekonnen', message: 'The chapter quiz helped a lot.', time: 'Yesterday' },
                { student: 'Eden Bekele', message: 'Please add a summary handout for the next lesson.', time: '2d ago' },
              ].map((item) => (
                <div key={item.student} className="flex flex-col gap-3 rounded-xl border bg-background p-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-medium">{item.student}</p>
                    <p className="text-sm text-muted-foreground mt-1">{item.message}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MessageSquare className="h-4 w-4" />
                    {item.time}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={activeDialog !== null} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent className="max-w-2xl">
          {activeDialog === 'outline' && (
            <>
              <DialogHeader>
                <DialogTitle>Edit Course Outline</DialogTitle>
                <DialogDescription>Update the selected course content for {selectedCourse.title}. All chapters and content are editable here.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                <div className="space-y-2">
                  <Label htmlFor="outline-course">Course</Label>
                  <Input id="outline-course" value={outlineDraft.title} onChange={(event) => setOutlineDraft((current) => ({ ...current, title: event.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="outline-summary">Course Content</Label>
                  <Textarea id="outline-summary" value={outlineDraft.description} onChange={(event) => setOutlineDraft((current) => ({ ...current, description: event.target.value }))} rows={4} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="outline-next-lesson">Next Lesson</Label>
                  <Input id="outline-next-lesson" value={outlineDraft.nextLesson} onChange={(event) => setOutlineDraft((current) => ({ ...current, nextLesson: event.target.value }))} />
                </div>
                <div className="space-y-3 rounded-xl border bg-muted/20 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium">Sections and chapters</p>
                      <p className="text-xs text-muted-foreground">Edit sections, chapters, and the text in each chapter.</p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        setOutlineDraft((current) => ({
                          ...current,
                          sections: [
                            ...current.sections,
                            { id: Date.now(), title: `Section ${current.sections.length + 1}`, chapters: [{ id: Date.now() + 1, title: 'Chapter 1', content: '' }] },
                          ],
                        }))
                      }
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Section
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {outlineDraft.sections.map((section, sectionIndex) => (
                      <div key={section.id} className="rounded-xl border bg-background p-4 space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor={`outline-section-${section.id}`}>Section {sectionIndex + 1}</Label>
                          <Input
                            id={`outline-section-${section.id}`}
                            value={section.title}
                            onChange={(event) =>
                              setOutlineDraft((current) => ({
                                ...current,
                                sections: current.sections.map((item) => (item.id === section.id ? { ...item, title: event.target.value } : item)),
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-3 pl-2 border-l">
                          {section.chapters.map((chapter, chapterIndex) => (
                            <div key={chapter.id} className="space-y-2 rounded-lg bg-muted/30 p-3">
                              <Label htmlFor={`outline-chapter-${section.id}-${chapter.id}`}>Chapter {chapterIndex + 1}</Label>
                              <Input
                                id={`outline-chapter-${section.id}-${chapter.id}`}
                                value={chapter.title}
                                onChange={(event) =>
                                  setOutlineDraft((current) => ({
                                    ...current,
                                    sections: current.sections.map((item) =>
                                      item.id === section.id
                                        ? { ...item, chapters: item.chapters.map((entry) => (entry.id === chapter.id ? { ...entry, title: event.target.value } : entry)) }
                                        : item
                                    ),
                                  }))
                                }
                              />
                              <Textarea
                                value={chapter.content}
                                onChange={(event) =>
                                  setOutlineDraft((current) => ({
                                    ...current,
                                    sections: current.sections.map((item) =>
                                      item.id === section.id
                                        ? { ...item, chapters: item.chapters.map((entry) => (entry.id === chapter.id ? { ...entry, content: event.target.value } : entry)) }
                                        : item
                                    ),
                                  }))
                                }
                                rows={3}
                              />
                            </div>
                          ))}
                          <Button type="button" variant="outline" className="w-full" onClick={() => addLessonChapter(section.id)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Chapter
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setActiveDialog(null)}>Cancel</Button>
                  <Button type="button" onClick={saveOutline}>Save Outline</Button>
                </div>
              </div>
            </>
          )}

          {activeDialog === 'lesson' && (
            <>
              <DialogHeader>
                <DialogTitle>Create Lesson</DialogTitle>
                <DialogDescription>Build a course with an image, text content, sections, and chapters before sending it to editor review.</DialogDescription>
              </DialogHeader>
              <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-1">
                <div className="space-y-2">
                  <Label htmlFor="lesson-title">Course Title</Label>
                  <Input id="lesson-title" value={lessonDraft.title} onChange={(event) => setLessonDraft((current) => ({ ...current, title: event.target.value }))} placeholder="Enter a course title" />
                </div>

                <div className="space-y-2">
                  <Label>Course Image</Label>
                  <div className="flex gap-2">
                    <Button type="button" variant={lessonDraft.imageMode === 'link' ? 'default' : 'outline'} onClick={() => updateLessonImageMode('link')}>
                      Paste Link
                    </Button>
                    <Button type="button" variant={lessonDraft.imageMode === 'upload' ? 'default' : 'outline'} onClick={() => updateLessonImageMode('upload')}>
                      Upload Image
                    </Button>
                  </div>
                  {lessonDraft.imageMode === 'link' ? (
                    <Input id="lesson-image" value={lessonDraft.imageUrl} onChange={(event) => setLessonDraft((current) => ({ ...current, imageUrl: event.target.value }))} placeholder="Paste an image URL for the course cover" />
                  ) : (
                    <Input id="lesson-image-upload" type="file" accept="image/*" onChange={handleLessonImageUpload} />
                  )}
                  {lessonDraft.imageFileName && <p className="text-xs text-muted-foreground">Selected file: {lessonDraft.imageFileName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lesson-content">Course Text Content</Label>
                  <Textarea id="lesson-content" value={lessonDraft.content} onChange={(event) => setLessonDraft((current) => ({ ...current, content: event.target.value }))} placeholder="Write the course overview, learning goals, and text content" rows={5} />
                </div>

                <div className="space-y-3 rounded-xl border bg-muted/20 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium">Sections & Chapters</p>
                      <p className="text-xs text-muted-foreground">Add as many sections and chapters as you need.</p>
                    </div>
                    <Button type="button" variant="outline" onClick={addLessonSection}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Section
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {lessonDraft.sections.map((section, sectionIndex) => (
                      <div key={section.id} className="rounded-xl border bg-background p-4 space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor={`lesson-section-${section.id}`}>Section {sectionIndex + 1}</Label>
                          <Input id={`lesson-section-${section.id}`} value={section.title} onChange={(event) => updateLessonSection(section.id, event.target.value)} placeholder="Enter section title" />
                        </div>

                        <div className="space-y-3 pl-2 border-l">
                          {section.chapters.map((chapter, chapterIndex) => (
                            <div key={chapter.id} className="space-y-2 rounded-lg bg-muted/30 p-3">
                              <Label htmlFor={`lesson-chapter-${section.id}-${chapter.id}`}>Chapter {chapterIndex + 1}</Label>
                              <Input id={`lesson-chapter-${section.id}-${chapter.id}`} value={chapter.title} onChange={(event) => updateLessonChapter(section.id, chapter.id, 'title', event.target.value)} placeholder="Enter chapter title" />
                              <Textarea value={chapter.content} onChange={(event) => updateLessonChapter(section.id, chapter.id, 'content', event.target.value)} placeholder="Add chapter content" rows={3} />
                            </div>
                          ))}
                          <Button type="button" variant="outline" className="w-full" onClick={() => addLessonChapter(section.id)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Chapter
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setActiveDialog(null)}>Cancel</Button>
                  <Button type="button" onClick={submitLessonForApproval}>Create and Send for Approval</Button>
                </div>
              </div>
            </>
          )}

          {activeDialog === 'chapter' && editingChapter && (
            <>
              <DialogHeader>
                <DialogTitle>Edit Chapter</DialogTitle>
                <DialogDescription>Edit the selected chapter content for {selectedCourse.title}.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="chapter-title">Chapter Title</Label>
                  <Input id="chapter-title" value={editingChapter.title} onChange={(event) => setEditingChapter((current) => (current ? { ...current, title: event.target.value } : current))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="chapter-content">Chapter Content</Label>
                  <Textarea id="chapter-content" value={editingChapter.content} onChange={(event) => setEditingChapter((current) => (current ? { ...current, content: event.target.value } : current))} rows={6} />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setActiveDialog(null)}>Cancel</Button>
                  <Button type="button" onClick={saveChapterEdit}>Save Chapter</Button>
                </div>
              </div>
            </>
          )}

          {activeDialog === 'progress' && progressFeedback && (
            <>
              <DialogHeader>
                <DialogTitle>Send Progress Feedback</DialogTitle>
                <DialogDescription>Attach the PDF submission, comment on the assignment, and send the next course.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="rounded-xl border bg-muted/20 p-4">
                  <p className="font-medium">{progressFeedback.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">{progressFeedback.assignment}</p>
                  <p className="text-xs text-muted-foreground mt-1">Current progress: {progressFeedback.progress}%</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="progress-attachment">PDF Attachment</Label>
                  <Input id="progress-attachment" type="file" accept="application/pdf" onChange={(event) => setProgressDraft((current) => ({ ...current, attachmentName: event.target.files?.[0]?.name || '' }))} />
                  {progressDraft.attachmentName && <p className="text-xs text-muted-foreground">Attached: {progressDraft.attachmentName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="progress-comment">Assignment Comment</Label>
                  <Textarea id="progress-comment" value={progressDraft.comment} onChange={(event) => setProgressDraft((current) => ({ ...current, comment: event.target.value }))} rows={3} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="progress-feedback">Course Feedback</Label>
                  <Textarea id="progress-feedback" value={progressDraft.feedback} onChange={(event) => setProgressDraft((current) => ({ ...current, feedback: event.target.value }))} rows={4} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="progress-next-course">Next Course</Label>
                  <Input id="progress-next-course" value={progressDraft.nextCourse} onChange={(event) => setProgressDraft((current) => ({ ...current, nextCourse: event.target.value }))} />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setActiveDialog(null)}>Cancel</Button>
                  <Button type="button" onClick={sendProgressFeedback}>Send Feedback</Button>
                </div>
              </div>
            </>
          )}

          {activeDialog === 'schedule' && (
            <>
              <DialogHeader>
                <DialogTitle>Schedule Lesson Updates</DialogTitle>
                <DialogDescription>Plan updates and release dates for {selectedCourse.title}.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="schedule-date">Release Date</Label>
                  <Input id="schedule-date" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="schedule-note">Update Note</Label>
                  <Textarea id="schedule-note" placeholder="Add a note for students" rows={4} />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setActiveDialog(null)}>Cancel</Button>
                  <Button type="button" onClick={() => setActiveDialog(null)}>Schedule</Button>
                </div>
              </div>
            </>
          )}

          {activeDialog === 'review' && (
            <>
              <DialogHeader>
                <DialogTitle>Open Review Queue</DialogTitle>
                <DialogDescription>Review submitted work and grade student responses.</DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                {selectedStudents.map((student) => (
                  <div key={student.id} className="rounded-xl border bg-muted/30 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{student.assignment}</p>
                      </div>
                      <Badge variant="secondary">{student.progress}%</Badge>
                    </div>
                  </div>
                ))}
                <div className="flex justify-end">
                  <Button type="button" onClick={() => setActiveDialog(null)}>Done</Button>
                </div>
              </div>
            </>
          )}

          {activeDialog === 'editor' && (
            <>
              <DialogHeader>
                <DialogTitle>Open Lesson Editor</DialogTitle>
                <DialogDescription>Edit the current lesson for {selectedCourse.title}.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="editor-lesson">Lesson Title</Label>
                  <Input id="editor-lesson" defaultValue={selectedCourse.nextLesson} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editor-notes">Lesson Notes</Label>
                  <Textarea id="editor-notes" placeholder="Add lesson notes, resources, or changes" rows={5} />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setActiveDialog(null)}>Cancel</Button>
                  <Button type="button" onClick={() => setActiveDialog(null)}>Save Lesson</Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </SidebarLayout>
  );
}