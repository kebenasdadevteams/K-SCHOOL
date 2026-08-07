import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Progress } from '../../components/ui/progress';
import { toast } from 'sonner';
import api from '../../services/api';
import { courseService } from '../../services/course-service';
import {
  Calendar,
  Clock,
  User,
  Tag,
  Filter,
  Grid,
  ArrowLeft,
  Loader2,
  CheckCircle,
  Archive,
  Pin,
  Star,
  TrendingUp,
  Copy,
  Share2,
  Mail,
  Printer,
  Monitor,
  Tablet,
  Smartphone,
  Upload,
  Video,
  Music,
  File,
  Rocket,
  X,
  Eye,
  Edit3,
  Trash2,
  Plus,
  Search,
  RefreshCw,
  Save,
  Send,
  Image,
  MapPin,
  Map,
  UserPlus,
  CalendarDays,
  MessageCircle,
  Heart,
  AlertTriangle,
  CalendarRange,
  BookOpen,
  Layers,
  Target,
  Award,
  ChevronRight,
  ChevronDown,
  FileText,
  Link as LinkIcon,
  Code,
  Quote,
  List as ListIcon,
  Hash,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  ListOrdered,
  Table,
  PlusCircle,
  Info,
  HelpCircle,
  Book,
  Library,
  Newspaper,
  Notebook,
  PenTool,
  Compass,
  Flag,
  Trophy,
  Medal,
  BadgeCheck,
  Verified,
  ShieldCheck,
  ShieldAlert,
  Server,
  Database,
  Cloud,
  CloudOff,
  Wifi,
  WifiOff,
  Signal,
  SignalLow,
  SignalMedium,
  SignalHigh,
  Bluetooth,
  BluetoothConnected,
  BluetoothOff,
  Cast,
  CastConnected,
  CastOff,
  Headphones,
  Headset,
  Speaker,
  SpeakerOff,
  Volume1,
  Volume2,
  VolumeX,
  Radio,
  RadioTower,
  Podcast,
  Microphone,
  MicrophoneOff,
  Video as VideoIcon,
  VideoOff,
  Camera as CameraIcon,
  CameraOff,
  Image as ImageIcon,
  ImageOff,
  Film,
  Clapperboard,
  Tv,
  MonitorPlay,
  MonitorSmartphone,
  TabletSmartphone,
  LaptopMinimal,
  Computer,
  HardDrive,
  Cpu,
  MemoryStick,
  Battery,
  BatteryCharging,
  BatteryFull,
  BatteryLow,
  BatteryMedium,
  Plug,
  PlugZap,
  Power,
  PowerOff,
  Lightbulb,
  LightbulbOff,
  Fan,
  FanOff,
  Snowflake,
  Thermometer,
  ThermometerSnowflake,
  ThermometerSun,
  Sun as SunIcon,
  Moon as MoonIcon,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudFog,
  CloudSun,
  CloudMoon,
  Droplets,
  Wind,
  Waves,
  Umbrella,
  Rainbow,
  Star as StarIcon,
  Sparkles,
  Fire,
  Flame,
  Zap,
  Crown,
  Gem,
  Shield,
  Sword,
  Crosshair,
  Bullseye,
  Dices,
  Dice1,
  Dice2,
  Dice3,
  Dice4,
  Dice5,
  Dice6,
  Gamepad,
  Gamepad2,
  MoreHorizontal,
  MoreVertical,
  Copy as CopyIcon,
  Scissors,
  Link2,
  Paperclip,
  Mic,
  Camera,
  Laptop,
  Moon,
  Sun,
} from 'lucide-react';

