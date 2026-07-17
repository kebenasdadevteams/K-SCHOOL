import { type ChangeEvent, useEffect, useState, useRef } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import {
  BookOpen,
  Clock,
  MessageSquare,
  Users,
  CheckCircle2,
  Edit3,
  ArrowRight,
  Plus,
  FileText,
  Upload,
  Image,
  Video,
  Link,
  Hash,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Share2,
  Eye,
  Trash2,
  Move,
  Copy,
  Save,
  Send,
  File,
  Music,
  Play,
  Pause,
  Volume2,
  Maximize2,
  Minimize2,
  ChevronDown,
  ChevronRight,
  Grid,
  List,
  Search,
  Filter,
  MoreVertical,
  Globe,
  Lock,
  Unlock,
  Calendar,
  Star,
  Award,
  TrendingUp,
  PieChart,
  BarChart3
} from 'lucide-react';

// Types
type ContentBlock = {
  id: string;
  type: 'header' | 'paragraph' | 'image' | 'video' | 'link' | 'audio' | 'file';
  content: string;
  metadata?: {
    url?: string;
    fileName?: string;
    fileSize?: number;
    altText?: string;
    caption?: string;
    alignment?: 'left' | 'center' | 'right';
  };
};

type Chapter = {
  id: number;
  title: string;
  content: string;
  blocks: ContentBlock[];
  order: number;
  status: 'draft' | 'submitted' | 'approved' | 'published';
  created_at: string;
  updated_at: string;
};

type Section = {
  id: number;
  title: string;
  description: string;
  chapters: Chapter[];
  order: number;
  status: 'draft' | 'submitted' | 'approved' | 'published';
};

type Course = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  imageMode: 'link' | 'upload';
  sections: Section[];
  students: number;
  totalChapters: number;
  completedChapters: number;
  pendingReviews: number;
  feedbackCount: number;
  nextLesson: string;
  status: 'draft' | 'submitted' | 'approved' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  lastModifiedBy: string;
  version: number;
  tags: string[];
  level: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  prerequisites: string[];
};

type StudentProgress = {
  id: number;
  name: string;
  progress: number;
  assignment: string;
  status: string;
  feedback: string;
  nextCourse: string;
  completedChapters: number[];
  lastActivity: string;
  grade?: string;
};

