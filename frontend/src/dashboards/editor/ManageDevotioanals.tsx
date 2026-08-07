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
import {
  BookOpen,
  Plus,
  Search,
  RefreshCw,
  Edit3,
  Trash2,
  Eye,
  Save,
  Send,
  Calendar,
  Clock,
  User,
  Tag,
  Filter,
  Grid,
  List,
  ArrowLeft,
  Loader2,
  CheckCircle,
  Archive,
  Pin,
  Award,
  Heart,
  MessageCircle,
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
  AlertCircle,
} from 'lucide-react';

// Types matching your database schema
type Devotional = {
  id: number;
  title: string;
  content: string;
  header?: string;
  subtitle?: string;
  excerpt: string;
  verse_reference: string;
  verse_text: string;
  category: string;
  tags: string[];
  featured_image: string;
  video_url?: string;
  audio_url?: string;
  slug: string;
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  is_featured_today: boolean;
  is_pinned: boolean;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  bookmarks: number;
  reading_time: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
  publish_at?: string;
  author_id: number;
  author_name?: string;
};

type DevotionalStats = {
  total: number;
  published: number;
  drafts: number;
  scheduled: number;
  archived: number;
  featuredToday: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  averageReadingTime: number;
};

type ScheduleData = {
  date: string;
  time: string;
  timezone: string;
  makeFeatured: boolean;
};