// Types
type ContentBlock = {
  id: string;
  type: 'header' | 'paragraph' | 'image' | 'video' | 'audio' | 'link' | 'file' | 'reading_material' | 'quote' | 'code' | 'list' | 'table' | 'divider';
  content: string;
  metadata?: {
    url?: string;
    fileName?: string;
    fileSize?: number;
    altText?: string;
    caption?: string;
    alignment?: 'left' | 'center' | 'right';
    duration?: string;
    quality?: string;
    source?: string;
    mimeType?: string;
    items?: string[];
    language?: string;
    author?: string;
    rows?: string[][];
    headers?: string[];
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
  estimatedTime?: number;
  objectives?: string[];
  coverImage?: string;
  quiz?: {
    questions: {
      id: string;
      question: string;
      options: string[];
      correctAnswer: number;
    }[];
  };
  assignment?: {
    title: string;
    description: string;
    dueDate?: string;
    maxScore?: number;
  };
  resources?: {
    title: string;
    type: 'pdf' | 'doc' | 'ppt' | 'link' | 'video' | 'audio' | 'other';
    url: string;
  }[];
};

type Section = {
  id: number;
  title: string;
  description: string;
  chapters: Chapter[];
  order: number;
  status: 'draft' | 'submitted' | 'approved' | 'published';
  icon?: string;
  coverImage?: string;
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
  category?: string;
  language?: string;
  objectives?: string[];
  materials?: {
    type: 'pdf' | 'doc' | 'ppt' | 'link' | 'other';
    name: string;
    url: string;
    size?: string;
  }[];
  instructor?: string;
  institution?: string;
  rating?: number;
  reviews?: number;
  enrollmentLimit?: number;
  startDate?: string;
  endDate?: string;
  certificateAvailable?: boolean;
  featured?: boolean;
};

type CourseStats = {
  total: number;
  published: number;
  drafts: number;
  submitted: number;
  approved: number;
  archived: number;
  totalStudents: number;
  totalChapters: number;
};

type ManageCoursesProps = {
  mode?: 'manage' | 'create';
};

// Helper function to get image URL with fallback
const getImageUrl = (url: string | undefined): string => {
  if (!url) return '/placeholder-course.jpg';
  if (url.startsWith('/') || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return url;
};

export default function ManageCourses({ mode = 'manage' }: ManageCoursesProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const locationState = location.state as { role?: string; userName?: string; userEmail?: string; view?: string } | null;

  const [user] = useState({
    full_name: locationState?.userName || 'Teacher User',
    email: locationState?.userEmail || 'teacher@church.com',
    role: locationState?.role || 'teacher',
  });

  // States
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeDialog, setActiveDialog] = useState<null | 'course' | 'section' | 'chapter' | 'content' | 'preview' | 'materials' | 'publish' | 'delete' | 'chapter_content'>(null);
  
  // Content editing state
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  
  // Dialog drafts
  const [courseDraft, setCourseDraft] = useState<Partial<Course>>({});
  const [sectionDraft, setSectionDraft] = useState<Partial<Section>>({});
  const [chapterDraft, setChapterDraft] = useState<Partial<Chapter>>({});
  
  // File upload refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const materialInputRef = useRef<HTMLInputElement>(null);
  const contentImageInputRef = useRef<HTMLInputElement>(null);
  const contentFileInputRef = useRef<HTMLInputElement>(null);
  const contentVideoInputRef = useRef<HTMLInputElement>(null);
  const contentAudioInputRef = useRef<HTMLInputElement>(null);
  const contentMaterialInputRef = useRef<HTMLInputElement>(null);

  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [isUploading, setIsUploading] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile' | 'tablet'>('desktop');
  const [stats, setStats] = useState<CourseStats>({
    total: 0,
    published: 0,
    drafts: 0,
    submitted: 0,
    approved: 0,
    archived: 0,
    totalStudents: 0,
    totalChapters: 0,
  });

  const isCreateMode = mode === 'create' || location.pathname === '/teacher/courses/new' || location.pathname.endsWith('/new');

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (isCreateMode) {
      setSelectedCourse(null);
      setCourseDraft({});
      setActiveDialog('course');
    }
  }, [isCreateMode]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const { data } = await courseService.getAll();
      const coursesData = (data.data || []).map((course: any) => ({
        ...course,
        imageUrl: course.image_url || course.imageUrl || '',
        imageMode: course.image_url ? 'link' : 'link',
        sections: Array.isArray(course.sections)
          ? course.sections
          : course.sections
          ? JSON.parse(course.sections)
          : course.lessons
          ? [
              {
                id: 1,
                title: 'Course Content',
                description: course.description || '',
                order: 0,
                status: course.status || 'draft',
                chapters: course.lessons.map((lesson: any, index: number) => ({
                  id: lesson.id || index + 1,
                  title: lesson.title,
                  content: lesson.content,
                  blocks: lesson.blocks || [],
                  order: lesson.order_index || index,
                  status: 'published',
                  created_at: lesson.created_at || new Date().toISOString(),
                  updated_at: lesson.updated_at || new Date().toISOString(),
                })),
              },
            ]
          : [],
        students: course.students || 0,
        totalChapters: Array.isArray(course.sections)
          ? course.sections.reduce((sum: number, section: any) => sum + (section.chapters?.length || 0), 0)
          : course.lessons?.length || 0,
        materials: Array.isArray(course.materials) ? course.materials : course.materials ? JSON.parse(course.materials) : [],
        objectives: Array.isArray(course.objectives) ? course.objectives : course.objectives ? JSON.parse(course.objectives) : [],
        rating: course.rating || 0,
        reviews: course.reviews || 0,
      }));
      setCourses(coursesData);

      // Calculate stats
      const statsData = {
        total: coursesData.length,
        published: coursesData.filter((c: Course) => c.status === 'published').length,
        drafts: coursesData.filter((c: Course) => c.status === 'draft').length,
        submitted: coursesData.filter((c: Course) => c.status === 'submitted').length,
        approved: coursesData.filter((c: Course) => c.status === 'approved').length,
        archived: coursesData.filter((c: Course) => c.status === 'archived').length,
        totalStudents: coursesData.reduce((sum: number, c: Course) => sum + (c.students || 0), 0),
        totalChapters: coursesData.reduce((sum: number, c: Course) => sum + (c.totalChapters || 0), 0),
      };
      setStats(statsData);
    } catch (error) {
      toast.error('Unable to load your courses');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsUploading(true);
      const fileId = `upload-${Date.now()}`;
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));
      
      const response = await api.post('/courses/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setUploadProgress(prev => ({ ...prev, [fileId]: progress }));
        }
      });

      setTimeout(() => {
        setUploadProgress(prev => {
          const newPrev = { ...prev };
          delete newPrev[fileId];
          return newPrev;
        });
      }, 1000);

      return response.data.data.url;
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload file');
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  // Content block handlers
  const addContentBlock = (type: ContentBlock['type']) => {
    const newBlock: ContentBlock = {
      id: `block-${Date.now()}`,
      type,
      content: '',
      metadata: {}
    };
    setBlocks([...blocks, newBlock]);
    setSelectedBlockId(newBlock.id);
    setTimeout(() => {
      const element = document.getElementById(newBlock.id);
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
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

  const duplicateContentBlock = (id: string) => {
    const block = blocks.find(b => b.id === id);
    if (!block) return;
    const newBlock: ContentBlock = {
      ...block,
      id: `block-${Date.now()}`,
      content: block.content + ' (copy)',
    };
    const index = blocks.findIndex(b => b.id === id);
    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, newBlock);
    setBlocks(newBlocks);
    setSelectedBlockId(newBlock.id);
  };

  // File upload handlers for content
  const handleContentFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: ContentBlock['type']) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadFile(file);
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      const isAudio = file.type.startsWith('audio/');

      const newBlock: ContentBlock = {
        id: `block-${Date.now()}`,
        type: isImage ? 'image' : isVideo ? 'video' : isAudio ? 'audio' : type,
        content: file.name,
        metadata: {
          url,
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
          altText: file.name,
          caption: file.name,
        }
      };
      setBlocks([...blocks, newBlock]);
      setSelectedBlockId(newBlock.id);
      toast.success(`📎 ${file.name} uploaded successfully`);
    } catch (error) {
      // Handle error
    }
    event.target.value = '';
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      const newBlock: ContentBlock = {
        id: `block-${Date.now()}`,
        type: 'image',
        content: file.name,
        metadata: { 
          url,
          fileName: file.name, 
          fileSize: file.size,
          altText: file.name,
          mimeType: file.type
        }
      };
      setBlocks([...blocks, newBlock]);
      setSelectedBlockId(newBlock.id);
      event.target.value = '';
    };
    reader.readAsDataURL(file);
  };

  const handleReadingMaterialUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      const newBlock: ContentBlock = {
        id: `block-${Date.now()}`,
        type: 'reading_material',
        content: file.name,
        metadata: { 
          url, 
          fileName: file.name, 
          fileSize: file.size,
          mimeType: file.type
        }
      };
      setBlocks([...blocks, newBlock]);
      setSelectedBlockId(newBlock.id);
      event.target.value = '';
    };
    reader.readAsDataURL(file);
  };

  const handleLinkUpload = (url: string, type: 'link' | 'video' | 'audio' | 'reading_material') => {
    const newBlock: ContentBlock = {
      id: `block-${Date.now()}`,
      type,
      content: url,
      metadata: { 
        url,
        source: 'external'
      }
    };
    setBlocks([...blocks, newBlock]);
    setSelectedBlockId(newBlock.id);
  };

  // Course CRUD operations
  const createCourse = async () => {
    try {
      setSaving(true);
      const payload = {
        title: courseDraft.title || 'New Course',
        description: courseDraft.description || '',
        category: courseDraft.category || 'General',
        status: 'draft',
        level: courseDraft.level || 'beginner',
        estimatedTime: courseDraft.estimatedTime || 0,
        tags: courseDraft.tags || [],
        prerequisites: courseDraft.prerequisites || [],
        objectives: courseDraft.objectives || [],
        language: courseDraft.language || 'English',
        instructor: courseDraft.instructor || user.full_name,
        institution: courseDraft.institution || '',
        enrollmentLimit: courseDraft.enrollmentLimit || 0,
        certificateAvailable: courseDraft.certificateAvailable || false,
        featured: courseDraft.featured || false,
        image_url: courseDraft.imageUrl || '',
      };

      const { data } = await courseService.create(payload);
      const newCourse = {
        id: data.data.id,
        ...payload,
        imageUrl: courseDraft.imageUrl || '',
        imageMode: 'link' as const,
        sections: [],
        students: 0,
        totalChapters: 0,
        completedChapters: 0,
        pendingReviews: 0,
        feedbackCount: 0,
        nextLesson: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastModifiedBy: user.full_name,
        version: 1,
        materials: [],
        rating: 0,
        reviews: 0,
      } as Course;
      
      setCourses([...courses, newCourse]);
      setActiveDialog(null);
      setCourseDraft({});
      navigate(`/teacher/courses/${newCourse.id}`);
      toast.success('🎉 Course created successfully! Ready to build your content.');
    } catch (error) {
      console.error(error);
      toast.error('Failed to create course');
    } finally {
      setSaving(false);
    }
  };

  const updateCourse = async () => {
    if (!selectedCourse) return;

    try {
      setSaving(true);
      const payload = {
        title: courseDraft.title || selectedCourse.title,
        description: courseDraft.description || selectedCourse.description,
        category: courseDraft.category || selectedCourse.category || 'General',
        level: courseDraft.level || selectedCourse.level,
        estimatedTime: courseDraft.estimatedTime || selectedCourse.estimatedTime,
        tags: courseDraft.tags || selectedCourse.tags || [],
        prerequisites: courseDraft.prerequisites || selectedCourse.prerequisites || [],
        objectives: courseDraft.objectives || selectedCourse.objectives || [],
        language: courseDraft.language || selectedCourse.language || 'English',
        image_url: courseDraft.imageUrl || selectedCourse.imageUrl,
        instructor: courseDraft.instructor || selectedCourse.instructor || user.full_name,
        institution: courseDraft.institution || selectedCourse.institution || '',
        enrollmentLimit: courseDraft.enrollmentLimit || selectedCourse.enrollmentLimit || 0,
        certificateAvailable: courseDraft.certificateAvailable !== undefined ? courseDraft.certificateAvailable : selectedCourse.certificateAvailable || false,
        featured: courseDraft.featured !== undefined ? courseDraft.featured : selectedCourse.featured || false,
      };

      await courseService.update(String(selectedCourse.id), payload);
      setCourses(courses.map((course) =>
        course.id === selectedCourse.id
          ? { 
              ...course, 
              ...payload, 
              imageUrl: payload.image_url || course.imageUrl,
              updatedAt: new Date().toISOString(), 
              version: course.version + 1 
            }
          : course
      ));
      setActiveDialog(null);
      setCourseDraft({});
      toast.success('✅ Course updated successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update course');
    } finally {
      setSaving(false);
    }
  };

  const deleteCourse = async (courseId: number) => {
    if (!confirm('⚠️ Are you sure you want to permanently delete this course? This action cannot be undone.')) return;

    try {
      setSaving(true);
      await courseService.delete(String(courseId));
      setCourses(courses.filter(c => c.id !== courseId));
      if (selectedCourse?.id === courseId) {
        setSelectedCourse(null);
        navigate('/teacher/courses');
      }
      toast.success('🗑️ Course deleted successfully');
      loadCourses();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete course');
    } finally {
      setSaving(false);
    }
  };

  const publishCourse = async (courseId: number) => {
    try {
      setSaving(true);
      await courseService.update(String(courseId), { status: 'published' });
      setCourses(courses.map((course) =>
        course.id === courseId
          ? { ...course, status: 'published' as const, publishedAt: new Date().toISOString() }
          : course
      ));
      setActiveDialog(null);
      toast.success('🎊 Course published successfully!');
      loadCourses();
    } catch (error) {
      console.error(error);
      toast.error('Failed to publish course');
    } finally {
      setSaving(false);
    }
  };

  // Section CRUD operations
  const createSection = () => {
    if (!selectedCourse) return;

    const newSection: Section = {
      id: Date.now(),
      title: sectionDraft.title || 'New Section',
      description: sectionDraft.description || '',
      chapters: [],
      order: selectedCourse.sections?.length || 0,
      status: 'draft',
      icon: sectionDraft.icon || '📚'
    };

    setCourses(courses.map(course => 
      course.id === selectedCourse.id 
        ? { 
            ...course, 
            sections: [...(course.sections || []), newSection], 
            updatedAt: new Date().toISOString() 
          }
        : course
    ));
    setActiveDialog(null);
    setSectionDraft({});
    setEditingSection(null);
    toast.success('📋 Section created!');
  };

  const updateSection = () => {
    if (!selectedCourse || !editingSection) return;

    setCourses(courses.map(course => 
      course.id === selectedCourse.id 
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
    setActiveDialog(null);
    setSectionDraft({});
    setEditingSection(null);
    toast.success('📝 Section updated!');
  };

  const deleteSection = (sectionId: number) => {
    if (!selectedCourse) return;
    if (!confirm('Are you sure you want to delete this section and all its chapters?')) return;

    setCourses(courses.map(course => 
      course.id === selectedCourse.id 
        ? {
            ...course,
            sections: course.sections.filter(section => section.id !== sectionId),
            totalChapters: course.totalChapters - (course.sections.find(s => s.id === sectionId)?.chapters?.length || 0),
            updatedAt: new Date().toISOString()
          }
        : course
    ));
    toast.success('🗑️ Section deleted');
  };

  // Chapter CRUD operations
  const createChapter = () => {
    if (!selectedCourse || !editingSection) return;
    
    const newChapter: Chapter = {
      id: Date.now(),
      title: chapterDraft.title || 'New Chapter',
      content: chapterDraft.content || '',
      blocks: [],
      order: editingSection.chapters?.length || 0,
      status: 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      estimatedTime: chapterDraft.estimatedTime || 30,
      objectives: chapterDraft.objectives || [],
      coverImage: chapterDraft.coverImage || '',
    };

    setCourses(courses.map(course => 
      course.id === selectedCourse.id 
        ? {
            ...course,
            sections: course.sections.map(section => 
              section.id === editingSection.id 
                ? { ...section, chapters: [...(section.chapters || []), newChapter] }
                : section
            ),
            totalChapters: (course.totalChapters || 0) + 1,
            updatedAt: new Date().toISOString()
          }
        : course
    ));
    setActiveDialog(null);
    setChapterDraft({});
    setEditingSection(null);
    toast.success('📖 Chapter created successfully!');
  };

  const updateChapter = () => {
    if (!selectedCourse || !editingChapter || !editingSection) return;

    setCourses(courses.map(course => 
      course.id === selectedCourse.id 
        ? {
            ...course,
            sections: course.sections.map(section => 
              section.id === editingSection.id 
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
    setEditingSection(null);
    toast.success('📝 Chapter updated!');
  };

  const deleteChapter = (sectionId: number, chapterId: number) => {
    if (!selectedCourse) return;
    if (!confirm('Are you sure you want to delete this chapter?')) return;

    setCourses(courses.map(course => 
      course.id === selectedCourse.id 
        ? {
            ...course,
            sections: course.sections.map(section => 
              section.id === sectionId 
                ? {
                    ...section,
                    chapters: section.chapters.filter(chapter => chapter.id !== chapterId)
                  }
                : section
            ),
            totalChapters: (course.totalChapters || 0) - 1,
            updatedAt: new Date().toISOString()
          }
        : course
    ));
    toast.success('🗑️ Chapter deleted');
  };

  const openChapterEditor = (section: Section, chapter: Chapter) => {
    setEditingSection(section);
    setEditingChapter(chapter);
    setBlocks(chapter.blocks || []);
    setChapterDraft(chapter);
    setActiveDialog('chapter_content');
  };

  const saveChapterContent = () => {
    if (!editingChapter || !editingSection || !selectedCourse) return;

    const updatedChapter = {
      ...editingChapter,
      blocks: blocks,
      content: blocks.filter(b => b.type === 'paragraph' || b.type === 'header').map(b => b.content).join('\n'),
      updated_at: new Date().toISOString()
    };

    setCourses(courses.map(course => 
      course.id === selectedCourse.id 
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
    toast.success('💾 Chapter content saved!');
  };

  // Render content block
  const renderContentBlock = (block: ContentBlock) => {
    switch (block.type) {
      case 'header':
        return <h3 className="text-xl font-bold text-[#1a1a1a]">{block.content}</h3>;
      case 'paragraph':
        return <p className="text-sm text-[#1a1a1a] leading-relaxed">{block.content}</p>;
      case 'image':
        const imageUrl = block.metadata?.url || '';
        return (
          <div className="space-y-2">
            {imageUrl ? (
              <img 
                src={getImageUrl(imageUrl)} 
                alt={block.metadata?.altText || block.content}
                className="rounded-lg max-w-full max-h-96 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                }}
              />
            ) : (
              <div className="bg-gray-100 rounded-lg p-8 text-center text-gray-400">
                <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                <p>No image uploaded</p>
              </div>
            )}
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
            <LinkIcon className="h-4 w-4" />
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
      case 'reading_material':
        return (
          <div className="flex items-center gap-3 p-3 rounded-lg border-2 border-[#E0AE3F]/30 bg-[#F6EBD8]/20 hover:bg-[#F6EBD8]/40 transition-colors">
            <FileArchive className="h-6 w-6 text-[#865014]" />
            <div className="flex-1">
              <p className="text-sm font-medium text-[#1a1a1a]">{block.content}</p>
              <div className="flex items-center gap-3 mt-1">
                {block.metadata?.fileSize && (
                  <span className="text-xs text-[#865014]/40">{(block.metadata.fileSize / 1024).toFixed(1)} KB</span>
                )}
                <Badge variant="outline" className="text-xs border-[#E0AE3F]/30 text-[#865014]">
                  Reading Material
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="text-[#865014] hover:bg-[#F6EBD8]">
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-[#865014] hover:bg-[#F6EBD8]">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      case 'quote':
        return (
          <blockquote className="border-l-4 border-[#865014] pl-4 py-2 italic text-[#1a1a1a]">
            <p className="text-sm">{block.content}</p>
            {block.metadata?.author && (
              <footer className="text-xs text-[#865014]/60 mt-1">— {block.metadata.author}</footer>
            )}
          </blockquote>
        );
      case 'code':
        return (
          <pre className="bg-[#1a1a1a] text-white p-4 rounded-lg overflow-x-auto">
            <code className="text-sm font-mono">{block.content}</code>
            {block.metadata?.language && (
              <div className="text-xs text-[#865014]/40 mt-2">{block.metadata.language}</div>
            )}
          </pre>
        );
      case 'list':
        return (
          <ul className="list-disc list-inside space-y-1 text-sm text-[#1a1a1a]">
            {block.content.split('\n').filter(Boolean).map((item, i) => (
              <li key={i}>{item.replace(/^[•\d.]+/, '').trim()}</li>
            ))}
          </ul>
        );
      case 'divider':
        return <hr className="my-4 border-[#E0AE3F]/20" />;
      default:
        return null;
    }
  };

  // Status helpers
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-emerald-500';
      case 'submitted': return 'bg-blue-500';
      case 'approved': return 'bg-green-500';
      case 'archived': return 'bg-gray-500';
      default: return 'bg-amber-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published': return <CheckCircle className="h-4 w-4" />;
      case 'submitted': return <Send className="h-4 w-4" />;
      case 'approved': return <Award className="h-4 w-4" />;
      case 'archived': return <Archive className="h-4 w-4" />;
      default: return <Edit3 className="h-4 w-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-blue-100 text-blue-700';
      case 'advanced': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const filteredCourses = useMemo(() => {
    let result = courses;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(c =>
        c.title.toLowerCase().includes(term) ||
        c.description.toLowerCase().includes(term) ||
        c.category?.toLowerCase().includes(term) ||
        c.tags?.some(t => t.toLowerCase().includes(term))
      );
    }
    if (filterStatus !== 'all') {
      result = result.filter(c => c.status === filterStatus);
    }
    if (filterLevel !== 'all') {
      result = result.filter(c => c.level === filterLevel);
    }
    return result;
  }, [courses, searchTerm, filterStatus, filterLevel]);

  if (loading && courses.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#865014] mx-auto mb-4" />
          <p className="text-[#865014]/60">Loading your courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#865014]/10 via-[#E0AE3F]/10 to-[#865014]/10 rounded-2xl p-6 border border-[#E0AE3F]/20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#1a1a1a] flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-[#865014]" />
              {selectedCourse ? selectedCourse.title : 'Course Management'}
            </h1>
            <p className="text-sm text-[#865014]/60 mt-1">
              {selectedCourse 
                ? `Manage your course content and settings` 
                : 'Create, manage, and publish your courses for students'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!selectedCourse && (
              <>
                <div className="flex items-center gap-2 bg-white rounded-lg p-1 border border-[#E0AE3F]/20">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    className={viewMode === 'grid' ? 'bg-[#865014] text-white' : ''}
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    className={viewMode === 'list' ? 'bg-[#865014] text-white' : ''}
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
                <Button 
                  className="bg-[#865014] hover:bg-[#865014]/90 text-white shadow-lg shadow-[#865014]/20"
                  onClick={() => navigate('/teacher/courses/new')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Course
                </Button>
              </>
            )}
            {selectedCourse && (
              <Button 
                variant="outline" 
                size="sm"
                className="border-[#E0AE3F]/20 hover:bg-[#F6EBD8] text-[#865014]"
                onClick={() => {
                  navigate('/teacher/courses');
                  setSelectedCourse(null);
                }}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Courses
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards - Only show when no course is selected */}
      {!selectedCourse && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          <Card 
            className={`border-[#E0AE3F]/10 cursor-pointer hover:shadow-lg transition-all ${filterStatus === 'all' && !searchTerm ? 'ring-2 ring-[#865014]' : ''}`}
            onClick={() => {
              setFilterStatus('all');
              setSearchTerm('');
            }}
          >
            <CardHeader className="pb-2">
              <CardDescription className="text-xs text-[#865014]/60">Total</CardDescription>
              <CardTitle className="text-xl text-[#1a1a1a]">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card 
            className={`border-emerald-200 bg-emerald-50/30 cursor-pointer hover:shadow-lg transition-all ${filterStatus === 'published' ? 'ring-2 ring-emerald-500' : ''}`}
            onClick={() => setFilterStatus('published')}
          >
            <CardHeader className="pb-2">
              <CardDescription className="text-xs text-emerald-600">Published</CardDescription>
              <CardTitle className="text-xl text-emerald-700">{stats.published}</CardTitle>
            </CardHeader>
          </Card>
          <Card 
            className={`border-blue-200 bg-blue-50/30 cursor-pointer hover:shadow-lg transition-all ${filterStatus === 'submitted' ? 'ring-2 ring-blue-500' : ''}`}
            onClick={() => setFilterStatus('submitted')}
          >
            <CardHeader className="pb-2">
              <CardDescription className="text-xs text-blue-600">Submitted</CardDescription>
              <CardTitle className="text-xl text-blue-700">{stats.submitted}</CardTitle>
            </CardHeader>
          </Card>
          <Card 
            className={`border-green-200 bg-green-50/30 cursor-pointer hover:shadow-lg transition-all ${filterStatus === 'approved' ? 'ring-2 ring-green-500' : ''}`}
            onClick={() => setFilterStatus('approved')}
          >
            <CardHeader className="pb-2">
              <CardDescription className="text-xs text-green-600">Approved</CardDescription>
              <CardTitle className="text-xl text-green-700">{stats.approved}</CardTitle>
            </CardHeader>
          </Card>
          <Card 
            className={`border-amber-200 bg-amber-50/30 cursor-pointer hover:shadow-lg transition-all ${filterStatus === 'draft' ? 'ring-2 ring-amber-500' : ''}`}
            onClick={() => setFilterStatus('draft')}
          >
            <CardHeader className="pb-2">
              <CardDescription className="text-xs text-amber-600">Drafts</CardDescription>
              <CardTitle className="text-xl text-amber-700">{stats.drafts}</CardTitle>
            </CardHeader>
          </Card>
          <Card 
            className={`border-red-200 bg-red-50/30 cursor-pointer hover:shadow-lg transition-all ${filterStatus === 'archived' ? 'ring-2 ring-red-500' : ''}`}
            onClick={() => setFilterStatus('archived')}
          >
            <CardHeader className="pb-2">
              <CardDescription className="text-xs text-red-600">Archived</CardDescription>
              <CardTitle className="text-xl text-red-700">{stats.archived}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-purple-200 bg-purple-50/30">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs text-purple-600">Students</CardDescription>
              <CardTitle className="text-xl text-purple-700">{stats.totalStudents}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-indigo-200 bg-indigo-50/30">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs text-indigo-600">Chapters</CardDescription>
              <CardTitle className="text-xl text-indigo-700">{stats.totalChapters}</CardTitle>
            </CardHeader>
          </Card>
        </div>
      )}

      {/* Search and Filter - Only show when no course is selected */}
      {!selectedCourse && (
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#865014]/40" />
            <Input
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30 bg-white"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <select
              className="px-4 py-2 rounded-lg border border-[#E0AE3F]/20 focus:ring-2 focus:ring-[#865014]/30 focus:outline-none bg-white"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="submitted">Submitted</option>
              <option value="approved">Approved</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
            <select
              className="px-4 py-2 rounded-lg border border-[#E0AE3F]/20 focus:ring-2 focus:ring-[#865014]/30 focus:outline-none bg-white"
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            <Button variant="outline" onClick={loadCourses} className="border-[#E0AE3F]/20 hover:bg-[#F6EBD8]">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Course List or Detail View */}
      {!selectedCourse ? (
        <>
          {filteredCourses.length === 0 ? (
            <Card className="border-dashed border-2 border-[#E0AE3F]/30">
              <CardContent className="text-center py-16">
                <BookOpen className="h-16 w-16 text-[#865014]/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#1a1a1a] mb-2">No courses yet</h3>
                <p className="text-[#865014]/60 mb-6">Start creating your first course and share your knowledge with students.</p>
                <Button 
                  className="bg-[#865014] hover:bg-[#865014]/90 text-white"
                  onClick={() => navigate('/teacher/courses/new')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Course
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-4`}>
              {filteredCourses.map((course) => (
                <Card 
                  key={course.id} 
                  className="border-[#E0AE3F]/10 hover:shadow-lg transition-all cursor-pointer group overflow-hidden"
                  onClick={() => {
                    setSelectedCourse(course);
                    navigate(`/teacher/courses/${course.id}`);
                  }}
                >
                  {course.imageUrl && (
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      <img 
                        src={getImageUrl(course.imageUrl)} 
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-course.jpg';
                        }}
                      />
                      <div className="absolute top-2 right-2 flex gap-1">
                        <Badge className={getStatusColor(course.status)}>
                          {getStatusIcon(course.status)}
                          <span className="ml-1">{getStatusLabel(course.status)}</span>
                        </Badge>
                      </div>
                      {course.featured && (
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-amber-500">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        </div>
                      )}
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-lg text-[#1a1a1a] group-hover:text-[#865014] transition-colors">
                      {course.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#865014]/60">Students</span>
                        <span className="font-medium">{course.students}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#865014]/60">Chapters</span>
                        <span className="font-medium">{course.totalChapters}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#865014]/60">Level</span>
                        <Badge className={getLevelColor(course.level)}>{course.level}</Badge>
                      </div>
                      {course.rating && course.rating > 0 && (
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          <span className="font-medium">{course.rating.toFixed(1)}</span>
                          <span className="text-[#865014]/40">({course.reviews || 0} reviews)</span>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {course.tags?.slice(0, 3).map((tag, i) => (
                          <Badge key={i} variant="outline" className="text-xs border-[#E0AE3F]/20 text-[#865014]">
                            {tag}
                          </Badge>
                        ))}
                        {course.tags?.length > 3 && (
                          <Badge variant="outline" className="text-xs border-[#E0AE3F]/20 text-[#865014]">
                            +{course.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 pt-3 border-t border-[#E0AE3F]/10">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 border-[#E0AE3F]/20 hover:bg-[#F6EBD8]"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/teacher/courses/${course.id}`);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Open
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-red-400 hover:bg-red-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCourse(course);
                            setActiveDialog('delete');
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      ) : (
        // Course Detail View
        <>
          {/* Course Detail Header */}
          <div className="bg-gradient-to-r from-[#865014]/10 via-[#E0AE3F]/10 to-[#865014]/10 rounded-2xl p-6 border border-[#E0AE3F]/20">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-bold text-[#1a1a1a]">{selectedCourse.title}</h1>
                  <Badge className={getStatusColor(selectedCourse.status)}>
                    {getStatusIcon(selectedCourse.status)}
                    <span className="ml-1">{getStatusLabel(selectedCourse.status)}</span>
                  </Badge>
                  {selectedCourse.featured && (
                    <Badge className="bg-amber-500">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-[#865014]/60 mt-1">{selectedCourse.description}</p>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  {selectedCourse.tags?.map((tag, i) => (
                    <Badge key={i} variant="outline" className="border-[#E0AE3F]/30 text-[#865014]">
                      {tag}
                    </Badge>
                  ))}
                  <Badge className={getLevelColor(selectedCourse.level)}>{selectedCourse.level}</Badge>
                  <span className="text-xs text-[#865014]/40">v{selectedCourse.version}</span>
                  <span className="text-xs text-[#865014]/40">
                    Updated: {formatDate(selectedCourse.updatedAt)}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                {selectedCourse.status === 'draft' && (
                  <Button 
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                    onClick={() => {
                      // Submit for approval logic
                      toast.success('📤 Course submitted for review!');
                    }}
                  >
                    <Send className="h-4 w-4 mr-1" />
                    Submit for Review
                  </Button>
                )}
                {selectedCourse.status === 'approved' && (
                  <Button 
                    size="sm"
                    className="bg-emerald-500 hover:bg-emerald-600 text-white"
                    onClick={() => setActiveDialog('publish')}
                  >
                    <Rocket className="h-4 w-4 mr-1" />
                    Publish
                  </Button>
                )}
                <Button 
                  className="bg-[#865014] hover:bg-[#865014]/90 text-white"
                  size="sm"
                  onClick={() => {
                    setCourseDraft(selectedCourse);
                    setActiveDialog('course');
                  }}
                >
                  <Edit3 className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button 
                  variant="outline"
                  size="sm"
                  className="border-[#E0AE3F]/20 hover:bg-[#F6EBD8] text-[#865014]"
                  onClick={() => setActiveDialog('preview')}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            <Card className="border-[#E0AE3F]/10">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs text-[#865014]/60">Students</CardDescription>
                <CardTitle className="text-2xl text-[#1a1a1a]">{selectedCourse.students}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="border-[#E0AE3F]/10">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs text-[#865014]/60">Sections</CardDescription>
                <CardTitle className="text-2xl text-[#1a1a1a]">{selectedCourse.sections?.length || 0}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="border-[#E0AE3F]/10">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs text-[#865014]/60">Chapters</CardDescription>
                <CardTitle className="text-2xl text-[#1a1a1a]">{selectedCourse.totalChapters}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="border-[#E0AE3F]/10">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs text-[#865014]/60">Materials</CardDescription>
                <CardTitle className="text-2xl text-[#1a1a1a]">{selectedCourse.materials?.length || 0}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="border-[#E0AE3F]/10">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs text-[#865014]/60">Version</CardDescription>
                <CardTitle className="text-2xl text-[#1a1a1a]">v{selectedCourse.version}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="border-[#E0AE3F]/10">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs text-[#865014]/60">Rating</CardDescription>
                <CardTitle className="text-2xl text-[#1a1a1a] flex items-center gap-1">
                  {selectedCourse.rating?.toFixed(1) || 'N/A'}
                  {selectedCourse.rating && selectedCourse.rating > 0 && (
                    <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                  )}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-3 space-y-4">
              <Card className="border-[#E0AE3F]/10">
                <CardHeader>
                  <CardTitle className="text-sm text-[#1a1a1a]">Course Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs text-[#865014]/60">Level</p>
                    <p className="text-sm font-medium capitalize">{selectedCourse.level}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#865014]/60">Estimated Time</p>
                    <p className="text-sm font-medium">{selectedCourse.estimatedTime} minutes</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#865014]/60">Language</p>
                    <p className="text-sm font-medium">{selectedCourse.language || 'English'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#865014]/60">Last Modified</p>
                    <p className="text-sm font-medium">{formatDate(selectedCourse.updatedAt)}</p>
                  </div>
                  {selectedCourse.instructor && (
                    <div>
                      <p className="text-xs text-[#865014]/60">Instructor</p>
                      <p className="text-sm font-medium">{selectedCourse.instructor}</p>
                    </div>
                  )}
                  {selectedCourse.prerequisites?.length > 0 && (
                    <div>
                      <p className="text-xs text-[#865014]/60">Prerequisites</p>
                      <ul className="text-sm font-medium list-disc list-inside">
                        {selectedCourse.prerequisites.map((prereq, i) => (
                          <li key={i}>{prereq}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {selectedCourse.certificateAvailable && (
                    <div className="flex items-center gap-2 text-emerald-600">
                      <Award className="h-4 w-4" />
                      <span className="text-sm font-medium">Certificate Available</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-[#E0AE3F]/10">
                <CardHeader>
                  <CardTitle className="text-sm text-[#1a1a1a]">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-[#E0AE3F]/20 hover:bg-[#F6EBD8] text-[#865014]"
                    onClick={() => {
                      setEditingSection(null);
                      setSectionDraft({});
                      setActiveDialog('section');
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Section
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-[#E0AE3F]/20 hover:bg-[#F6EBD8] text-[#865014]"
                    onClick={() => setActiveDialog('materials')}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Materials
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-[#E0AE3F]/20 hover:bg-[#F6EBD8] text-[#865014]"
                    onClick={() => setActiveDialog('preview')}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview Course
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-9 space-y-6">
              {/* Course Image */}
              {selectedCourse.imageUrl && (
                <Card className="border-[#E0AE3F]/10 overflow-hidden">
                  <div className="relative w-full h-64 bg-gray-100">
                    <img 
                      src={getImageUrl(selectedCourse.imageUrl)} 
                      alt={selectedCourse.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-course.jpg';
                      }}
                    />
                    <div className="absolute bottom-2 right-2 bg-black/50 text-white px-3 py-1 rounded-lg text-xs">
                      Course Cover
                    </div>
                  </div>
                </Card>
              )}

              {/* Course Objectives */}
              {selectedCourse.objectives && selectedCourse.objectives.length > 0 && (
                <Card className="border-[#E0AE3F]/10">
                  <CardHeader>
                    <CardTitle className="text-[#1a1a1a]">Learning Objectives</CardTitle>
                    <CardDescription className="text-[#865014]/50">What students will learn</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {selectedCourse.objectives.map((objective, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-[#1a1a1a]">
                          <Target className="h-4 w-4 text-[#865014] mt-0.5 flex-shrink-0" />
                          {objective}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Sections and Chapters */}
              <Card className="border-[#E0AE3F]/10">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-[#1a1a1a]">Course Content</CardTitle>
                      <CardDescription className="text-[#865014]/50">
                        {selectedCourse.sections?.length || 0} sections • {selectedCourse.totalChapters} chapters
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedCourse.sections?.map((section, sectionIndex) => (
                    <div key={section.id} className="rounded-xl border border-[#E0AE3F]/10 overflow-hidden">
                      <div className="flex items-center justify-between p-4 bg-[#F6EBD8]/20">
                        <div className="flex items-center gap-3">
                          {section.icon && <span className="text-2xl">{section.icon}</span>}
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-[#1a1a1a]">{section.title}</p>
                              <Badge variant="outline" className="text-xs border-[#E0AE3F]/20">
                                Section {sectionIndex + 1}
                              </Badge>
                            </div>
                            <p className="text-xs text-[#865014]/60">{section.chapters?.length || 0} chapters</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-[#865014] hover:bg-[#F6EBD8]"
                            onClick={() => {
                              setEditingSection(section);
                              setSectionDraft(section);
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
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-red-400 hover:bg-red-50"
                            onClick={() => deleteSection(section.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="p-4 space-y-3">
                        {section.chapters?.map((chapter) => (
                          <div 
                            key={chapter.id}
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-[#F6EBD8]/30 transition-colors border border-transparent hover:border-[#E0AE3F]/20 cursor-pointer group"
                            onClick={() => openChapterEditor(section, chapter)}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-sm text-[#1a1a1a] group-hover:text-[#865014] transition-colors">
                                  {chapter.title}
                                </p>
                                {chapter.estimatedTime && (
                                  <Badge variant="outline" className="text-xs border-[#E0AE3F]/20">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {chapter.estimatedTime}m
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-[#865014]/60 mt-1">
                                {chapter.blocks?.length || 0} blocks • {chapter.status}
                              </p>
                              {chapter.objectives && chapter.objectives.length > 0 && (
                                <p className="text-xs text-[#865014]/40 mt-1">
                                  {chapter.objectives.length} learning objectives
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-red-400 hover:bg-red-50"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteChapter(section.id, chapter.id);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}

      {/* ==================== ALL DIALOGS ==================== */}

      {/* Create/Edit Course Dialog */}
      <Dialog open={activeDialog === 'course'} onOpenChange={(open) => {
        if (!open) {
          setActiveDialog(null);
          setCourseDraft({});
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-[#E0AE3F]/20">
          <DialogHeader>
            <DialogTitle className="text-2xl text-[#1a1a1a] flex items-center gap-2">
              {selectedCourse ? <Edit3 className="h-6 w-6 text-[#865014]" /> : <Plus className="h-6 w-6 text-[#865014]" />}
              {selectedCourse ? 'Edit Course' : 'Create New Course'}
            </DialogTitle>
            <DialogDescription className="text-[#865014]/60">
              {selectedCourse 
                ? 'Update your course details, content, and settings' 
                : 'Create an amazing course to share your knowledge with students'}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="basic" className="mt-4">
            <TabsList className="bg-[#F6EBD8]/30 flex-wrap">
              <TabsTrigger value="basic" className="data-[state=active]:bg-white">Basic Info</TabsTrigger>
              <TabsTrigger value="content" className="data-[state=active]:bg-white">Content</TabsTrigger>
              <TabsTrigger value="advanced" className="data-[state=active]:bg-white">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 pt-4">
              <div>
                <Label className="text-[#1a1a1a] font-medium">Course Title *</Label>
                <Input 
                  value={courseDraft.title || selectedCourse?.title || ''}
                  onChange={(e) => setCourseDraft({ ...courseDraft, title: e.target.value })}
                  className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30 mt-1"
                  placeholder="Enter an engaging course title"
                />
              </div>
              <div>
                <Label className="text-[#1a1a1a] font-medium">Description *</Label>
                <Textarea 
                  value={courseDraft.description || selectedCourse?.description || ''}
                  onChange={(e) => setCourseDraft({ ...courseDraft, description: e.target.value })}
                  className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30 mt-1"
                  placeholder="Describe what students will learn in this course"
                  rows={3}
                />
              </div>
              
              <div>
                <Label className="text-[#1a1a1a] font-medium">Course Image</Label>
                <div className="space-y-2 mt-1">
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-[#E0AE3F]/20 hover:bg-[#F6EBD8]"
                      onClick={() => imageInputRef.current?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Image
                    </Button>
                    <span className="text-sm text-[#865014]/40 flex items-center">or</span>
                    <Input 
                      value={courseDraft.imageUrl || selectedCourse?.imageUrl || ''}
                      onChange={(e) => setCourseDraft({ ...courseDraft, imageUrl: e.target.value })}
                      className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30 flex-1"
                      placeholder="Paste image URL"
                    />
                  </div>
                  <input 
                    ref={imageInputRef} 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          const url = e.target?.result as string;
                          setCourseDraft({ ...courseDraft, imageUrl: url });
                        };
                        reader.readAsDataURL(file);
                      }
                    }} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-[#1a1a1a] font-medium">Level</Label>
                  <select 
                    className="w-full px-3 py-2 rounded-lg border border-[#E0AE3F]/20 focus:ring-2 focus:ring-[#865014]/30 focus:outline-none mt-1 bg-white"
                    value={courseDraft.level || selectedCourse?.level || 'beginner'}
                    onChange={(e) => setCourseDraft({ ...courseDraft, level: e.target.value as any })}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <Label className="text-[#1a1a1a] font-medium">Estimated Time (minutes)</Label>
                  <Input 
                    type="number"
                    value={courseDraft.estimatedTime || selectedCourse?.estimatedTime || ''}
                    onChange={(e) => setCourseDraft({ ...courseDraft, estimatedTime: parseInt(e.target.value) || 0 })}
                    className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30 mt-1"
                    placeholder="120"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="content" className="space-y-4 pt-4">
              <div>
                <Label className="text-[#1a1a1a] font-medium">Category</Label>
                <Input 
                  value={courseDraft.category || selectedCourse?.category || ''}
                  onChange={(e) => setCourseDraft({ ...courseDraft, category: e.target.value })}
                  className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30 mt-1"
                  placeholder="e.g., Biblical Studies, Theology, Leadership"
                />
              </div>
              <div>
                <Label className="text-[#1a1a1a] font-medium">Language</Label>
                <Input 
                  value={courseDraft.language || selectedCourse?.language || 'English'}
                  onChange={(e) => setCourseDraft({ ...courseDraft, language: e.target.value })}
                  className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30 mt-1"
                  placeholder="English"
                />
              </div>
              <div>
                <Label className="text-[#1a1a1a] font-medium">Tags (comma separated)</Label>
                <Input 
                  value={courseDraft.tags?.join(', ') || selectedCourse?.tags?.join(', ') || ''}
                  onChange={(e) => setCourseDraft({ ...courseDraft, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                  className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30 mt-1"
                  placeholder="Biblical Studies, Theology, History"
                />
              </div>
              <div>
                <Label className="text-[#1a1a1a] font-medium">Prerequisites (one per line)</Label>
                <Textarea 
                  value={courseDraft.prerequisites?.join('\n') || selectedCourse?.prerequisites?.join('\n') || ''}
                  onChange={(e) => setCourseDraft({ ...courseDraft, prerequisites: e.target.value.split('\n').filter(Boolean) })}
                  className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30 mt-1"
                  placeholder="Basic Bible knowledge&#10;Understanding of Christian theology"
                  rows={3}
                />
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4 pt-4">
              <div>
                <Label className="text-[#1a1a1a] font-medium">Learning Objectives (one per line)</Label>
                <Textarea 
                  value={courseDraft.objectives?.join('\n') || selectedCourse?.objectives?.join('\n') || ''}
                  onChange={(e) => setCourseDraft({ ...courseDraft, objectives: e.target.value.split('\n').filter(Boolean) })}
                  className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30 mt-1"
                  placeholder="Understand the structure of the Bible&#10;Apply hermeneutical principles"
                  rows={4}
                />
              </div>
              <div>
                <Label className="text-[#1a1a1a] font-medium">Instructor</Label>
                <Input 
                  value={courseDraft.instructor || selectedCourse?.instructor || user.full_name}
                  onChange={(e) => setCourseDraft({ ...courseDraft, instructor: e.target.value })}
                  className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30 mt-1"
                  placeholder="Instructor name"
                />
              </div>
              <div>
                <Label className="text-[#1a1a1a] font-medium">Institution</Label>
                <Input 
                  value={courseDraft.institution || selectedCourse?.institution || ''}
                  onChange={(e) => setCourseDraft({ ...courseDraft, institution: e.target.value })}
                  className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30 mt-1"
                  placeholder="Your institution or church"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-[#1a1a1a] font-medium">Enrollment Limit</Label>
                  <Input 
                    type="number"
                    value={courseDraft.enrollmentLimit || selectedCourse?.enrollmentLimit || ''}
                    onChange={(e) => setCourseDraft({ ...courseDraft, enrollmentLimit: parseInt(e.target.value) || 0 })}
                    className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30 mt-1"
                    placeholder="0 for unlimited"
                  />
                </div>
                <div className="flex items-end gap-4">
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox"
                      id="certificate"
                      checked={courseDraft.certificateAvailable !== undefined ? courseDraft.certificateAvailable : selectedCourse?.certificateAvailable || false}
                      onChange={(e) => setCourseDraft({ ...courseDraft, certificateAvailable: e.target.checked })}
                      className="w-4 h-4 accent-[#865014]"
                    />
                    <Label htmlFor="certificate" className="text-[#1a1a1a]">Certificate Available</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox"
                      id="featured"
                      checked={courseDraft.featured !== undefined ? courseDraft.featured : selectedCourse?.featured || false}
                      onChange={(e) => setCourseDraft({ ...courseDraft, featured: e.target.checked })}
                      className="w-4 h-4 accent-[#865014]"
                    />
                    <Label htmlFor="featured" className="text-[#1a1a1a]">Featured</Label>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 pt-4 border-t border-[#E0AE3F]/10">
            <Button variant="outline" onClick={() => {
              setActiveDialog(null);
              setCourseDraft({});
              if (isCreateMode) {
                navigate('/teacher/courses');
              }
            }} className="border-[#E0AE3F]/20 hover:bg-[#F6EBD8]">
              Cancel
            </Button>
            <Button 
              className="bg-[#865014] hover:bg-[#865014]/90 text-white" 
              onClick={selectedCourse ? updateCourse : createCourse} 
              disabled={saving}
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : selectedCourse ? 'Update Course' : 'Create Course'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Section Dialog */}
      <Dialog open={activeDialog === 'section'} onOpenChange={() => {
        setActiveDialog(null);
        setSectionDraft({});
        setEditingSection(null);
      }}>
        <DialogContent className="max-w-md border-[#E0AE3F]/20">
          <DialogHeader>
            <DialogTitle className="text-[#1a1a1a] flex items-center gap-2">
              {editingSection ? <Edit3 className="h-5 w-5 text-[#865014]" /> : <Plus className="h-5 w-5 text-[#865014]" />}
              {editingSection ? 'Edit Section' : 'Add New Section'}
            </DialogTitle>
            <DialogDescription className="text-[#865014]/60">
              {editingSection ? 'Update section details' : 'Create a new section for your course'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-[#1a1a1a] font-medium">Section Title *</Label>
              <Input 
                value={sectionDraft.title || editingSection?.title || ''}
                onChange={(e) => setSectionDraft({ ...sectionDraft, title: e.target.value })}
                className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30 mt-1"
                placeholder="Enter section title"
              />
            </div>
            <div>
              <Label className="text-[#1a1a1a] font-medium">Description</Label>
              <Textarea 
                value={sectionDraft.description || editingSection?.description || ''}
                onChange={(e) => setSectionDraft({ ...sectionDraft, description: e.target.value })}
                className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30 mt-1"
                placeholder="Enter section description"
                rows={3}
              />
            </div>
            <div>
              <Label className="text-[#1a1a1a] font-medium">Icon (emoji)</Label>
              <Input 
                value={sectionDraft.icon || editingSection?.icon || ''}
                onChange={(e) => setSectionDraft({ ...sectionDraft, icon: e.target.value })}
                className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30 mt-1"
                placeholder="📖"
                maxLength={2}
              />
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t border-[#E0AE3F]/10">
              <Button variant="outline" onClick={() => {
                setActiveDialog(null);
                setSectionDraft({});
                setEditingSection(null);
              }} className="border-[#E0AE3F]/20 hover:bg-[#F6EBD8]">
                Cancel
              </Button>
              <Button 
                className="bg-[#865014] hover:bg-[#865014]/90 text-white"
                onClick={editingSection ? updateSection : createSection}
              >
                <Save className="h-4 w-4 mr-2" />
                {editingSection ? 'Update Section' : 'Add Section'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Chapter Dialog */}
      <Dialog open={activeDialog === 'chapter'} onOpenChange={() => {
        setActiveDialog(null);
        setChapterDraft({});
        setEditingSection(null);
      }}>
        <DialogContent className="max-w-md border-[#E0AE3F]/20">
          <DialogHeader>
            <DialogTitle className="text-[#1a1a1a] flex items-center gap-2">
              <Plus className="h-5 w-5 text-[#865014]" />
              Add New Chapter
            </DialogTitle>
            <DialogDescription className="text-[#865014]/60">
              Add a new chapter to the section: <span className="font-medium text-[#1a1a1a]">{editingSection?.title}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-[#1a1a1a] font-medium">Chapter Title *</Label>
              <Input 
                value={chapterDraft.title || ''}
                onChange={(e) => setChapterDraft({ ...chapterDraft, title: e.target.value })}
                className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30 mt-1"
                placeholder="Enter chapter title"
              />
            </div>
            <div>
              <Label className="text-[#1a1a1a] font-medium">Content Preview</Label>
              <Textarea 
                value={chapterDraft.content || ''}
                onChange={(e) => setChapterDraft({ ...chapterDraft, content: e.target.value })}
                className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30 mt-1"
                placeholder="Brief content overview"
                rows={3}
              />
            </div>
            <div>
              <Label className="text-[#1a1a1a] font-medium">Estimated Time (minutes)</Label>
              <Input 
                type="number"
                value={chapterDraft.estimatedTime || 30}
                onChange={(e) => setChapterDraft({ ...chapterDraft, estimatedTime: parseInt(e.target.value) || 0 })}
                className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30 mt-1"
                placeholder="30"
              />
            </div>
            <div>
              <Label className="text-[#1a1a1a] font-medium">Learning Objectives (one per line)</Label>
              <Textarea 
                value={chapterDraft.objectives?.join('\n') || ''}
                onChange={(e) => setChapterDraft({ ...chapterDraft, objectives: e.target.value.split('\n').filter(Boolean) })}
                className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30 mt-1"
                placeholder="Understand the main theme&#10;Apply key principles"
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t border-[#E0AE3F]/10">
              <Button variant="outline" onClick={() => {
                setActiveDialog(null);
                setChapterDraft({});
                setEditingSection(null);
              }} className="border-[#E0AE3F]/20 hover:bg-[#F6EBD8]">
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

      {/* Chapter Content Editor Dialog */}
      <Dialog open={activeDialog === 'chapter_content'} onOpenChange={() => {
        setActiveDialog(null);
        setEditingChapter(null);
        setEditingSection(null);
        setBlocks([]);
      }}>
        <DialogContent className="max-w-6xl border-[#E0AE3F]/20 max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-[#1a1a1a] flex items-center gap-2">
              <Edit3 className="h-5 w-5 text-[#865014]" />
              Edit Chapter Content
            </DialogTitle>
            <DialogDescription className="text-[#865014]/60">
              {editingChapter?.title} • Add text, images, videos, reading materials, and more
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col h-[calc(90vh-200px)]">
            <Tabs defaultValue="editor" className="flex-1 flex flex-col">
              <TabsList className="bg-[#F6EBD8]/30 flex flex-wrap gap-1">
                <TabsTrigger value="editor" className="data-[state=active]:bg-white">Editor</TabsTrigger>
                <TabsTrigger value="preview" className="data-[state=active]:bg-white">Preview</TabsTrigger>
                <TabsTrigger value="mobile" className="data-[state=active]:bg-white">Mobile Preview</TabsTrigger>
              </TabsList>
              <TabsContent value="editor" className="flex-1 flex flex-col gap-4 pt-4 overflow-auto">
                {/* Toolbar */}
                <div className="flex flex-wrap gap-1.5 p-3 rounded-lg bg-[#F6EBD8]/20 border border-[#E0AE3F]/10 sticky top-0 z-10">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-8 border-[#E0AE3F]/20 text-[#865014] hover:bg-[#F6EBD8]"
                    onClick={() => addContentBlock('header')}
                  >
                    <Hash className="h-3.5 w-3.5 mr-1" />
                    Header
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-8 border-[#E0AE3F]/20 text-[#865014] hover:bg-[#F6EBD8]"
                    onClick={() => addContentBlock('paragraph')}
                  >
                    <Type className="h-3.5 w-3.5 mr-1" />
                    Text
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-8 border-[#E0AE3F]/20 text-[#865014] hover:bg-[#F6EBD8]"
                    onClick={() => contentImageInputRef.current?.click()}
                  >
                    <Image className="h-3.5 w-3.5 mr-1" />
                    Image
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-8 border-[#E0AE3F]/20 text-[#865014] hover:bg-[#F6EBD8]"
                    onClick={() => contentVideoInputRef.current?.click()}
                  >
                    <Video className="h-3.5 w-3.5 mr-1" />
                    Video
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-8 border-[#E0AE3F]/20 text-[#865014] hover:bg-[#F6EBD8]"
                    onClick={() => contentAudioInputRef.current?.click()}
                  >
                    <Music className="h-3.5 w-3.5 mr-1" />
                    Audio
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-8 border-[#E0AE3F]/20 text-[#865014] hover:bg-[#F6EBD8]"
                    onClick={() => {
                      const url = prompt('Enter link URL:');
                      if (url) handleLinkUpload(url, 'link');
                    }}
                  >
                    <LinkIcon className="h-3.5 w-3.5 mr-1" />
                    Link
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-8 border-[#E0AE3F]/20 text-[#865014] hover:bg-[#F6EBD8]"
                    onClick={() => contentFileInputRef.current?.click()}
                  >
                    <File className="h-3.5 w-3.5 mr-1" />
                    File
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-8 border-[#E0AE3F]/20 text-[#865014] border-2 border-[#865014]/30 hover:bg-[#F6EBD8]"
                    onClick={() => contentMaterialInputRef.current?.click()}
                  >
                    <FileArchive className="h-3.5 w-3.5 mr-1" />
                    Reading
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-8 border-[#E0AE3F]/20 text-[#865014] hover:bg-[#F6EBD8]"
                    onClick={() => {
                      const url = prompt('Enter reading material URL:');
                      if (url) handleLinkUpload(url, 'reading_material');
                    }}
                  >
                    <ExternalLink className="h-3.5 w-3.5 mr-1" />
                    External
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-8 border-[#E0AE3F]/20 text-[#865014] hover:bg-[#F6EBD8]"
                    onClick={() => addContentBlock('quote')}
                  >
                    <Quote className="h-3.5 w-3.5 mr-1" />
                    Quote
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-8 border-[#E0AE3F]/20 text-[#865014] hover:bg-[#F6EBD8]"
                    onClick={() => addContentBlock('list')}
                  >
                    <ListIcon className="h-3.5 w-3.5 mr-1" />
                    List
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-8 border-[#E0AE3F]/20 text-[#865014] hover:bg-[#F6EBD8]"
                    onClick={() => addContentBlock('code')}
                  >
                    <Code className="h-3.5 w-3.5 mr-1" />
                    Code
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-8 border-[#E0AE3F]/20 text-[#865014] hover:bg-[#F6EBD8]"
                    onClick={() => addContentBlock('divider')}
                  >
                    <Minus className="h-3.5 w-3.5 mr-1" />
                    Divider
                  </Button>
                </div>

                {/* Hidden file inputs for content */}
                <input ref={contentImageInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleContentFileUpload(e, 'image')} />
                <input ref={contentVideoInputRef} type="file" accept="video/*" className="hidden" onChange={(e) => handleContentFileUpload(e, 'video')} />
                <input ref={contentAudioInputRef} type="file" accept="audio/*" className="hidden" onChange={(e) => handleContentFileUpload(e, 'audio')} />
                <input ref={contentFileInputRef} type="file" className="hidden" onChange={(e) => handleContentFileUpload(e, 'file')} />
                <input ref={contentMaterialInputRef} type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.txt" className="hidden" onChange={(e) => handleContentFileUpload(e, 'reading_material')} />

                {/* Content Blocks */}
                <div className="flex-1 space-y-3 overflow-auto pb-4">
                  {blocks.length === 0 && (
                    <div className="text-center py-16">
                      <FileText className="h-16 w-16 text-[#865014]/20 mx-auto mb-4" />
                      <p className="text-[#865014]/40 text-lg font-medium">No content yet</p>
                      <p className="text-sm text-[#865014]/30">Use the toolbar above to add content blocks</p>
                    </div>
                  )}
                  {blocks.map((block, index) => (
                    <div 
                      key={block.id}
                      id={block.id}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedBlockId === block.id 
                          ? 'border-[#865014] bg-[#F6EBD8]/50 shadow-md' 
                          : 'border-[#E0AE3F]/20 hover:border-[#E0AE3F]/40 hover:shadow-sm'
                      }`}
                      onClick={() => setSelectedBlockId(block.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-[#865014]/30 text-center">{index + 1}</span>
                          <button 
                            className="p-1 rounded hover:bg-[#F6EBD8] text-[#865014]/40"
                            onClick={() => moveContentBlock(block.id, 'up')}
                            disabled={index === 0}
                          >
                            <ArrowUp className="h-4 w-4" />
                          </button>
                          <button 
                            className="p-1 rounded hover:bg-[#F6EBD8] text-[#865014]/40"
                            onClick={() => moveContentBlock(block.id, 'down')}
                            disabled={index === blocks.length - 1}
                          >
                            <ArrowDown className="h-4 w-4" />
                          </button>
                          <button 
                            className="p-1 rounded hover:bg-[#F6EBD8] text-[#865014]/40"
                            onClick={() => duplicateContentBlock(block.id)}
                          >
                            <CopyIcon className="h-4 w-4" />
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
                              {block.type === 'reading_material' ? 'Reading Material' : 
                               block.type === 'paragraph' ? 'Text' :
                               block.type === 'header' ? 'Header' :
                               block.type === 'list' ? 'List' :
                               block.type === 'quote' ? 'Quote' :
                               block.type === 'code' ? 'Code' :
                               block.type === 'divider' ? 'Divider' :
                               block.type}
                            </Badge>
                            {uploadProgress[block.id] !== undefined && (
                              <div className="flex items-center gap-2">
                                <Progress value={uploadProgress[block.id]} className="w-20 h-1.5" />
                                <span className="text-xs text-[#865014]/60">{uploadProgress[block.id]}%</span>
                              </div>
                            )}
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
                                value={block.metadata?.altText || ''}
                                onChange={(e) => updateContentBlock(block.id, block.content, { ...block.metadata, altText: e.target.value })}
                                className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30"
                                placeholder="Alt text"
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
                              className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30 min-h-[100px]"
                              placeholder="Write your content here..."
                              rows={4}
                            />
                          )}
                          {block.type === 'quote' && (
                            <div className="space-y-2">
                              <Textarea 
                                value={block.content}
                                onChange={(e) => updateContentBlock(block.id, e.target.value)}
                                className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30 min-h-[60px] border-l-4 border-l-[#865014]"
                                placeholder="Enter quote..."
                                rows={3}
                              />
                              <Input 
                                value={block.metadata?.author || ''}
                                onChange={(e) => updateContentBlock(block.id, block.content, { ...block.metadata, author: e.target.value })}
                                className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30"
                                placeholder="Author (optional)"
                              />
                            </div>
                          )}
                          {block.type === 'list' && (
                            <div className="space-y-2">
                              <Textarea 
                                value={block.content}
                                onChange={(e) => updateContentBlock(block.id, e.target.value)}
                                className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30 font-mono"
                                placeholder="One item per line"
                                rows={4}
                              />
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="border-[#E0AE3F]/20"
                                  onClick={() => {
                                    const items = block.content.split('\n').filter(Boolean);
                                    const newItems = items.map(item => `• ${item}`);
                                    updateContentBlock(block.id, newItems.join('\n'));
                                  }}
                                >
                                  <ListIcon className="h-3 w-3 mr-1" />
                                  Bullet
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="border-[#E0AE3F]/20"
                                  onClick={() => {
                                    const items = block.content.split('\n').filter(Boolean);
                                    const newItems = items.map((item, i) => `${i + 1}. ${item}`);
                                    updateContentBlock(block.id, newItems.join('\n'));
                                  }}
                                >
                                  <ListOrdered className="h-3 w-3 mr-1" />
                                  Numbered
                                </Button>
                              </div>
                            </div>
                          )}
                          {block.type === 'code' && (
                            <div className="space-y-2">
                              <Textarea 
                                value={block.content}
                                onChange={(e) => updateContentBlock(block.id, e.target.value)}
                                className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30 font-mono bg-[#1a1a1a] text-white min-h-[100px]"
                                placeholder="Enter code..."
                                rows={4}
                              />
                              <Input 
                                value={block.metadata?.language || ''}
                                onChange={(e) => updateContentBlock(block.id, block.content, { ...block.metadata, language: e.target.value })}
                                className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30"
                                placeholder="Language (e.g., javascript, python)"
                              />
                            </div>
                          )}
                          {(block.type === 'video' || block.type === 'audio' || block.type === 'link' || block.type === 'reading_material') && (
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
                              {block.type === 'video' && (
                                <Input 
                                  value={block.metadata?.duration || ''}
                                  onChange={(e) => updateContentBlock(block.id, block.content, { ...block.metadata, duration: e.target.value })}
                                  className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30"
                                  placeholder="Duration (e.g., 10:30)"
                                />
                              )}
                            </div>
                          )}
                          {block.type === 'divider' && (
                            <div className="text-center text-[#865014]/30 text-sm">Divider</div>
                          )}
                          {block.type === 'file' && (
                            <div className="flex items-center gap-3">
                              <File className="h-5 w-5 text-[#865014]" />
                              <span className="text-sm text-[#865014]/60">{block.content}</span>
                              <span className="text-xs text-[#865014]/40">
                                {(block.metadata?.fileSize || 0) / 1024 > 0 ? ((block.metadata?.fileSize || 0) / 1024).toFixed(1) : '0'} KB
                              </span>
                            </div>
                          )}
                          {block.type === 'image' && block.metadata?.url && (
                            <img 
                              src={getImageUrl(block.metadata.url)} 
                              alt="Preview" 
                              className="mt-2 rounded-lg max-h-48 object-contain border border-[#E0AE3F]/20"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                              }}
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
                          {block.type === 'reading_material' && block.metadata?.url && (
                            <div className="mt-2 p-4 rounded-lg border-2 border-[#E0AE3F]/20 bg-[#F6EBD8]/20">
                              <div className="flex items-center gap-3">
                                <FileArchive className="h-8 w-8 text-[#865014]" />
                                <div>
                                  <p className="font-medium text-[#1a1a1a]">{block.content}</p>
                                  <p className="text-xs text-[#865014]/40">Ready for students</p>
                                </div>
                                <Button variant="outline" size="sm" className="ml-auto">
                                  <Eye className="h-4 w-4 mr-2" />
                                  Preview
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="preview" className="flex-1 overflow-auto">
                <div className="prose max-w-none p-6">
                  {blocks.map((block) => (
                    <div key={block.id} className="mb-4">
                      {renderContentBlock(block)}
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="mobile" className="flex-1 overflow-auto">
                <div className="max-w-sm mx-auto bg-white rounded-xl shadow-lg p-4 min-h-[600px]">
                  <div className="prose max-w-none">
                    {blocks.map((block) => (
                      <div key={block.id} className="mb-4">
                        {renderContentBlock(block)}
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            <div className="flex justify-end gap-2 pt-4 border-t border-[#E0AE3F]/10">
              <Button variant="outline" onClick={() => {
                setActiveDialog(null);
                setEditingChapter(null);
                setEditingSection(null);
                setBlocks([]);
              }} className="border-[#E0AE3F]/20 hover:bg-[#F6EBD8]">
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

      {/* Materials Upload Dialog */}
      <Dialog open={activeDialog === 'materials'} onOpenChange={() => setActiveDialog(null)}>
        <DialogContent className="max-w-lg border-[#E0AE3F]/20">
          <DialogHeader>
            <DialogTitle className="text-[#1a1a1a] flex items-center gap-2">
              <Upload className="h-5 w-5 text-[#865014]" />
              Upload Course Materials
            </DialogTitle>
            <DialogDescription className="text-[#865014]/60">
              Add reading materials, documents, and resources for students
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-[#E0AE3F]/30 rounded-lg p-8 text-center hover:border-[#865014]/50 transition-colors">
              <UploadCloud className="h-12 w-12 text-[#865014]/40 mx-auto mb-4" />
              <p className="text-sm text-[#1a1a1a] font-medium">Drop files here or click to upload</p>
              <p className="text-xs text-[#865014]/40 mt-1">Supports PDF, DOC, PPT, TXT, and more</p>
              <Button 
                variant="outline" 
                className="mt-4 border-[#E0AE3F]/20 hover:bg-[#F6EBD8]"
                onClick={() => materialInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Select Files
              </Button>
              <input 
                ref={materialInputRef} 
                type="file" 
                accept=".pdf,.doc,.docx,.ppt,.pptx,.txt" 
                multiple
                className="hidden" 
                onChange={(e) => {
                  const files = e.target.files;
                  if (files && selectedCourse) {
                    const newMaterials = Array.from(files).map(file => ({
                      type: file.type.includes('pdf') ? 'pdf' as const :
                            file.type.includes('word') ? 'doc' as const :
                            file.type.includes('powerpoint') ? 'ppt' as const :
                            'other' as const,
                      name: file.name,
                      url: URL.createObjectURL(file),
                      size: (file.size / 1024 / 1024).toFixed(1) + ' MB'
                    }));
                    
                    setCourses(courses.map(course => 
                      course.id === selectedCourse.id 
                        ? { 
                            ...course, 
                            materials: [...(course.materials || []), ...newMaterials],
                            updatedAt: new Date().toISOString()
                          }
                        : course
                    ));
                    toast.success(`📄 ${files.length} material(s) uploaded successfully!`);
                    setActiveDialog(null);
                  }
                  e.target.value = '';
                }} 
              />
            </div>
            <div>
              <Label className="text-[#1a1a1a] font-medium">Or add external link</Label>
              <div className="flex gap-2 mt-1">
                <Input 
                  placeholder="https://example.com/material.pdf"
                  className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30"
                  id="material-link"
                />
                <Button 
                  className="bg-[#865014] hover:bg-[#865014]/90 text-white whitespace-nowrap"
                  onClick={() => {
                    const linkInput = document.getElementById('material-link') as HTMLInputElement;
                    const url = linkInput?.value;
                    if (url && selectedCourse) {
                      const newMaterial = {
                        type: 'link' as const,
                        name: url.split('/').pop() || 'External Material',
                        url: url,
                        size: 'External Link'
                      };
                      setCourses(courses.map(course => 
                        course.id === selectedCourse.id 
                          ? { 
                              ...course, 
                              materials: [...(course.materials || []), newMaterial],
                              updatedAt: new Date().toISOString()
                            }
                          : course
                      ));
                      toast.success('🔗 External material added!');
                      linkInput.value = '';
                      setActiveDialog(null);
                    }
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Link
                </Button>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t border-[#E0AE3F]/10">
              <Button variant="outline" onClick={() => setActiveDialog(null)} className="border-[#E0AE3F]/20 hover:bg-[#F6EBD8]">
                Done
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Publish Dialog */}
      <Dialog open={activeDialog === 'publish'} onOpenChange={() => setActiveDialog(null)}>
        <DialogContent className="max-w-md border-[#E0AE3F]/20">
          <DialogHeader>
            <DialogTitle className="text-[#1a1a1a] flex items-center gap-2">
              <Rocket className="h-5 w-5 text-[#865014]" />
              Publish Course
            </DialogTitle>
            <DialogDescription className="text-[#865014]/60">
              Are you ready to publish this course to students?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-emerald-700">Ready to publish!</p>
                  <p className="text-xs text-emerald-600 mt-1">
                    This course has been approved and is ready to be published to students.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#865014]/60">Title</span>
                <span className="font-medium">{selectedCourse?.title}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#865014]/60">Sections</span>
                <span className="font-medium">{selectedCourse?.sections?.length || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#865014]/60">Chapters</span>
                <span className="font-medium">{selectedCourse?.totalChapters || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#865014]/60">Level</span>
                <Badge className={getLevelColor(selectedCourse?.level || 'beginner')}>{selectedCourse?.level}</Badge>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t border-[#E0AE3F]/10">
              <Button variant="outline" onClick={() => setActiveDialog(null)} className="border-[#E0AE3F]/20 hover:bg-[#F6EBD8]">
                Cancel
              </Button>
              <Button 
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
                onClick={() => {
                  if (selectedCourse) {
                    publishCourse(selectedCourse.id);
                  }
                }}
                disabled={saving}
              >
                <Rocket className="h-4 w-4 mr-2" />
                {saving ? 'Publishing...' : 'Publish Course'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={activeDialog === 'delete'} onOpenChange={() => setActiveDialog(null)}>
        <DialogContent className="max-w-md border-[#E0AE3F]/20">
          <DialogHeader>
            <DialogTitle className="text-[#1a1a1a] flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Delete Course
            </DialogTitle>
            <DialogDescription className="text-[#865014]/60">
              Are you sure you want to delete "{selectedCourse?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-4 border-t border-[#E0AE3F]/10">
            <Button variant="outline" onClick={() => setActiveDialog(null)} className="border-[#E0AE3F]/20 hover:bg-[#F6EBD8]">
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={() => selectedCourse && deleteCourse(selectedCourse.id)}
              disabled={saving}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {saving ? 'Deleting...' : 'Delete Permanently'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={activeDialog === 'preview'} onOpenChange={() => setActiveDialog(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-[#E0AE3F]/20">
          <DialogHeader>
            <DialogTitle className="text-[#1a1a1a] flex items-center gap-2">
              <Eye className="h-5 w-5 text-[#865014]" />
              Course Preview
            </DialogTitle>
            <DialogDescription className="text-[#865014]/60">
              Preview your course as students will see it
            </DialogDescription>
          </DialogHeader>
          {selectedCourse && (
            <div className="space-y-6">
              <div className="flex gap-2 justify-end">
                <Button 
                  variant="outline" 
                  size="sm"
                  className={`${previewMode === 'desktop' ? 'border-[#865014] bg-[#F6EBD8]/30' : 'border-[#E0AE3F]/20'}`}
                  onClick={() => setPreviewMode('desktop')}
                >
                  <Monitor className="h-4 w-4 mr-2" />
                  Desktop
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className={`${previewMode === 'tablet' ? 'border-[#865014] bg-[#F6EBD8]/30' : 'border-[#E0AE3F]/20'}`}
                  onClick={() => setPreviewMode('tablet')}
                >
                  <Tablet className="h-4 w-4 mr-2" />
                  Tablet
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className={`${previewMode === 'mobile' ? 'border-[#865014] bg-[#F6EBD8]/30' : 'border-[#E0AE3F]/20'}`}
                  onClick={() => setPreviewMode('mobile')}
                >
                  <Smartphone className="h-4 w-4 mr-2" />
                  Mobile
                </Button>
              </div>
              <div className={`${
                previewMode === 'desktop' ? 'max-w-full' :
                previewMode === 'tablet' ? 'max-w-2xl mx-auto' :
                'max-w-sm mx-auto'
              } bg-white rounded-xl shadow-lg p-6 transition-all`}>
                {selectedCourse.imageUrl && (
                  <img 
                    src={getImageUrl(selectedCourse.imageUrl)} 
                    alt={selectedCourse.title}
                    className="w-full h-48 object-cover rounded-lg mb-6"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-course.jpg';
                    }}
                  />
                )}
                <h1 className="text-2xl font-bold text-[#1a1a1a] mb-2">{selectedCourse.title}</h1>
                <p className="text-sm text-[#865014]/60 mb-4">{selectedCourse.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className="bg-[#865014]">{selectedCourse.level}</Badge>
                  <Badge variant="outline" className="border-[#E0AE3F]/20">
                    <Clock className="h-3 w-3 mr-1" />
                    {selectedCourse.estimatedTime}m
                  </Badge>
                  <Badge variant="outline" className="border-[#E0AE3F]/20">
                    <BookOpen className="h-3 w-3 mr-1" />
                    {selectedCourse.totalChapters} chapters
                  </Badge>
                  {selectedCourse.certificateAvailable && (
                    <Badge variant="outline" className="border-emerald-300 text-emerald-600">
                      <Award className="h-3 w-3 mr-1" />
                      Certificate
                    </Badge>
                  )}
                </div>

                {selectedCourse.objectives && selectedCourse.objectives.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-semibold text-[#1a1a1a] mb-2">What you'll learn</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedCourse.objectives.map((obj, i) => (
                        <li key={i} className="text-sm text-[#1a1a1a]">{obj}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="space-y-4">
                  <h3 className="font-semibold text-[#1a1a1a]">Course Content</h3>
                  {selectedCourse.sections?.map((section) => (
                    <div key={section.id} className="border border-[#E0AE3F]/10 rounded-lg overflow-hidden">
                      <div className="p-3 bg-[#F6EBD8]/20 flex items-center gap-2">
                        {section.icon && <span>{section.icon}</span>}
                        <h4 className="font-medium text-[#1a1a1a]">{section.title}</h4>
                      </div>
                      <div className="p-3 space-y-2">
                        {section.chapters?.map((chapter) => (
                          <div key={chapter.id} className="flex items-center justify-between p-2 hover:bg-[#F6EBD8]/30 rounded">
                            <span className="text-sm text-[#1a1a1a]">{chapter.title}</span>
                            <span className="text-xs text-[#865014]/40">
                              {chapter.blocks?.length || 0} items
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {selectedCourse.materials && selectedCourse.materials.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-semibold text-[#1a1a1a] mb-2">Materials</h3>
                    <div className="space-y-2">
                      {selectedCourse.materials.map((material, i) => (
                        <div key={i} className="flex items-center gap-2 p-2 border border-[#E0AE3F]/10 rounded">
                          <File className="h-4 w-4 text-[#865014]" />
                          <span className="text-sm text-[#1a1a1a]">{material.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="flex justify-end pt-4 border-t border-[#E0AE3F]/10">
            <Button variant="outline" onClick={() => setActiveDialog(null)} className="border-[#E0AE3F]/20 hover:bg-[#F6EBD8]">
              Close Preview
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Missing components
const List: React.FC<{ className?: string }> = ({ className }) => {
  return <div className={className}>List</div>;
};

const Download: React.FC<{ className?: string }> = ({ className }) => {
  return <div className={className}>Download</div>;
};

const FileArchive: React.FC<{ className?: string }> = ({ className }) => {
  return <div className={className}>FileArchive</div>;
};

const ExternalLink: React.FC<{ className?: string }> = ({ className }) => {
  return <div className={className}>ExternalLink</div>;
};

const UploadCloud: React.FC<{ className?: string }> = ({ className }) => {
  return <div className={className}>UploadCloud</div>;
};

const Minus: React.FC<{ className?: string }> = ({ className }) => {
  return <div className={className}>−</div>;
};