// Mock data
const mockCourse: Course = {
  id: 1,
  title: 'Introduction to Biblical Studies',
  description: 'A comprehensive course exploring the foundations of biblical interpretation, historical context, and practical application.',
  imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=700&fit=crop',
  imageMode: 'link',
  sections: [
    {
      id: 101,
      title: 'Foundations of Biblical Study',
      description: 'Introduction to biblical interpretation principles',
      order: 0,
      status: 'published',
      chapters: [
        {
          id: 1001,
          title: 'Introduction to the Bible',
          content: 'An overview of the Bible\'s structure and themes.',
          blocks: [
            { id: 'b1', type: 'header', content: 'Understanding Scripture' },
            { id: 'b2', type: 'paragraph', content: 'The Bible is a collection of sacred texts...' },
            { id: 'b3', type: 'image', content: 'bible-structure.png', metadata: { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop', caption: 'The structure of the Bible' } }
          ],
          order: 0,
          status: 'published',
          created_at: '2024-01-15',
          updated_at: '2024-01-20'
        },
        {
          id: 1002,
          title: 'Historical Context',
          content: 'Understanding the historical and cultural setting.',
          blocks: [
            { id: 'b4', type: 'header', content: 'Historical Background' },
            { id: 'b5', type: 'paragraph', content: 'The biblical narrative unfolds within specific historical contexts...' },
            { id: 'b6', type: 'video', content: 'historical-context.mp4', metadata: { url: 'https://example.com/video1.mp4', caption: 'Historical context overview' } }
          ],
          order: 1,
          status: 'published',
          created_at: '2024-01-18',
          updated_at: '2024-01-22'
        }
      ]
    },
    {
      id: 102,
      title: 'Core Theological Themes',
      description: 'Exploring major themes and practical application',
      order: 1,
      status: 'published',
      chapters: [
        {
          id: 1003,
          title: 'Core Themes of Scripture',
          content: 'Major theological themes throughout the Bible.',
          blocks: [
            { id: 'b7', type: 'header', content: 'Major Themes' },
            { id: 'b8', type: 'paragraph', content: 'Several key themes run throughout the biblical narrative...' },
            { id: 'b9', type: 'link', content: 'https://example.com/resource.pdf', metadata: { url: 'https://example.com/resource.pdf', caption: 'Additional reading material' } }
          ],
          order: 2,
          status: 'published',
          created_at: '2024-01-25',
          updated_at: '2024-01-28'
        }
      ]
    }
  ],
  students: 45,
  totalChapters: 4,
  completedChapters: 2,
  pendingReviews: 1,
  feedbackCount: 9,
  nextLesson: 'Chapter 4: The Pentateuch',
  status: 'published',
  createdAt: '2024-01-10',
  updatedAt: '2024-02-01',
  publishedAt: '2024-01-15',
  lastModifiedBy: 'Teacher Mary',
  version: 2,
  tags: ['Biblical Studies', 'Interpretation', 'Theology'],
  level: 'intermediate',
  estimatedTime: 240,
  prerequisites: ['Basic Bible knowledge']
};

// Main Component
export default function ManageCourses() {
  const location = useLocation();
  const locationState = location.state as { role?: string; userName?: string; userEmail?: string; view?: string } | null;

  const [user] = useState({
    full_name: locationState?.userName || 'Demo Teacher',
    email: locationState?.userEmail || 'teacher@church.com',
  });

  const [activeView] = useState(locationState?.view || 'teacher');
  const [courses, setCourses] = useState<Course[]>([mockCourse]);
  const [selectedCourseId, setSelectedCourseId] = useState(mockCourse.id);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeDialog, setActiveDialog] = useState<null | 'course' | 'chapter' | 'section' | 'content' | 'preview' | 'settings' | 'review' | 'progress'>(null);
  
  // Content editing state
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  
  // Dialog states
  const [courseDraft, setCourseDraft] = useState<Partial<Course>>({});
  const [sectionDraft, setSectionDraft] = useState<Partial<Section>>({});
  const [chapterDraft, setChapterDraft] = useState<Partial<Chapter>>({});
  
  // File upload refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const selectedCourse = courses.find(c => c.id === selectedCourseId) || courses[0];

  // Content block management
  const addContentBlock = (type: ContentBlock['type']) => {
    const newBlock: ContentBlock = {
      id: `block-${Date.now()}`,
      type,
      content: '',
      metadata: {}
    };
    setBlocks([...blocks, newBlock]);
    setSelectedBlockId(newBlock.id);
  };

  const updateContentBlock = (id: string, content: string, metadata?: any) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, content, metadata: { ...block.metadata, ...metadata } } : block
    ));
  };

  const removeContentBlock = (id: string) => {
    setBlocks(blocks.filter(block => block.id !== id));
    if (selectedBlockId === id) setSelectedBlockId(null);
  };

  const moveContentBlock = (id: string, direction: 'up' | 'down') => {
    const index = blocks.findIndex(b => b.id === id);
    if (index === -1) return;
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;
    const newBlocks = [...blocks];
    [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
    setBlocks(newBlocks);
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>, type: ContentBlock['type']) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const url = URL.createObjectURL(file);
    const newBlock: ContentBlock = {
      id: `block-${Date.now()}`,
      type,
      content: file.name,
      metadata: {
        url,
        fileName: file.name,
        fileSize: file.size
      }
    };
    setBlocks([...blocks, newBlock]);
    setSelectedBlockId(newBlock.id);
    event.target.value = '';
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const url = URL.createObjectURL(file);
    const newBlock: ContentBlock = {
      id: `block-${Date.now()}`,
      type: 'image',
      content: file.name,
      metadata: { url, fileName: file.name, fileSize: file.size }
    };
    setBlocks([...blocks, newBlock]);
    setSelectedBlockId(newBlock.id);
    event.target.value = '';
  };

  const handleLinkUpload = (url: string, type: 'link' | 'video' | 'audio') => {
    const newBlock: ContentBlock = {
      id: `block-${Date.now()}`,
      type,
      content: url,
      metadata: { url }
    };
    setBlocks([...blocks, newBlock]);
    setSelectedBlockId(newBlock.id);
  };

  // Course management functions
  const createCourse = () => {
    const newCourse: Course = {
      id: Date.now(),
      title: courseDraft.title || 'New Course',
      description: courseDraft.description || '',
      imageUrl: courseDraft.imageUrl || '',
      imageMode: 'link',
      sections: [],
      students: 0,
      totalChapters: 0,
      completedChapters: 0,
      pendingReviews: 0,
      feedbackCount: 0,
      nextLesson: '',
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastModifiedBy: user.full_name,
      version: 1,
      tags: [],
      level: 'beginner',
      estimatedTime: 0,
      prerequisites: []
    };
    setCourses([...courses, newCourse]);
    setSelectedCourseId(newCourse.id);
    setActiveDialog(null);
    setCourseDraft({});
  };

  const updateCourse = () => {
    setCourses(courses.map(course => 
      course.id === selectedCourseId 
        ? { ...course, ...courseDraft, updatedAt: new Date().toISOString(), version: course.version + 1 }
        : course
    ));
    setActiveDialog(null);
    setCourseDraft({});
  };

  const submitForApproval = (courseId: number) => {
    setCourses(courses.map(course => 
      course.id === courseId 
        ? { ...course, status: 'submitted', updatedAt: new Date().toISOString() }
        : course
    ));
  };

  // Chapter management
  const createChapter = () => {
    if (!selectedCourse || !editingSection) return;
    
    const newChapter: Chapter = {
      id: Date.now(),
      title: chapterDraft.title || 'New Chapter',
      content: chapterDraft.content || '',
      blocks: [],
      order: editingSection.chapters.length,
      status: 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setCourses(courses.map(course => 
      course.id === selectedCourseId 
        ? {
            ...course,
            sections: course.sections.map(section => 
              section.id === editingSection.id 
                ? { ...section, chapters: [...section.chapters, newChapter] }
                : section
            ),
            totalChapters: course.totalChapters + 1,
            updatedAt: new Date().toISOString()
          }
        : course
    ));
    setActiveDialog(null);
    setChapterDraft({});
    setEditingSection(null);
  };

  const updateChapter = () => {
    if (!selectedCourse || !editingChapter) return;

    setCourses(courses.map(course => 
      course.id === selectedCourseId 
        ? {
            ...course,
            sections: course.sections.map(section => 
              section.id === editingSection?.id 
                ? {
                    ...section,
                    chapters: section.chapters.map(chapter =>
                      chapter.id === editingChapter.id
                        ? { ...chapter, ...chapterDraft, updated_at: new Date().toISOString() }
                        : chapter
                    )
                  }
                : section
            ),
            updatedAt: new Date().toISOString()
          }
        : course
    ));
    setActiveDialog(null);
    setChapterDraft({});
    setEditingChapter(null);
  };

  const openChapterEditor = (section: Section, chapter: Chapter) => {
    setEditingSection(section);
    setEditingChapter(chapter);
    setBlocks(chapter.blocks || []);
    setChapterDraft(chapter);
    setActiveDialog('content');
  };

  const saveChapterContent = () => {
    if (!editingChapter || !editingSection) return;

    const updatedChapter = {
      ...editingChapter,
      blocks: blocks,
      content: blocks.filter(b => b.type === 'paragraph').map(b => b.content).join('\n'),
      updated_at: new Date().toISOString()
    };

    setCourses(courses.map(course => 
      course.id === selectedCourseId 
        ? {
            ...course,
            sections: course.sections.map(section => 
              section.id === editingSection.id 
                ? {
                    ...section,
                    chapters: section.chapters.map(chapter =>
                      chapter.id === editingChapter.id ? updatedChapter : chapter
                    )
                  }
                : section
            ),
            updatedAt: new Date().toISOString()
          }
        : course
    ));
    setActiveDialog(null);
    setEditingChapter(null);
    setEditingSection(null);
    setBlocks([]);
  };

  // Render content block
  const renderContentBlock = (block: ContentBlock) => {
    switch (block.type) {
      case 'header':
        return <h3 className="text-xl font-bold text-[#1a1a1a]">{block.content}</h3>;
      case 'paragraph':
        return <p className="text-sm text-[#1a1a1a] leading-relaxed">{block.content}</p>;
      case 'image':
        return (
          <div className="space-y-2">
            <img 
              src={block.metadata?.url} 
              alt={block.metadata?.altText || block.content}
              className="rounded-lg max-w-full"
            />
            {block.metadata?.caption && (
              <p className="text-xs text-[#865014]/60 italic">{block.metadata.caption}</p>
            )}
          </div>
        );
      case 'video':
        return (
          <div className="space-y-2">
            <video controls className="rounded-lg w-full max-h-96">
              <source src={block.metadata?.url} />
              Your browser does not support the video tag.
            </video>
            {block.metadata?.caption && (
              <p className="text-xs text-[#865014]/60 italic">{block.metadata.caption}</p>
            )}
          </div>
        );
      case 'link':
        return (
          <a 
            href={block.metadata?.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[#865014] hover:underline flex items-center gap-2"
          >
            <Link className="h-4 w-4" />
            {block.metadata?.caption || block.content}
          </a>
        );
      case 'audio':
        return (
          <div className="space-y-2">
            <audio controls className="w-full">
              <source src={block.metadata?.url} />
              Your browser does not support the audio tag.
            </audio>
            {block.metadata?.caption && (
              <p className="text-xs text-[#865014]/60 italic">{block.metadata.caption}</p>
            )}
          </div>
        );
      case 'file':
        return (
          <a 
            href={block.metadata?.url} 
            download
            className="flex items-center gap-3 p-3 rounded-lg border border-[#E0AE3F]/20 hover:bg-[#F6EBD8] transition-colors"
          >
            <File className="h-5 w-5 text-[#865014]" />
            <div className="flex-1">
              <p className="text-sm font-medium text-[#1a1a1a]">{block.content}</p>
              {block.metadata?.fileSize && (
                <p className="text-xs text-[#865014]/40">{(block.metadata.fileSize / 1024).toFixed(1)} KB</p>
              )}
            </div>
            <Download className="h-4 w-4 text-[#865014]/40" />
          </a>
        );
      default:
        return null;
    }
  };

  return (
    <SidebarLayout userRole="teacher" userName={user.full_name} userEmail={user.email} activeView={activeView}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1a1a1a] flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-[#865014]" />
              Manage Courses
            </h1>
            <p className="text-sm text-[#865014]/60">
              Create and manage course content, chapters, and student progress
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="border-[#E0AE3F]/20 hover:bg-[#F6EBD8] text-[#865014]"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button 
              className="bg-[#865014] hover:bg-[#865014]/90 text-white"
              onClick={() => setActiveDialog('course')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Course
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="border-[#E0AE3F]/10">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs text-[#865014]/60">Total Courses</CardDescription>
              <CardTitle className="text-2xl text-[#1a1a1a]">{courses.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-[#E0AE3F]/10">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs text-[#865014]/60">Total Students</CardDescription>
              <CardTitle className="text-2xl text-[#1a1a1a]">
                {courses.reduce((sum, c) => sum + c.students, 0)}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-[#E0AE3F]/10">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs text-[#865014]/60">Pending Reviews</CardDescription>
              <CardTitle className="text-2xl text-[#1a1a1a]">
                {courses.reduce((sum, c) => sum + c.pendingReviews, 0)}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-[#E0AE3F]/10">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs text-[#865014]/60">Feedback Notes</CardDescription>
              <CardTitle className="text-2xl text-[#1a1a1a]">
                {courses.reduce((sum, c) => sum + c.feedbackCount, 0)}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Course List & Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Course List */}
          <Card className="lg:col-span-4 border-[#E0AE3F]/10">
            <CardHeader>
              <CardTitle className="text-[#1a1a1a]">My Courses</CardTitle>
              <CardDescription className="text-[#865014]/50">Select a course to manage</CardDescription>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#865014]/40" />
                <Input
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30 text-sm"
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
              {courses.map((course) => (
                <button
                  key={course.id}
                  onClick={() => setSelectedCourseId(course.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selectedCourseId === course.id 
                      ? 'border-[#865014] bg-[#F6EBD8]/50 shadow-sm' 
                      : 'border-[#E0AE3F]/10 hover:border-[#E0AE3F]/30 hover:bg-[#F6EBD8]/30'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[#1a1a1a] truncate">{course.title}</p>
                      <p className="text-xs text-[#865014]/60 mt-1">
                        {course.students} students • {course.totalChapters} chapters
                      </p>
                    </div>
                    <Badge className={
                      course.status === 'published' ? 'bg-emerald-500' :
                      course.status === 'submitted' ? 'bg-blue-500' :
                      course.status === 'approved' ? 'bg-green-500' :
                      'bg-gray-500'
                    }>
                      {course.status}
                    </Badge>
                  </div>
                  <Progress value={(course.completedChapters / course.totalChapters) * 100 || 0} className="mt-3 h-1.5" />
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Course Detail */}
          <div className="lg:col-span-8 space-y-6">
            {/* Course Overview */}
            <Card className="border-[#E0AE3F]/10">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-[#1a1a1a]">{selectedCourse.title}</CardTitle>
                    <CardDescription className="text-[#865014]/50">{selectedCourse.description}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={
                      selectedCourse.status === 'published' ? 'bg-emerald-500' :
                      selectedCourse.status === 'submitted' ? 'bg-blue-500' :
                      selectedCourse.status === 'approved' ? 'bg-green-500' :
                      'bg-gray-500'
                    }>
                      {selectedCourse.status}
                    </Badge>
                    {selectedCourse.status === 'draft' && (
                      <Button 
                        size="sm"
                        className="bg-[#865014] hover:bg-[#865014]/90 text-white"
                        onClick={() => submitForApproval(selectedCourse.id)}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Submit for Approval
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4 rounded-lg overflow-hidden">
                  <img 
                    src={selectedCourse.imageUrl} 
                    alt={selectedCourse.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-3 rounded-lg bg-[#F6EBD8]/30">
                    <p className="text-xs text-[#865014]/60">Students</p>
                    <p className="text-lg font-bold text-[#1a1a1a]">{selectedCourse.students}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#F6EBD8]/30">
                    <p className="text-xs text-[#865014]/60">Chapters</p>
                    <p className="text-lg font-bold text-[#1a1a1a]">{selectedCourse.totalChapters}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#F6EBD8]/30">
                    <p className="text-xs text-[#865014]/60">Level</p>
                    <p className="text-lg font-bold text-[#1a1a1a] capitalize">{selectedCourse.level}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#F6EBD8]/30">
                    <p className="text-xs text-[#865014]/60">Version</p>
                    <p className="text-lg font-bold text-[#1a1a1a]">v{selectedCourse.version}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedCourse.tags.map((tag, i) => (
                    <Badge key={i} variant="outline" className="border-[#E0AE3F]/30 text-[#865014]">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Course Sections */}
            <Card className="border-[#E0AE3F]/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-[#1a1a1a]">Course Content</CardTitle>
                    <CardDescription className="text-[#865014]/50">Sections and chapters</CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-[#E0AE3F]/20 hover:bg-[#F6EBD8] text-[#865014]"
                    onClick={() => setActiveDialog('section')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Section
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedCourse.sections.map((section) => (
                  <div key={section.id} className="rounded-xl border border-[#E0AE3F]/10 overflow-hidden">
                    <div className="flex items-center justify-between p-4 bg-[#F6EBD8]/20">
                      <div>
                        <p className="font-medium text-[#1a1a1a]">{section.title}</p>
                        <p className="text-xs text-[#865014]/60">{section.chapters.length} chapters</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-[#865014] hover:bg-[#F6EBD8]"
                          onClick={() => {
                            setEditingSection(section);
                            setActiveDialog('section');
                          }}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-[#865014] hover:bg-[#F6EBD8]"
                          onClick={() => {
                            setEditingSection(section);
                            setActiveDialog('chapter');
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      {section.chapters.map((chapter) => (
                        <div 
                          key={chapter.id}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-[#F6EBD8]/30 transition-colors border border-transparent hover:border-[#E0AE3F]/20 cursor-pointer"
                          onClick={() => openChapterEditor(section, chapter)}
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-[#1a1a1a]">{chapter.title}</p>
                            <p className="text-xs text-[#865014]/60 mt-1">
                              {chapter.blocks.length} blocks • {chapter.status}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={
                              chapter.status === 'published' ? 'bg-emerald-500' :
                              chapter.status === 'submitted' ? 'bg-blue-500' :
                              chapter.status === 'approved' ? 'bg-green-500' :
                              'bg-gray-500'
                            }>
                              {chapter.status}
                            </Badge>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-[#865014] hover:bg-[#F6EBD8]"
                              onClick={(e) => {
                                e.stopPropagation();
                                openChapterEditor(section, chapter);
                              }}
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Student Progress */}
            <Card className="border-[#E0AE3F]/10">
              <CardHeader>
                <CardTitle className="text-[#1a1a1a]">Student Progress</CardTitle>
                <CardDescription className="text-[#865014]/50">Track student engagement and performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-lg bg-[#F6EBD8]/30 text-center">
                    <p className="text-2xl font-bold text-[#1a1a1a]">45</p>
                    <p className="text-xs text-[#865014]/60">Total Students</p>
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-50/50 text-center">
                    <p className="text-2xl font-bold text-emerald-600">32</p>
                    <p className="text-xs text-emerald-600">On Track</p>
                  </div>
                  <div className="p-3 rounded-lg bg-amber-50/50 text-center">
                    <p className="text-2xl font-bold text-amber-600">8</p>
                    <p className="text-xs text-amber-600">Needs Review</p>
                  </div>
                  <div className="p-3 rounded-lg bg-red-50/50 text-center">
                    <p className="text-2xl font-bold text-red-600">5</p>
                    <p className="text-xs text-red-600">At Risk</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Create Course Dialog */}
      <Dialog open={activeDialog === 'course'} onOpenChange={() => setActiveDialog(null)}>
        <DialogContent className="max-w-2xl border-[#E0AE3F]/20">
          <DialogHeader>
            <DialogTitle className="text-[#1a1a1a]">Create New Course</DialogTitle>
            <DialogDescription className="text-[#865014]/60">Set up a new course with basic information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-[#1a1a1a]">Course Title</Label>
              <Input 
                value={courseDraft.title || ''}
                onChange={(e) => setCourseDraft({ ...courseDraft, title: e.target.value })}
                className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30"
                placeholder="Enter course title"
              />
            </div>
            <div>
              <Label className="text-[#1a1a1a]">Description</Label>
              <Textarea 
                value={courseDraft.description || ''}
                onChange={(e) => setCourseDraft({ ...courseDraft, description: e.target.value })}
                className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30"
                placeholder="Enter course description"
                rows={3}
              />
            </div>
            <div>
              <Label className="text-[#1a1a1a]">Course Image</Label>
              <Input 
                value={courseDraft.imageUrl || ''}
                onChange={(e) => setCourseDraft({ ...courseDraft, imageUrl: e.target.value })}
                className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30"
                placeholder="Paste image URL"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-[#1a1a1a]">Level</Label>
                <select 
                  className="w-full px-3 py-2 rounded-lg border border-[#E0AE3F]/20 focus:ring-2 focus:ring-[#865014]/30 focus:outline-none"
                  value={courseDraft.level || 'beginner'}
                  onChange={(e) => setCourseDraft({ ...courseDraft, level: e.target.value as any })}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div>
                <Label className="text-[#1a1a1a]">Estimated Time (minutes)</Label>
                <Input 
                  type="number"
                  value={courseDraft.estimatedTime || ''}
                  onChange={(e) => setCourseDraft({ ...courseDraft, estimatedTime: parseInt(e.target.value) || 0 })}
                  className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30"
                  placeholder="120"
                />
              </div>
            </div>
            <div>
              <Label className="text-[#1a1a1a]">Tags</Label>
              <Input 
                value={courseDraft.tags?.join(', ') || ''}
                onChange={(e) => setCourseDraft({ ...courseDraft, tags: e.target.value.split(',').map(t => t.trim()) })}
                className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30"
                placeholder="Biblical Studies, Theology (comma separated)"
              />
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t border-[#E0AE3F]/10">
              <Button variant="outline" onClick={() => setActiveDialog(null)} className="border-[#E0AE3F]/20 hover:bg-[#F6EBD8]">
                Cancel
              </Button>
              <Button className="bg-[#865014] hover:bg-[#865014]/90 text-white" onClick={createCourse}>
                <Plus className="h-4 w-4 mr-2" />
                Create Course
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Section Dialog */}
      <Dialog open={activeDialog === 'section'} onOpenChange={() => setActiveDialog(null)}>
        <DialogContent className="max-w-md border-[#E0AE3F]/20">
          <DialogHeader>
            <DialogTitle className="text-[#1a1a1a]">
              {editingSection ? 'Edit Section' : 'Add New Section'}
            </DialogTitle>
            <DialogDescription className="text-[#865014]/60">
              {editingSection ? 'Update section details' : 'Create a new section for your course'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-[#1a1a1a]">Section Title</Label>
              <Input 
                value={sectionDraft.title || editingSection?.title || ''}
                onChange={(e) => setSectionDraft({ ...sectionDraft, title: e.target.value })}
                className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30"
                placeholder="Enter section title"
              />
            </div>
            <div>
              <Label className="text-[#1a1a1a]">Description</Label>
              <Textarea 
                value={sectionDraft.description || editingSection?.description || ''}
                onChange={(e) => setSectionDraft({ ...sectionDraft, description: e.target.value })}
                className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30"
                placeholder="Enter section description"
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t border-[#E0AE3F]/10">
              <Button variant="outline" onClick={() => setActiveDialog(null)} className="border-[#E0AE3F]/20 hover:bg-[#F6EBD8]">
                Cancel
              </Button>
              <Button 
                className="bg-[#865014] hover:bg-[#865014]/90 text-white"
                onClick={() => {
                  if (editingSection) {
                    // Update existing section
                    setCourses(courses.map(course => 
                      course.id === selectedCourseId 
                        ? {
                            ...course,
                            sections: course.sections.map(section =>
                              section.id === editingSection.id
                                ? { ...section, ...sectionDraft }
                                : section
                            ),
                            updatedAt: new Date().toISOString()
                          }
                        : course
                    ));
                  } else {
                    // Add new section
                    const newSection: Section = {
                      id: Date.now(),
                      title: sectionDraft.title || 'New Section',
                      description: sectionDraft.description || '',
                      chapters: [],
                      order: selectedCourse.sections.length,
                      status: 'draft'
                    };
                    setCourses(courses.map(course => 
                      course.id === selectedCourseId 
                        ? { ...course, sections: [...course.sections, newSection], updatedAt: new Date().toISOString() }
                        : course
                    ));
                  }
                  setActiveDialog(null);
                  setSectionDraft({});
                  setEditingSection(null);
                }}
              >
                <Save className="h-4 w-4 mr-2" />
                {editingSection ? 'Update Section' : 'Add Section'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Chapter Dialog */}
      <Dialog open={activeDialog === 'chapter'} onOpenChange={() => setActiveDialog(null)}>
        <DialogContent className="max-w-md border-[#E0AE3F]/20">
          <DialogHeader>
            <DialogTitle className="text-[#1a1a1a]">Add New Chapter</DialogTitle>
            <DialogDescription className="text-[#865014]/60">
              Add a new chapter to the section
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-[#1a1a1a]">Chapter Title</Label>
              <Input 
                value={chapterDraft.title || ''}
                onChange={(e) => setChapterDraft({ ...chapterDraft, title: e.target.value })}
                className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30"
                placeholder="Enter chapter title"
              />
            </div>
            <div>
              <Label className="text-[#1a1a1a]">Content Preview</Label>
              <Textarea 
                value={chapterDraft.content || ''}
                onChange={(e) => setChapterDraft({ ...chapterDraft, content: e.target.value })}
                className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30"
                placeholder="Brief content overview"
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t border-[#E0AE3F]/10">
              <Button variant="outline" onClick={() => setActiveDialog(null)} className="border-[#E0AE3F]/20 hover:bg-[#F6EBD8]">
                Cancel
              </Button>
              <Button 
                className="bg-[#865014] hover:bg-[#865014]/90 text-white"
                onClick={createChapter}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Chapter
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Content Editor Dialog */}
      <Dialog open={activeDialog === 'content'} onOpenChange={() => setActiveDialog(null)}>
        <DialogContent className="max-w-4xl border-[#E0AE3F]/20 max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-[#1a1a1a]">Edit Chapter Content</DialogTitle>
            <DialogDescription className="text-[#865014]/60">
              {editingChapter?.title} • Add text, images, videos, and more
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col h-[calc(90vh-200px)]">
            <Tabs defaultValue="editor" className="flex-1 flex flex-col">
              <TabsList className="bg-[#F6EBD8]/30">
                <TabsTrigger value="editor" className="data-[state=active]:bg-white">Editor</TabsTrigger>
                <TabsTrigger value="preview" className="data-[state=active]:bg-white">Preview</TabsTrigger>
              </TabsList>
              <TabsContent value="editor" className="flex-1 flex flex-col gap-4 pt-4 overflow-auto">
                {/* Toolbar */}
                <div className="flex flex-wrap gap-2 p-2 rounded-lg bg-[#F6EBD8]/20 border border-[#E0AE3F]/10">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-8 border-[#E0AE3F]/20 text-[#865014]"
                    onClick={() => addContentBlock('header')}
                  >
                    <Hash className="h-4 w-4 mr-1" />
                    Header
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-8 border-[#E0AE3F]/20 text-[#865014]"
                    onClick={() => addContentBlock('paragraph')}
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    Paragraph
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-8 border-[#E0AE3F]/20 text-[#865014]"
                    onClick={() => imageInputRef.current?.click()}
                  >
                    <Image className="h-4 w-4 mr-1" />
                    Image
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-8 border-[#E0AE3F]/20 text-[#865014]"
                    onClick={() => videoInputRef.current?.click()}
                  >
                    <Video className="h-4 w-4 mr-1" />
                    Video
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-8 border-[#E0AE3F]/20 text-[#865014]"
                    onClick={() => audioInputRef.current?.click()}
                  >
                    <Music className="h-4 w-4 mr-1" />
                    Audio
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-8 border-[#E0AE3F]/20 text-[#865014]"
                    onClick={() => {
                      const url = prompt('Enter link URL:');
                      if (url) handleLinkUpload(url, 'link');
                    }}
                  >
                    <Link className="h-4 w-4 mr-1" />
                    Link
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-8 border-[#E0AE3F]/20 text-[#865014]"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <File className="h-4 w-4 mr-1" />
                    File
                  </Button>
                </div>

                {/* Hidden file inputs */}
                <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                <input ref={videoInputRef} type="file" accept="video/*" className="hidden" onChange={(e) => handleFileUpload(e, 'video')} />
                <input ref={audioInputRef} type="file" accept="audio/*" className="hidden" onChange={(e) => handleFileUpload(e, 'audio')} />
                <input ref={fileInputRef} type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'file')} />

                {/* Content Blocks */}
                <div className="flex-1 space-y-3 overflow-auto">
                  {blocks.map((block) => (
                    <div 
                      key={block.id}
                      className={`p-3 rounded-lg border transition-all ${
                        selectedBlockId === block.id 
                          ? 'border-[#865014] bg-[#F6EBD8]/50' 
                          : 'border-[#E0AE3F]/20 hover:border-[#E0AE3F]/40'
                      }`}
                      onClick={() => setSelectedBlockId(block.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex flex-col gap-1">
                          <button 
                            className="p-1 rounded hover:bg-[#F6EBD8] text-[#865014]/40"
                            onClick={() => moveContentBlock(block.id, 'up')}
                          >
                            <ChevronRight className="h-4 w-4 rotate-[-90deg]" />
                          </button>
                          <button 
                            className="p-1 rounded hover:bg-[#F6EBD8] text-[#865014]/40"
                            onClick={() => moveContentBlock(block.id, 'down')}
                          >
                            <ChevronRight className="h-4 w-4 rotate-90" />
                          </button>
                          <button 
                            className="p-1 rounded hover:bg-red-50 text-red-400"
                            onClick={() => removeContentBlock(block.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs border-[#E0AE3F]/20 text-[#865014]">
                              {block.type}
                            </Badge>
                          </div>
                          {block.type === 'image' && (
                            <div className="space-y-2">
                              <Input 
                                value={block.metadata?.url || ''}
                                onChange={(e) => updateContentBlock(block.id, block.content, { ...block.metadata, url: e.target.value })}
                                className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30"
                                placeholder="Image URL"
                              />
                              <Input 
                                value={block.metadata?.caption || ''}
                                onChange={(e) => updateContentBlock(block.id, block.content, { ...block.metadata, caption: e.target.value })}
                                className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30"
                                placeholder="Caption"
                              />
                            </div>
                          )}
                          {block.type === 'header' && (
                            <Input 
                              value={block.content}
                              onChange={(e) => updateContentBlock(block.id, e.target.value)}
                              className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30 text-lg font-bold"
                              placeholder="Header text"
                            />
                          )}
                          {block.type === 'paragraph' && (
                            <Textarea 
                              value={block.content}
                              onChange={(e) => updateContentBlock(block.id, e.target.value)}
                              className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30"
                              placeholder="Paragraph content"
                              rows={3}
                            />
                          )}
                          {(block.type === 'video' || block.type === 'audio' || block.type === 'link') && (
                            <div className="space-y-2">
                              <Input 
                                value={block.metadata?.url || ''}
                                onChange={(e) => updateContentBlock(block.id, block.content, { ...block.metadata, url: e.target.value })}
                                className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30"
                                placeholder={`${block.type} URL`}
                              />
                              <Input 
                                value={block.metadata?.caption || ''}
                                onChange={(e) => updateContentBlock(block.id, block.content, { ...block.metadata, caption: e.target.value })}
                                className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30"
                                placeholder="Caption"
                              />
                            </div>
                          )}
                          {block.type === 'file' && (
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-[#865014]/60">{block.content}</span>
                              <span className="text-xs text-[#865014]/40">
                                {(block.metadata?.fileSize || 0 / 1024).toFixed(1)} KB
                              </span>
                            </div>
                          )}
                          {block.type === 'image' && block.metadata?.url && (
                            <img 
                              src={block.metadata.url} 
                              alt="Preview" 
                              className="mt-2 rounded-lg max-h-48 object-contain"
                            />
                          )}
                          {block.type === 'video' && block.metadata?.url && (
                            <video controls className="mt-2 rounded-lg max-h-48">
                              <source src={block.metadata.url} />
                            </video>
                          )}
                          {block.type === 'audio' && block.metadata?.url && (
                            <audio controls className="mt-2 w-full">
                              <source src={block.metadata.url} />
                            </audio>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="preview" className="flex-1 overflow-auto">
                <div className="prose max-w-none p-4">
                  {blocks.map((block) => (
                    <div key={block.id} className="mb-4">
                      {renderContentBlock(block)}
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
            <div className="flex justify-end gap-2 pt-4 border-t border-[#E0AE3F]/10">
              <Button variant="outline" onClick={() => setActiveDialog(null)} className="border-[#E0AE3F]/20 hover:bg-[#F6EBD8]">
                Cancel
              </Button>
              <Button 
                className="bg-[#865014] hover:bg-[#865014]/90 text-white"
                onClick={saveChapterContent}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Content
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarLayout>
  );
}