// Main Component
export default function ManageDevotionals() {
  const location = useLocation();
  const navigate = useNavigate();
  const locationState = location.state as { role?: string; userName?: string; userEmail?: string; view?: string } | null;

  const [user] = useState({
    full_name: locationState?.userName || 'Admin User',
    email: locationState?.userEmail || 'admin@church.com',
    role: locationState?.role || 'admin',
  });

  // State
  const [devotionals, setDevotionals] = useState<Devotional[]>([]);
  const [selectedDevotional, setSelectedDevotional] = useState<Devotional | null>(null);
  const [selectedDevotionalId, setSelectedDevotionalId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeDialog, setActiveDialog] = useState<null | 'devotional' | 'preview' | 'stats' | 'share' | 'publish'>(null);
  const [devotionalDraft, setDevotionalDraft] = useState<Partial<Devotional>>({});
  const [stats, setStats] = useState<DevotionalStats>({
    total: 0,
    published: 0,
    drafts: 0,
    scheduled: 0,
    archived: 0,
    featuredToday: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
    totalShares: 0,
    averageReadingTime: 0,
  });

  // Schedule Dialog State
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [schedulingId, setSchedulingId] = useState<number | null>(null);
  const [scheduleData, setScheduleData] = useState<ScheduleData>({
    date: '',
    time: '',
    timezone: 'GMT+3',
    makeFeatured: true,
  });

  // File upload refs
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile' | 'tablet'>('desktop');

  // Categories
  const categories = useMemo(() => {
    const cats = new Set(devotionals.map(d => d.category).filter(Boolean));
    return Array.from(cats);
  }, [devotionals]);

  // Filtered devotionals
  const filteredDevotionals = useMemo(() => {
    let result = devotionals;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(d =>
        d.title.toLowerCase().includes(term) ||
        d.content?.toLowerCase().includes(term) ||
        d.author_name?.toLowerCase().includes(term) ||
        d.verse_reference?.toLowerCase().includes(term) ||
        d.tags?.some(t => t.toLowerCase().includes(term))
      );
    }
    if (filterStatus !== 'all') {
      result = result.filter(d => d.status === filterStatus);
    }
    if (filterCategory !== 'all') {
      result = result.filter(d => d.category === filterCategory);
    }
    return result;
  }, [devotionals, searchTerm, filterStatus, filterCategory]);

  // Load devotionals
  useEffect(() => {
    loadDevotionals();
  }, []);

  // Set selected devotional
  useEffect(() => {
    if (selectedDevotionalId && devotionals.length > 0) {
      const found = devotionals.find(d => d.id === selectedDevotionalId);
      if (found) setSelectedDevotional(found);
    }
  }, [devotionals, selectedDevotionalId]);

  // Load devotionals from API
  const loadDevotionals = async () => {
    try {
      setLoading(true);
      const response = await api.get('/editor/devotionals');
      const data = response.data?.data || [];
      
      const formattedData = data.map((item: any) => ({
        ...item,
        status: item.status || 'draft',
        tags: Array.isArray(item.tags) ? item.tags : 
              typeof item.tags === 'string' ? JSON.parse(item.tags) : [],
        views: item.views || 0,
        likes: item.likes || 0,
        comments: item.comments || 0,
        shares: item.shares || 0,
        bookmarks: item.bookmarks || 0,
        reading_time: item.reading_time || Math.ceil((item.content?.length || 0) / 200),
        is_featured_today: item.is_featured_today || false,
        is_pinned: item.is_pinned || false,
      }));

      setDevotionals(formattedData);

      // Calculate stats
      const published = formattedData.filter((d: any) => d.status === 'published');
      const drafts = formattedData.filter((d: any) => d.status === 'draft');
      const scheduled = formattedData.filter((d: any) => d.status === 'scheduled');
      const archived = formattedData.filter((d: any) => d.status === 'archived');
      const featuredToday = formattedData.filter((d: any) => d.is_featured_today);

      setStats({
        total: formattedData.length,
        published: published.length,
        drafts: drafts.length,
        scheduled: scheduled.length,
        archived: archived.length,
        featuredToday: featuredToday.length,
        totalViews: formattedData.reduce((sum: number, d: any) => sum + (d.views || 0), 0),
        totalLikes: formattedData.reduce((sum: number, d: any) => sum + (d.likes || 0), 0),
        totalComments: formattedData.reduce((sum: number, d: any) => sum + (d.comments || 0), 0),
        totalShares: formattedData.reduce((sum: number, d: any) => sum + (d.shares || 0), 0),
        averageReadingTime: formattedData.length > 0 
          ? Math.round(formattedData.reduce((sum: number, d: any) => sum + (d.reading_time || 0), 0) / formattedData.length)
          : 0,
      });
    } catch (error: any) {
      console.error('Failed to load devotionals:', error);
      toast.error(error.response?.data?.message || 'Failed to load devotionals. Please make sure the server is running.');
      // Use mock data for development
      setDevotionals(mockDevotionals);
      setStats({
        total: mockDevotionals.length,
        published: mockDevotionals.filter(d => d.status === 'published').length,
        drafts: mockDevotionals.filter(d => d.status === 'draft').length,
        scheduled: mockDevotionals.filter(d => d.status === 'scheduled').length,
        archived: mockDevotionals.filter(d => d.status === 'archived').length,
        featuredToday: mockDevotionals.filter(d => d.is_featured_today).length,
        totalViews: mockDevotionals.reduce((sum, d) => sum + (d.views || 0), 0),
        totalLikes: mockDevotionals.reduce((sum, d) => sum + (d.likes || 0), 0),
        totalComments: mockDevotionals.reduce((sum, d) => sum + (d.comments || 0), 0),
        totalShares: mockDevotionals.reduce((sum, d) => sum + (d.shares || 0), 0),
        averageReadingTime: Math.round(mockDevotionals.reduce((sum, d) => sum + (d.reading_time || 0), 0) / mockDevotionals.length),
      });
    } finally {
      setLoading(false);
    }
  };

  // Create devotional
  const createDevotional = async () => {
    try {
      setSaving(true);
      const payload = {
        title: devotionalDraft.title || 'New Devotional',
        content: devotionalDraft.content || '',
        header: devotionalDraft.header || '',
        subtitle: devotionalDraft.subtitle || '',
        excerpt: devotionalDraft.excerpt || '',
        verse_reference: devotionalDraft.verse_reference || '',
        verse_text: devotionalDraft.verse_text || '',
        category: devotionalDraft.category || 'General',
        tags: devotionalDraft.tags || [],
        featured_image: devotionalDraft.featured_image || '',
        video_url: devotionalDraft.video_url || '',
        audio_url: devotionalDraft.audio_url || '',
        status: 'draft',
        author_id: 1,
        reading_time: devotionalDraft.reading_time || 5,
        is_featured_today: devotionalDraft.is_featured_today || false,
        is_pinned: devotionalDraft.is_pinned || false,
      };

      const response = await api.post('/editor/devotionals', payload);
      const newDevotional = {
        ...payload,
        id: response.data?.id || Date.now(),
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        bookmarks: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        author_name: user.full_name,
      };

      setDevotionals([newDevotional as Devotional, ...devotionals]);
      setSelectedDevotional(null);
      setSelectedDevotionalId(null);
      setActiveDialog(null);
      setDevotionalDraft({});
      toast.success('✨ Devotional created successfully!');
      loadDevotionals();
    } catch (error: any) {
      console.error('Failed to create devotional:', error);
      toast.error(error.response?.data?.message || 'Failed to create devotional. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Update devotional
  const updateDevotional = async () => {
    if (!selectedDevotional) return;

    try {
      setSaving(true);
      const payload = {
        ...selectedDevotional,
        ...devotionalDraft,
        updated_at: new Date().toISOString(),
      };

      await api.put(`/editor/devotionals/${selectedDevotional.id}`, payload);
      
      setDevotionals(devotionals.map(d =>
        d.id === selectedDevotional.id ? { ...d, ...payload } : d
      ));
      setSelectedDevotional({ ...selectedDevotional, ...payload });
      setActiveDialog(null);
      setDevotionalDraft({});
      toast.success('✅ Devotional updated successfully!');
      loadDevotionals();
    } catch (error: any) {
      console.error('Failed to update devotional:', error);
      toast.error(error.response?.data?.message || 'Failed to update devotional. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Delete devotional
  const deleteDevotional = async (id: number) => {
    if (!confirm('Are you sure you want to delete this devotional?')) return;

    try {
      setSaving(true);
      await api.delete(`/editor/devotionals/${id}`);
      setDevotionals(devotionals.filter(d => d.id !== id));
      if (selectedDevotionalId === id) {
        setSelectedDevotional(null);
        setSelectedDevotionalId(null);
      }
      toast.success('🗑️ Devotional deleted successfully');
    } catch (error: any) {
      console.error('Failed to delete devotional:', error);
      toast.error(error.response?.data?.message || 'Failed to delete devotional. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Publish devotional
  const publishDevotional = async (id: number) => {
    try {
      setSaving(true);
      await api.post(`/editor/devotionals/${id}/publish`, { is_featured_today: true });
      
      setDevotionals(devotionals.map(d =>
        d.id === id ? { ...d, status: 'published', published_at: new Date().toISOString(), is_featured_today: true } : d
      ));
      
      if (selectedDevotional?.id === id) {
        setSelectedDevotional({ ...selectedDevotional, status: 'published', published_at: new Date().toISOString(), is_featured_today: true });
      }
      
      setActiveDialog(null);
      toast.success('🎉 Devotional published successfully!');
      loadDevotionals();
    } catch (error: any) {
      console.error('Failed to publish devotional:', error);
      toast.error(error.response?.data?.message || 'Failed to publish devotional. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Open schedule dialog
  const openScheduleDialog = (id: number) => {
    setSchedulingId(id);
    // Set default date to today
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().slice(0, 5);
    setScheduleData({
      date: dateStr,
      time: timeStr,
      timezone: 'GMT+3',
      makeFeatured: true,
    });
    setScheduleDialogOpen(true);
  };

  // Confirm schedule
  const confirmSchedule = async () => {
    if (!schedulingId) return;
    
    const { date, time, timezone, makeFeatured } = scheduleData;
    if (!date || !time) {
      toast.error('Please select both date and time');
      return;
    }
    
    // Combine date and time
    const dateTime = new Date(`${date}T${time}:00`);
    
    // Format for API - ISO string
    const publishAt = dateTime.toISOString();
    
    try {
      setSaving(true);
      await api.post(`/editor/devotionals/${schedulingId}/schedule`, { 
        publish_at: publishAt, 
        make_featured: makeFeatured 
      });
      
      setDevotionals(devotionals.map(d =>
        d.id === schedulingId ? { ...d, status: 'scheduled', publish_at: publishAt } : d
      ));
      
      if (selectedDevotional?.id === schedulingId) {
        setSelectedDevotional({ ...selectedDevotional, status: 'scheduled', publish_at: publishAt });
      }
      
      toast.success(`📅 Devotional scheduled for ${date} at ${time} ${timezone}`);
      setScheduleDialogOpen(false);
      loadDevotionals();
    } catch (error: any) {
      console.error('Failed to schedule devotional:', error);
      toast.error(error.response?.data?.message || 'Failed to schedule devotional. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Archive devotional
  const archiveDevotional = async (id: number) => {
    try {
      setSaving(true);
      await api.put(`/editor/devotionals/${id}`, { status: 'archived' });
      
      setDevotionals(devotionals.map(d =>
        d.id === id ? { ...d, status: 'archived' } : d
      ));
      
      if (selectedDevotional?.id === id) {
        setSelectedDevotional({ ...selectedDevotional, status: 'archived' });
      }
      
      toast.success('📦 Devotional archived');
      loadDevotionals();
    } catch (error: any) {
      console.error('Failed to archive devotional:', error);
      toast.error(error.response?.data?.message || 'Failed to archive devotional. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Upload file
  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await api.post('/editor/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.data.url;
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload file');
      throw error;
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-emerald-500';
      case 'scheduled': return 'bg-purple-500';
      case 'archived': return 'bg-gray-500';
      default: return 'bg-amber-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published': return <CheckCircle className="h-4 w-4" />;
      case 'scheduled': return <Calendar className="h-4 w-4" />;
      case 'archived': return <Archive className="h-4 w-4" />;
      default: return <Edit3 className="h-4 w-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Handle image upload
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      const url = await uploadFile(file);
      setDevotionalDraft({ ...devotionalDraft, featured_image: url });
      toast.success('📸 Image uploaded successfully');
    } catch (error) {
      // Fallback to local URL
      const url = URL.createObjectURL(file);
      setDevotionalDraft({ ...devotionalDraft, featured_image: url });
    }
  };

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'video' | 'audio') => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      const url = await uploadFile(file);
      if (type === 'video') {
        setDevotionalDraft({ ...devotionalDraft, video_url: url });
      } else {
        setDevotionalDraft({ ...devotionalDraft, audio_url: url });
      }
      toast.success(`${type === 'video' ? '🎬 Video' : '🎵 Audio'} uploaded successfully`);
    } catch (error) {
      // Fallback to local URL
      const url = URL.createObjectURL(file);
      if (type === 'video') {
        setDevotionalDraft({ ...devotionalDraft, video_url: url });
      } else {
        setDevotionalDraft({ ...devotionalDraft, audio_url: url });
      }
    }
  };

  // Open create dialog - CRITICAL: Clear selectedDevotional to ensure Create mode
  const openCreateDialog = () => {
    setSelectedDevotional(null);
    setSelectedDevotionalId(null);
    setDevotionalDraft({});
    setActiveDialog('devotional');
  };

  // Open edit dialog
  const openEditDialog = (devotional: Devotional) => {
    setDevotionalDraft(devotional);
    setActiveDialog('devotional');
  };

  if (loading && devotionals.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#865014] mx-auto mb-4" />
          <p className="text-[#865014]/60">Loading devotionals...</p>
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
              Devotionals
            </h1>
            <p className="text-sm text-[#865014]/60 mt-1">
              Create, manage, and publish daily devotionals for your congregation
            </p>
          </div>
          <div className="flex items-center gap-2">
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
              onClick={openCreateDialog}
            >
              <Plus className="h-4 w-4 mr-2" />
              Write Devotional
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-8 gap-3">
        <Card className="border-[#E0AE3F]/10">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs text-[#865014]/60">Total</CardDescription>
            <CardTitle className="text-xl text-[#1a1a1a]">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-emerald-200 bg-emerald-50/30">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs text-emerald-600">Published</CardDescription>
            <CardTitle className="text-xl text-emerald-700">{stats.published}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-amber-200 bg-amber-50/30">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs text-amber-600">Drafts</CardDescription>
            <CardTitle className="text-xl text-amber-700">{stats.drafts}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-purple-200 bg-purple-50/30">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs text-purple-600">Scheduled</CardDescription>
            <CardTitle className="text-xl text-purple-700">{stats.scheduled}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-gray-200 bg-gray-50/30">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs text-gray-600">Archived</CardDescription>
            <CardTitle className="text-xl text-gray-700">{stats.archived}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-amber-200 bg-amber-50/30">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs text-amber-600">Featured Today</CardDescription>
            <CardTitle className="text-xl text-amber-700">{stats.featuredToday}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-purple-200 bg-purple-50/30">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs text-purple-600">Views</CardDescription>
            <CardTitle className="text-xl text-purple-700">{stats.totalViews.toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-pink-200 bg-pink-50/30">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs text-pink-600">Likes</CardDescription>
            <CardTitle className="text-xl text-pink-700">{stats.totalLikes.toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#865014]/40" />
          <Input
            placeholder="Search devotionals by title, author, scripture..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30 bg-white"
          />
        </div>
        <div className="flex gap-2">
          <select
            className="px-4 py-2 rounded-lg border border-[#E0AE3F]/20 focus:ring-2 focus:ring-[#865014]/30 focus:outline-none bg-white"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="scheduled">Scheduled</option>
            <option value="archived">Archived</option>
          </select>
          <select
            className="px-4 py-2 rounded-lg border border-[#E0AE3F]/20 focus:ring-2 focus:ring-[#865014]/30 focus:outline-none bg-white"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <Button variant="outline" onClick={loadDevotionals} className="border-[#E0AE3F]/20 hover:bg-[#F6EBD8]">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Devotionals Grid/List */}
      {!selectedDevotional ? (
        <>
          {filteredDevotionals.length === 0 ? (
            <Card className="border-dashed border-2 border-[#E0AE3F]/30">
              <CardContent className="text-center py-16">
                <BookOpen className="h-16 w-16 text-[#865014]/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#1a1a1a] mb-2">No devotionals yet</h3>
                <p className="text-[#865014]/60 mb-6">Start writing daily devotionals to inspire and guide your congregation.</p>
                <Button 
                  className="bg-[#865014] hover:bg-[#865014]/90 text-white"
                  onClick={openCreateDialog}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Write Your First Devotional
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-4`}>
              {filteredDevotionals.map((devotional) => (
                <Card 
                  key={devotional.id} 
                  className="border-[#E0AE3F]/10 hover:shadow-lg transition-all cursor-pointer group overflow-hidden"
                  onClick={() => {
                    setSelectedDevotional(devotional);
                    setSelectedDevotionalId(devotional.id);
                  }}
                >
                  {devotional.featured_image && (
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={devotional.featured_image} 
                        alt={devotional.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2 flex gap-1">
                        <Badge className={getStatusColor(devotional.status)}>
                          {getStatusIcon(devotional.status)}
                          <span className="ml-1">{getStatusLabel(devotional.status)}</span>
                        </Badge>
                      </div>
                      {devotional.is_featured_today && (
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-amber-500">
                            <Star className="h-3 w-3 mr-1" />
                            Featured Today
                          </Badge>
                        </div>
                      )}
                      {devotional.is_pinned && (
                        <div className="absolute top-2 left-2 mt-6">
                          <Badge className="bg-blue-500">
                            <Pin className="h-3 w-3 mr-1" />
                            Pinned
                          </Badge>
                        </div>
                      )}
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-[#1a1a1a] group-hover:text-[#865014] transition-colors line-clamp-1">
                          {devotional.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-2 mt-1">
                          {devotional.excerpt || devotional.content?.slice(0, 120) + '...'}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#865014]/60">Scripture</span>
                        <span className="font-medium text-[#865014]">{devotional.verse_reference}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#865014]/60">Author</span>
                        <span className="font-medium">{devotional.author_name || 'Unknown'}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#865014]/60">Category</span>
                        <Badge variant="outline" className="border-[#E0AE3F]/20 text-[#865014]">
                          {devotional.category}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#865014]/60">Stats</span>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1 text-xs">
                            <Eye className="h-3 w-3 text-[#865014]/40" />
                            {devotional.views}
                          </span>
                          <span className="flex items-center gap-1 text-xs">
                            <Heart className="h-3 w-3 text-pink-400" />
                            {devotional.likes}
                          </span>
                          <span className="flex items-center gap-1 text-xs">
                            <MessageCircle className="h-3 w-3 text-blue-400" />
                            {devotional.comments}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {devotional.tags?.slice(0, 3).map((tag, i) => (
                          <Badge key={i} variant="outline" className="text-xs border-[#E0AE3F]/20 text-[#865014]">
                            #{tag}
                          </Badge>
                        ))}
                        {devotional.tags?.length > 3 && (
                          <Badge variant="outline" className="text-xs border-[#E0AE3F]/20 text-[#865014]">
                            +{devotional.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-[#E0AE3F]/10">
                        <span className="text-xs text-[#865014]/40">
                          {formatDate(devotional.published_at || devotional.created_at)}
                        </span>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-[#E0AE3F]/20 hover:bg-[#F6EBD8]"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedDevotional(devotional);
                              setSelectedDevotionalId(devotional.id);
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
                              deleteDevotional(devotional.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      ) : (
        // Devotional Detail View
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#865014]/10 via-[#E0AE3F]/10 to-[#865014]/10 rounded-2xl p-6 border border-[#E0AE3F]/20">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-bold text-[#1a1a1a]">{selectedDevotional.title}</h1>
                  <Badge className={getStatusColor(selectedDevotional.status)}>
                    {getStatusIcon(selectedDevotional.status)}
                    <span className="ml-1">{getStatusLabel(selectedDevotional.status)}</span>
                  </Badge>
                  {selectedDevotional.is_featured_today && (
                    <Badge className="bg-amber-500">
                      <Star className="h-3 w-3 mr-1" />
                      Featured Today
                    </Badge>
                  )}
                  {selectedDevotional.is_pinned && (
                    <Badge className="bg-blue-500">
                      <Pin className="h-3 w-3 mr-1" />
                      Pinned
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <span className="text-sm text-[#865014]/60">
                    <User className="h-3 w-3 inline mr-1" />
                    {selectedDevotional.author_name || 'Unknown'}
                  </span>
                  <span className="text-sm text-[#865014]/60">
                    <Calendar className="h-3 w-3 inline mr-1" />
                    {formatDate(selectedDevotional.published_at || selectedDevotional.created_at)}
                  </span>
                  <span className="text-sm text-[#865014]/60">
                    <Clock className="h-3 w-3 inline mr-1" />
                    {selectedDevotional.reading_time || 3} min read
                  </span>
                  <span className="text-sm text-[#865014]/60">
                    <BookOpen className="h-3 w-3 inline mr-1" />
                    {selectedDevotional.verse_reference}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-[#E0AE3F]/20 hover:bg-[#F6EBD8] text-[#865014]"
                  onClick={() => {
                    setSelectedDevotional(null);
                    setSelectedDevotionalId(null);
                  }}
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
                {selectedDevotional.status === 'draft' && (
                  <>
                    <Button 
                      size="sm"
                      className="bg-emerald-500 hover:bg-emerald-600 text-white"
                      onClick={() => publishDevotional(selectedDevotional.id)}
                      disabled={saving}
                    >
                      <Rocket className="h-4 w-4 mr-1" />
                      {saving ? 'Publishing...' : 'Publish Now'}
                    </Button>
                    <Button 
                      size="sm"
                      className="bg-purple-500 hover:bg-purple-600 text-white"
                      onClick={() => openScheduleDialog(selectedDevotional.id)}
                    >
                      <Calendar className="h-4 w-4 mr-1" />
                      Schedule
                    </Button>
                  </>
                )}
                {selectedDevotional.status === 'scheduled' && (
                  <Button 
                    size="sm"
                    className="bg-emerald-500 hover:bg-emerald-600 text-white"
                    onClick={() => publishDevotional(selectedDevotional.id)}
                    disabled={saving}
                  >
                    <Rocket className="h-4 w-4 mr-1" />
                    {saving ? 'Publishing...' : 'Publish Now'}
                  </Button>
                )}
                <Button 
                  className="bg-[#865014] hover:bg-[#865014]/90 text-white"
                  size="sm"
                  onClick={() => openEditDialog(selectedDevotional)}
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
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-red-400 hover:bg-red-50"
                  onClick={() => {
                    if (selectedDevotional.status !== 'archived') {
                      archiveDevotional(selectedDevotional.id);
                    } else {
                      deleteDevotional(selectedDevotional.id);
                    }
                  }}
                >
                  {selectedDevotional.status === 'archived' ? <Trash2 className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            <Card className="border-[#E0AE3F]/10">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs text-[#865014]/60">Views</CardDescription>
                <CardTitle className="text-lg text-[#1a1a1a]">{selectedDevotional.views}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="border-[#E0AE3F]/10">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs text-[#865014]/60">Likes</CardDescription>
                <CardTitle className="text-lg text-pink-600">{selectedDevotional.likes}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="border-[#E0AE3F]/10">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs text-[#865014]/60">Comments</CardDescription>
                <CardTitle className="text-lg text-blue-600">{selectedDevotional.comments}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="border-[#E0AE3F]/10">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs text-[#865014]/60">Shares</CardDescription>
                <CardTitle className="text-lg text-green-600">{selectedDevotional.shares}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="border-[#E0AE3F]/10">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs text-[#865014]/60">Bookmarks</CardDescription>
                <CardTitle className="text-lg text-amber-600">{selectedDevotional.bookmarks}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="border-[#E0AE3F]/10">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs text-[#865014]/60">Read Time</CardDescription>
                <CardTitle className="text-lg text-[#1a1a1a]">{selectedDevotional.reading_time || 3}m</CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-3 space-y-4">
              <Card className="border-[#E0AE3F]/10">
                <CardHeader>
                  <CardTitle className="text-sm text-[#1a1a1a]">Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs text-[#865014]/60">Scripture</p>
                    <p className="text-sm font-medium">{selectedDevotional.verse_reference}</p>
                    <p className="text-xs text-[#865014]/60 mt-1">{selectedDevotional.verse_text}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#865014]/60">Category</p>
                    <p className="text-sm font-medium">{selectedDevotional.category}</p>
                  </div>
                  {selectedDevotional.header && (
                    <div>
                      <p className="text-xs text-[#865014]/60">Header</p>
                      <p className="text-sm font-medium">{selectedDevotional.header}</p>
                    </div>
                  )}
                  {selectedDevotional.subtitle && (
                    <div>
                      <p className="text-xs text-[#865014]/60">Subtitle</p>
                      <p className="text-sm font-medium">{selectedDevotional.subtitle}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-[#865014]/60">Tags</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedDevotional.tags?.map((tag, i) => (
                        <Badge key={i} variant="outline" className="text-xs border-[#E0AE3F]/20 text-[#865014]">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {selectedDevotional.publish_at && (
                    <div>
                      <p className="text-xs text-[#865014]/60">Scheduled For</p>
                      <p className="text-sm font-medium">{formatDate(selectedDevotional.publish_at)}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-[#865014]/60">Last Modified</p>
                    <p className="text-sm font-medium">{formatDate(selectedDevotional.updated_at)}</p>
                  </div>
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
                    onClick={() => setActiveDialog('share')}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-[#E0AE3F]/20 hover:bg-[#F6EBD8] text-[#865014]"
                    onClick={() => setActiveDialog('stats')}
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-[#E0AE3F]/20 hover:bg-[#F6EBD8] text-[#865014]"
                    onClick={() => {
                      navigator.clipboard?.writeText(window.location.href);
                      toast.success('Link copied to clipboard');
                    }}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Link
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-[#E0AE3F]/20 hover:bg-[#F6EBD8] text-[#865014]"
                    onClick={() => window.print()}
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-9 space-y-6">
              {/* Featured Image */}
              {selectedDevotional.featured_image && (
                <Card className="border-[#E0AE3F]/10 overflow-hidden">
                  <img 
                    src={selectedDevotional.featured_image} 
                    alt={selectedDevotional.title}
                    className="w-full h-64 object-cover"
                  />
                </Card>
              )}

              {/* Content */}
              <Card className="border-[#E0AE3F]/10">
                <CardHeader>
                  <CardTitle className="text-[#1a1a1a]">Devotional Content</CardTitle>
                  <CardDescription className="text-[#865014]/50">
                    {selectedDevotional.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap text-[#1a1a1a] leading-relaxed">
                      {selectedDevotional.content}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Video */}
              {selectedDevotional.video_url && (
                <Card className="border-[#E0AE3F]/10">
                  <CardHeader>
                    <CardTitle className="text-[#1a1a1a]">Video</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <video controls className="w-full rounded-lg">
                      <source src={selectedDevotional.video_url} />
                      Your browser does not support the video tag.
                    </video>
                  </CardContent>
                </Card>
              )}

              {/* Audio */}
              {selectedDevotional.audio_url && (
                <Card className="border-[#E0AE3F]/10">
                  <CardHeader>
                    <CardTitle className="text-[#1a1a1a]">Audio</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <audio controls className="w-full">
                      <source src={selectedDevotional.audio_url} />
                      Your browser does not support the audio tag.
                    </audio>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Devotional Dialog */}
      <Dialog open={activeDialog === 'devotional'} onOpenChange={(open) => {
        if (!open) {
          setActiveDialog(null);
          setDevotionalDraft({});
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-[#E0AE3F]/20">
          <DialogHeader>
            <DialogTitle className="text-2xl text-[#1a1a1a] flex items-center gap-2">
              {selectedDevotional ? <Edit3 className="h-6 w-6 text-[#865014]" /> : <Plus className="h-6 w-6 text-[#865014]" />}
              {selectedDevotional ? 'Edit Devotional' : 'Write New Devotional'}
            </DialogTitle>
            <DialogDescription className="text-[#865014]/60">
              {selectedDevotional 
                ? 'Update your devotional content and settings' 
                : 'Write a new devotional to inspire your congregation'}
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="content" className="mt-4">
            <TabsList className="bg-[#F6EBD8]/30">
              <TabsTrigger value="content" className="data-[state=active]:bg-white">Content</TabsTrigger>
              <TabsTrigger value="media" className="data-[state=active]:bg-white">Media</TabsTrigger>
              <TabsTrigger value="advanced" className="data-[state=active]:bg-white">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4 pt-4">
              <div>
                <Label className="text-[#1a1a1a] font-medium">Title *</Label>
                <Input 
                  value={devotionalDraft.title || selectedDevotional?.title || ''}
                  onChange={(e) => setDevotionalDraft({ ...devotionalDraft, title: e.target.value })}
                  className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30 mt-1"
                  placeholder="Enter an engaging title"
                />
              </div>
              <div>
                <Label className="text-[#1a1a1a] font-medium">Header</Label>
                <Input 
                  value={devotionalDraft.header || selectedDevotional?.header || ''}
                  onChange={(e) => setDevotionalDraft({ ...devotionalDraft, header: e.target.value })}
                  className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30 mt-1"
                  placeholder="Optional header text"
                />
              </div>
              <div>
                <Label className="text-[#1a1a1a] font-medium">Subtitle</Label>
                <Input 
                  value={devotionalDraft.subtitle || selectedDevotional?.subtitle || ''}
                  onChange={(e) => setDevotionalDraft({ ...devotionalDraft, subtitle: e.target.value })}
                  className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30 mt-1"
                  placeholder="Optional subtitle"
                />
              </div>
              <div>
                <Label className="text-[#1a1a1a] font-medium">Excerpt / Summary</Label>
                <Textarea 
                  value={devotionalDraft.excerpt || selectedDevotional?.excerpt || ''}
                  onChange={(e) => setDevotionalDraft({ ...devotionalDraft, excerpt: e.target.value })}
                  className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30 mt-1"
                  placeholder="A brief summary of the devotional"
                  rows={2}
                />
              </div>
              <div>
                <Label className="text-[#1a1a1a] font-medium">Content *</Label>
                <Textarea 
                  value={devotionalDraft.content || selectedDevotional?.content || ''}
                  onChange={(e) => setDevotionalDraft({ ...devotionalDraft, content: e.target.value })}
                  className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30 mt-1 min-h-[200px]"
                  placeholder="Write your devotional content here..."
                  rows={8}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-[#1a1a1a] font-medium">Scripture Reference *</Label>
                  <Input 
                    value={devotionalDraft.verse_reference || selectedDevotional?.verse_reference || ''}
                    onChange={(e) => setDevotionalDraft({ ...devotionalDraft, verse_reference: e.target.value })}
                    className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30 mt-1"
                    placeholder="e.g., John 3:16"
                  />
                </div>
                <div>
                  <Label className="text-[#1a1a1a] font-medium">Scripture Text</Label>
                  <Textarea 
                    value={devotionalDraft.verse_text || selectedDevotional?.verse_text || ''}
                    onChange={(e) => setDevotionalDraft({ ...devotionalDraft, verse_text: e.target.value })}
                    className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30 mt-1"
                    placeholder="The full scripture text"
                    rows={2}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-[#1a1a1a] font-medium">Category</Label>
                  <Input 
                    value={devotionalDraft.category || selectedDevotional?.category || ''}
                    onChange={(e) => setDevotionalDraft({ ...devotionalDraft, category: e.target.value })}
                    className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30 mt-1"
                    placeholder="e.g., Faith, Hope, Love"
                  />
                </div>
                <div>
                  <Label className="text-[#1a1a1a] font-medium">Reading Time (minutes)</Label>
                  <Input 
                    type="number"
                    value={devotionalDraft.reading_time || selectedDevotional?.reading_time || ''}
                    onChange={(e) => setDevotionalDraft({ ...devotionalDraft, reading_time: parseInt(e.target.value) || 0 })}
                    className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30 mt-1"
                    placeholder="5"
                  />
                </div>
              </div>
              <div>
                <Label className="text-[#1a1a1a] font-medium">Tags (comma separated)</Label>
                <Input 
                  value={devotionalDraft.tags?.join(', ') || selectedDevotional?.tags?.join(', ') || ''}
                  onChange={(e) => setDevotionalDraft({ ...devotionalDraft, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                  className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30 mt-1"
                  placeholder="faith, hope, love, prayer"
                />
              </div>
            </TabsContent>

            <TabsContent value="media" className="space-y-4 pt-4">
              <div>
                <Label className="text-[#1a1a1a] font-medium">Featured Image</Label>
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
                      value={devotionalDraft.featured_image || selectedDevotional?.featured_image || ''}
                      onChange={(e) => setDevotionalDraft({ ...devotionalDraft, featured_image: e.target.value })}
                      className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30 flex-1"
                      placeholder="Paste image URL"
                    />
                  </div>
                  <input 
                    ref={imageInputRef} 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageUpload}
                  />
                </div>
              </div>

              <div>
                <Label className="text-[#1a1a1a] font-medium">Video</Label>
                <div className="flex gap-2 mt-1">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-[#E0AE3F]/20 hover:bg-[#F6EBD8]"
                    onClick={() => videoInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Video
                  </Button>
                  <Input 
                    value={devotionalDraft.video_url || selectedDevotional?.video_url || ''}
                    onChange={(e) => setDevotionalDraft({ ...devotionalDraft, video_url: e.target.value })}
                    className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30 flex-1"
                    placeholder="Paste video URL (YouTube, Vimeo, or direct link)"
                  />
                </div>
                <input 
                  ref={videoInputRef} 
                  type="file" 
                  accept="video/*" 
                  className="hidden" 
                  onChange={(e) => handleFileUpload(e, 'video')}
                />
              </div>

              <div>
                <Label className="text-[#1a1a1a] font-medium">Audio</Label>
                <div className="flex gap-2 mt-1">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-[#E0AE3F]/20 hover:bg-[#F6EBD8]"
                    onClick={() => audioInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Audio
                  </Button>
                  <Input 
                    value={devotionalDraft.audio_url || selectedDevotional?.audio_url || ''}
                    onChange={(e) => setDevotionalDraft({ ...devotionalDraft, audio_url: e.target.value })}
                    className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30 flex-1"
                    placeholder="Paste audio URL (Spotify, SoundCloud, or direct link)"
                  />
                </div>
                <input 
                  ref={audioInputRef} 
                  type="file" 
                  accept="audio/*" 
                  className="hidden" 
                  onChange={(e) => handleFileUpload(e, 'audio')}
                />
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4 pt-4">
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox"
                    id="featured"
                    checked={devotionalDraft.is_featured_today !== undefined ? devotionalDraft.is_featured_today : selectedDevotional?.is_featured_today || false}
                    onChange={(e) => setDevotionalDraft({ ...devotionalDraft, is_featured_today: e.target.checked })}
                    className="w-4 h-4 accent-[#865014]"
                  />
                  <Label htmlFor="featured" className="text-[#1a1a1a]">Feature Today</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox"
                    id="pinned"
                    checked={devotionalDraft.is_pinned !== undefined ? devotionalDraft.is_pinned : selectedDevotional?.is_pinned || false}
                    onChange={(e) => setDevotionalDraft({ ...devotionalDraft, is_pinned: e.target.checked })}
                    className="w-4 h-4 accent-[#865014]"
                  />
                  <Label htmlFor="pinned" className="text-[#1a1a1a]">Pin to Top</Label>
                </div>
              </div>
              <div>
                <Label className="text-[#1a1a1a] font-medium">Slug (URL identifier)</Label>
                <Input 
                  value={devotionalDraft.slug || selectedDevotional?.slug || ''}
                  onChange={(e) => setDevotionalDraft({ ...devotionalDraft, slug: e.target.value })}
                  className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30 mt-1"
                  placeholder="e.g., walking-in-gods-grace"
                />
                <p className="text-xs text-[#865014]/40 mt-1">Leave empty to auto-generate from title</p>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 pt-4 border-t border-[#E0AE3F]/10">
            <Button variant="outline" onClick={() => {
              setActiveDialog(null);
              setDevotionalDraft({});
            }} className="border-[#E0AE3F]/20 hover:bg-[#F6EBD8]">
              Cancel
            </Button>
            <Button 
              className="bg-[#865014] hover:bg-[#865014]/90 text-white" 
              onClick={selectedDevotional ? updateDevotional : createDevotional} 
              disabled={saving}
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : selectedDevotional ? 'Update Devotional' : 'Create Devotional'}
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
              Preview Devotional
            </DialogTitle>
            <DialogDescription className="text-[#865014]/60">
              Preview how your devotional will appear to readers
            </DialogDescription>
          </DialogHeader>
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
              {selectedDevotional && (
                <>
                  {selectedDevotional.featured_image && (
                    <img 
                      src={selectedDevotional.featured_image} 
                      alt={selectedDevotional.title}
                      className="w-full h-48 object-cover rounded-lg mb-6"
                    />
                  )}
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-[#865014]">{selectedDevotional.category}</Badge>
                    <span className="text-xs text-[#865014]/40">{selectedDevotional.reading_time || 3} min read</span>
                  </div>
                  <h1 className="text-2xl font-bold text-[#1a1a1a] mb-2">{selectedDevotional.title}</h1>
                  {selectedDevotional.subtitle && (
                    <p className="text-lg text-[#865014]/60 mb-2">{selectedDevotional.subtitle}</p>
                  )}
                  <div className="flex items-center gap-3 text-sm text-[#865014]/60 mb-4">
                    <span>{selectedDevotional.author_name || 'Unknown'}</span>
                    <span>•</span>
                    <span>{formatDate(selectedDevotional.published_at || selectedDevotional.created_at)}</span>
                  </div>
                  {selectedDevotional.excerpt && (
                    <p className="text-sm text-[#865014]/80 italic mb-4 border-l-4 border-[#865014] pl-4">
                      {selectedDevotional.excerpt}
                    </p>
                  )}
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap text-[#1a1a1a] leading-relaxed">
                      {selectedDevotional.content}
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-[#F6EBD8]/20 rounded-lg border border-[#E0AE3F]/20">
                    <h4 className="font-semibold text-[#1a1a1a] mb-2">Scripture Reference</h4>
                    <p className="text-sm text-[#865014] font-medium">{selectedDevotional.verse_reference}</p>
                    {selectedDevotional.verse_text && (
                      <p className="text-sm text-[#1a1a1a] mt-2 italic">{selectedDevotional.verse_text}</p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t border-[#E0AE3F]/10">
            <Button variant="outline" onClick={() => setActiveDialog(null)} className="border-[#E0AE3F]/20 hover:bg-[#F6EBD8]">
              Close Preview
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={activeDialog === 'share'} onOpenChange={() => setActiveDialog(null)}>
        <DialogContent className="max-w-md border-[#E0AE3F]/20">
          <DialogHeader>
            <DialogTitle className="text-[#1a1a1a] flex items-center gap-2">
              <Share2 className="h-5 w-5 text-[#865014]" />
              Share Devotional
            </DialogTitle>
            <DialogDescription className="text-[#865014]/60">
              Share this devotional with your congregation
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <Button variant="outline" className="flex flex-col items-center gap-1 h-auto py-4 border-[#E0AE3F]/20 hover:bg-[#F6EBD8]">
                <Share2 className="h-6 w-6 text-blue-500" />
                <span className="text-xs">Facebook</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center gap-1 h-auto py-4 border-[#E0AE3F]/20 hover:bg-[#F6EBD8]">
                <Share2 className="h-6 w-6 text-sky-500" />
                <span className="text-xs">Twitter</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center gap-1 h-auto py-4 border-[#E0AE3F]/20 hover:bg-[#F6EBD8]">
                <Share2 className="h-6 w-6 text-emerald-500" />
                <span className="text-xs">WhatsApp</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center gap-1 h-auto py-4 border-[#E0AE3F]/20 hover:bg-[#F6EBD8]">
                <MessageCircle className="h-6 w-6 text-purple-500" />
                <span className="text-xs">Telegram</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center gap-1 h-auto py-4 border-[#E0AE3F]/20 hover:bg-[#F6EBD8]">
                <Mail className="h-6 w-6 text-red-500" />
                <span className="text-xs">Email</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center gap-1 h-auto py-4 border-[#E0AE3F]/20 hover:bg-[#F6EBD8]">
                <Copy className="h-6 w-6 text-gray-500" />
                <span className="text-xs">Copy Link</span>
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Input 
                value={window.location.href}
                readOnly
                className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30 flex-1"
              />
              <Button 
                variant="outline" 
                className="border-[#E0AE3F]/20 hover:bg-[#F6EBD8]"
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  toast.success('Link copied to clipboard');
                }}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex justify-end pt-4 border-t border-[#E0AE3F]/10">
              <Button variant="outline" onClick={() => setActiveDialog(null)} className="border-[#E0AE3F]/20 hover:bg-[#F6EBD8]">
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Stats Dialog */}
      <Dialog open={activeDialog === 'stats'} onOpenChange={() => setActiveDialog(null)}>
        <DialogContent className="max-w-2xl border-[#E0AE3F]/20">
          <DialogHeader>
            <DialogTitle className="text-[#1a1a1a] flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#865014]" />
              Devotional Analytics
            </DialogTitle>
            <DialogDescription className="text-[#865014]/60">
              Performance metrics for {selectedDevotional?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Card className="border-[#E0AE3F]/10">
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs text-[#865014]/60">Total Views</CardDescription>
                  <CardTitle className="text-2xl text-[#1a1a1a]">{selectedDevotional?.views || 0}</CardTitle>
                </CardHeader>
              </Card>
              <Card className="border-[#E0AE3F]/10">
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs text-[#865014]/60">Engagement Rate</CardDescription>
                  <CardTitle className="text-2xl text-[#1a1a1a]">
                    {selectedDevotional && selectedDevotional.views > 0 
                      ? `${Math.round(((selectedDevotional.likes + selectedDevotional.comments + selectedDevotional.shares) / selectedDevotional.views) * 100)}%`
                      : '0%'}
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card className="border-[#E0AE3F]/10">
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs text-[#865014]/60">Avg. Read Time</CardDescription>
                  <CardTitle className="text-2xl text-[#1a1a1a]">{selectedDevotional?.reading_time || 0}m</CardTitle>
                </CardHeader>
              </Card>
              <Card className="border-[#E0AE3F]/10">
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs text-[#865014]/60">Bookmarks</CardDescription>
                  <CardTitle className="text-2xl text-[#1a1a1a]">{selectedDevotional?.bookmarks || 0}</CardTitle>
                </CardHeader>
              </Card>
            </div>
            <Card className="border-[#E0AE3F]/10">
              <CardHeader>
                <CardTitle className="text-sm text-[#1a1a1a]">Engagement Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-[#865014]/60">Likes</span>
                      <span className="font-medium">{selectedDevotional?.likes || 0}</span>
                    </div>
                    <Progress value={selectedDevotional ? (selectedDevotional.likes / (selectedDevotional.views || 1)) * 100 : 0} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-[#865014]/60">Comments</span>
                      <span className="font-medium">{selectedDevotional?.comments || 0}</span>
                    </div>
                    <Progress value={selectedDevotional ? (selectedDevotional.comments / (selectedDevotional.views || 1)) * 100 : 0} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-[#865014]/60">Shares</span>
                      <span className="font-medium">{selectedDevotional?.shares || 0}</span>
                    </div>
                    <Progress value={selectedDevotional ? (selectedDevotional.shares / (selectedDevotional.views || 1)) * 100 : 0} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="flex justify-end pt-4 border-t border-[#E0AE3F]/10">
              <Button variant="outline" onClick={() => setActiveDialog(null)} className="border-[#E0AE3F]/20 hover:bg-[#F6EBD8]">
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Schedule Dialog */}
      <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
        <DialogContent className="max-w-md border-[#E0AE3F]/20">
          <DialogHeader>
            <DialogTitle className="text-[#1a1a1a] flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#865014]" />
              Schedule Devotional
            </DialogTitle>
            <DialogDescription className="text-[#865014]/60">
              Choose the date and time to publish this devotional
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Date Picker */}
            <div>
              <Label className="text-[#1a1a1a] font-medium">Date</Label>
              <div className="relative mt-1">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#865014]/40" />
                <Input
                  type="date"
                  value={scheduleData.date}
                  onChange={(e) => setScheduleData({ ...scheduleData, date: e.target.value })}
                  className="pl-9 border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            {/* Time Picker */}
            <div>
              <Label className="text-[#1a1a1a] font-medium">Time (24-hour format)</Label>
              <div className="relative mt-1">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#865014]/40" />
                <Input
                  type="time"
                  value={scheduleData.time}
                  onChange={(e) => setScheduleData({ ...scheduleData, time: e.target.value })}
                  className="pl-9 border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30"
                  step="60"
                />
              </div>
              <p className="text-xs text-[#865014]/40 mt-1">Format: HH:MM (24-hour)</p>
            </div>

            {/* Timezone */}
            <div>
              <Label className="text-[#1a1a1a] font-medium">Timezone</Label>
              <select
                className="w-full px-3 py-2 rounded-lg border border-[#E0AE3F]/20 focus:ring-2 focus:ring-[#865014]/30 focus:outline-none mt-1 bg-white"
                value={scheduleData.timezone}
                onChange={(e) => setScheduleData({ ...scheduleData, timezone: e.target.value })}
              >
                <option value="GMT+3">GMT+3 (East Africa Time)</option>
                <option value="GMT+2">GMT+2 (Central Africa Time)</option>
                <option value="GMT+1">GMT+1 (West Africa Time)</option>
                <option value="GMT+0">GMT+0 (UTC)</option>
                <option value="GMT-1">GMT-1</option>
                <option value="GMT-2">GMT-2</option>
                <option value="GMT-3">GMT-3</option>
                <option value="GMT-4">GMT-4</option>
                <option value="GMT-5">GMT-5</option>
                <option value="GMT-6">GMT-6</option>
                <option value="GMT-7">GMT-7</option>
                <option value="GMT-8">GMT-8</option>
                <option value="GMT-9">GMT-9</option>
                <option value="GMT-10">GMT-10</option>
                <option value="GMT-11">GMT-11</option>
                <option value="GMT-12">GMT-12</option>
              </select>
            </div>

            {/* Featured Today Option */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="makeFeatured"
                checked={scheduleData.makeFeatured}
                onChange={(e) => setScheduleData({ ...scheduleData, makeFeatured: e.target.checked })}
                className="w-4 h-4 accent-[#865014]"
              />
              <Label htmlFor="makeFeatured" className="text-[#1a1a1a]">Make featured today when published</Label>
            </div>

            {/* Preview of scheduled date/time */}
            <div className="bg-[#F6EBD8]/20 rounded-lg p-3 border border-[#E0AE3F]/10">
              <p className="text-sm text-[#865014]/60">Scheduled for:</p>
              <p className="text-sm font-medium text-[#1a1a1a]">
                {scheduleData.date && scheduleData.time ? (
                  new Date(`${scheduleData.date}T${scheduleData.time}:00`).toLocaleString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZone: 'Africa/Nairobi',
                  })
                ) : (
                  <span className="text-[#865014]/40">Select date and time</span>
                )}
              </p>
              <p className="text-xs text-[#865014]/40 mt-1">Timezone: {scheduleData.timezone}</p>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-[#E0AE3F]/10">
            <Button 
              variant="outline" 
              onClick={() => setScheduleDialogOpen(false)} 
              className="border-[#E0AE3F]/20 hover:bg-[#F6EBD8]"
            >
              Cancel
            </Button>
            <Button 
              className="bg-[#865014] hover:bg-[#865014]/90 text-white" 
              onClick={confirmSchedule}
              disabled={saving || !scheduleData.date || !scheduleData.time}
            >
              <Calendar className="h-4 w-4 mr-2" />
              {saving ? 'Scheduling...' : 'Schedule'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Mock data for development
const mockDevotionals: Devotional[] = [
  {
    id: 1,
    title: "Walking in God's Grace",
    content: "Grace is not just a concept; it's the very foundation of our relationship with God. When we understand that we are saved by grace through faith, we begin to live in the freedom that Christ has given us. This devotional explores the depth of God's grace and how it transforms our daily walk with Him.",
    header: "Grace and Faith",
    subtitle: "Understanding the transformative power of God's grace",
    excerpt: "Understanding the transformative power of God's grace in our daily lives",
    verse_reference: "Ephesians 2:8",
    verse_text: "For it is by grace you have been saved, through faith—and this is not from yourselves, it is the gift of God—",
    category: "Grace",
    tags: ["grace", "salvation", "faith"],
    featured_image: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800",
    video_url: "",
    audio_url: "",
    slug: "walking-in-gods-grace",
    status: "published",
    is_featured_today: true,
    is_pinned: false,
    views: 1250,
    likes: 89,
    comments: 23,
    shares: 45,
    bookmarks: 67,
    reading_time: 5,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
    published_at: "2024-01-15T10:00:00Z",
    author_id: 1,
    author_name: "Pastor John Smith",
  },
  {
    id: 2,
    title: "The Power of Prayer",
    content: "Prayer is our direct line of communication with God. It's not just about asking for things, but about building a relationship with our Heavenly Father. Through prayer, we find strength, guidance, and peace that surpasses all understanding.",
    header: "Prayer and Communication",
    subtitle: "Discovering the transformative power of prayer",
    excerpt: "Discovering the transformative power of prayer in your spiritual journey",
    verse_reference: "Philippians 4:6",
    verse_text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.",
    category: "Prayer",
    tags: ["prayer", "worship", "communication"],
    featured_image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800",
    video_url: "",
    audio_url: "",
    slug: "power-of-prayer",
    status: "draft",
    is_featured_today: false,
    is_pinned: true,
    views: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    bookmarks: 0,
    reading_time: 4,
    created_at: "2024-01-12T10:00:00Z",
    updated_at: "2024-01-12T10:00:00Z",
    published_at: "",
    author_id: 1,
    author_name: "Pastor John Smith",
  },
];