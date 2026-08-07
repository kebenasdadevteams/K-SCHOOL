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
} from 'lucide-react';

type Promotion = {
  id: number;
  title: string;
  header: string;
  description: string;
  content: string;
  slug: string;
  category: string;
  promotion_type: string;
  media_type: 'image' | 'video' | 'none';
  image_url: string;
  video_url: string;
  thumbnail_url: string;
  location: string;
  address: string;
  speaker: string;
  organizer: string;
  event_date: string;
  start_time: string;
  end_time: string;
  status: 'draft' | 'scheduled' | 'published' | 'expired' | 'archived';
  is_featured: boolean;
  show_on_homepage: boolean;
  allow_download: boolean;
  allow_share: boolean;
  publish_at: string;
  published_at: string;
  created_by: number;
  created_by_name: string;
  created_at: string;
  updated_at: string;
};

type PromotionStats = {
  total: number;
  published: number;
  scheduled: number;
  drafts: number;
  expired: number;
  archived: number;
  videos: number;
  images: number;
};

type ScheduleData = {
  date: string;
  time: string;
  timezone: string;
};

const PROMOTION_TYPES = [
  'Event', 'Conference', 'Youth', 'Worship', 'Community',
  'Announcement', 'Training', 'Seminar', 'Special Program',
  'Choir', 'Children', 'Prayer', 'Evangelism', 'Other'
];

const CATEGORIES = [
  'General', 'Church', 'Youth', 'Children', 'Worship',
  'Prayer', 'Evangelism', 'Community', 'Special', 'Other'
];

export default function ManagePromotions() {
  const location = useLocation();
  const navigate = useNavigate();
  const locationState = location.state as { role?: string; userName?: string; userEmail?: string } | null;

  const [user] = useState({
    full_name: locationState?.userName || 'Admin User',
    email: locationState?.userEmail || 'admin@church.com',
    role: locationState?.role || 'admin',
  });

  // States
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeDialog, setActiveDialog] = useState<null | 'promotion' | 'preview' | 'share' | 'schedule' | 'delete' | 'publish'>(null);
  const [promotionDraft, setPromotionDraft] = useState<Partial<Promotion>>({});
  const [stats, setStats] = useState<PromotionStats>({
    total: 0, published: 0, scheduled: 0, drafts: 0,
    expired: 0, archived: 0, videos: 0, images: 0
  });
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile' | 'tablet'>('desktop');

  // Date Range State
  const [isDateRange, setIsDateRange] = useState(false);
  const [eventDateEnd, setEventDateEnd] = useState('');

  // Schedule Dialog State
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [schedulingId, setSchedulingId] = useState<number | null>(null);
  const [scheduleData, setScheduleData] = useState<ScheduleData>({
    date: '',
    time: '',
    timezone: 'GMT+3',
  });

  // Publish Dialog State
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [publishingId, setPublishingId] = useState<number | null>(null);
  const [publishSuccess, setPublishSuccess] = useState(false);

  // File upload refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Load promotions
  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    try {
      setLoading(true);
      const [promoRes, statsRes] = await Promise.all([
        api.get('/promotions'),
        api.get('/promotions/stats')
      ]);

      setPromotions(promoRes.data?.data || []);
      setStats(statsRes.data?.data || {});
    } catch (error: any) {
      console.error('Failed to load promotions:', error);
      toast.error('Failed to load promotions');
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      const response = await api.post('/promotions/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setUploadProgress(progress);
        }
      });

      return response.data.data.url;
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload file');
      throw error;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadFile(file);
      const isVideo = file.type.startsWith('video/');
      setPromotionDraft({
        ...promotionDraft,
        media_type: isVideo ? 'video' : 'image',
        [isVideo ? 'video_url' : 'image_url']: url,
        thumbnail_url: isVideo ? url : url,
      });
      toast.success(`${isVideo ? '🎬 Video' : '📸 Image'} uploaded successfully`);
    } catch (error) {
      // Handle error
    }
    event.target.value = '';
  };

  const createPromotion = async () => {
    try {
      setSaving(true);
      const payload = {
        ...promotionDraft,
        status: 'draft',
        created_by: 1,
      };

      const response = await api.post('/promotions', payload);
      setPromotions([response.data.data, ...promotions]);
      setActiveDialog(null);
      setPromotionDraft({});
      toast.success('✨ Promotion created successfully!');
      loadPromotions();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create promotion');
    } finally {
      setSaving(false);
    }
  };

  const updatePromotion = async () => {
    if (!selectedPromotion) return;

    try {
      setSaving(true);
      const payload = {
        ...selectedPromotion,
        ...promotionDraft,
      };

      await api.put(`/promotions/${selectedPromotion.id}`, payload);
      setPromotions(promotions.map(p => p.id === selectedPromotion.id ? { ...p, ...payload } : p));
      setActiveDialog(null);
      setPromotionDraft({});
      toast.success('✅ Promotion updated successfully!');
      loadPromotions();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update promotion');
    } finally {
      setSaving(false);
    }
  };

  const publishPromotion = async (id: number) => {
    setPublishingId(id);
    setPublishSuccess(false);
    setPublishDialogOpen(true);
  };

  const confirmPublish = async () => {
    if (!publishingId) return;

    try {
      setSaving(true);
      await api.post(`/promotions/${publishingId}/publish`);
      setPublishSuccess(true);
      toast.success('🎉 Promotion published successfully!');
      loadPromotions();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to publish promotion');
      setPublishSuccess(false);
    } finally {
      setSaving(false);
    }
  };

  const closePublishDialog = () => {
    setPublishDialogOpen(false);
    setPublishingId(null);
    setPublishSuccess(false);
  };

  const deletePromotion = async (id: number, permanent: boolean = false) => {
    try {
      setSaving(true);
      await api.delete(`/promotions/${id}${permanent ? '?permanent=true' : ''}`);
      toast.success(permanent ? '🗑️ Promotion permanently deleted' : '📦 Promotion archived');
      setActiveDialog(null);
      loadPromotions();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete promotion');
    } finally {
      setSaving(false);
    }
  };

  const openScheduleDialog = (id: number) => {
    setSchedulingId(id);
    const now = new Date();
    setScheduleData({
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().slice(0, 5),
      timezone: 'GMT+3',
    });
    setScheduleDialogOpen(true);
  };

  const confirmSchedule = async () => {
    if (!schedulingId) return;
    const { date, time } = scheduleData;
    if (!date || !time) {
      toast.error('Please select both date and time');
      return;
    }

    const dateTime = new Date(`${date}T${time}:00`);
    const publishAt = dateTime.toISOString();

    try {
      setSaving(true);
      await api.post(`/promotions/${schedulingId}/schedule`, { publish_at: publishAt });
      toast.success('📅 Promotion scheduled successfully!');
      setScheduleDialogOpen(false);
      loadPromotions();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to schedule promotion');
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-emerald-500';
      case 'scheduled': return 'bg-purple-500';
      case 'expired': return 'bg-gray-500';
      case 'archived': return 'bg-gray-700';
      default: return 'bg-amber-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published': return <CheckCircle className="h-4 w-4" />;
      case 'scheduled': return <Calendar className="h-4 w-4" />;
      case 'expired': return <Clock className="h-4 w-4" />;
      case 'archived': return <Archive className="h-4 w-4" />;
      default: return <Edit3 className="h-4 w-4" />;
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

  const formatTime = (timeString?: string) => {
    if (!timeString) return '';
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filterByStatus = (status: string) => {
    setFilterStatus(status);
  };

  const filteredPromotions = useMemo(() => {
    let result = promotions;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term) ||
        p.category?.toLowerCase().includes(term) ||
        p.media_type?.toLowerCase().includes(term)
      );
    }
    if (filterStatus !== 'all') {
      result = result.filter(p => p.status === filterStatus);
    }
    if (filterCategory !== 'all') {
      result = result.filter(p => p.category === filterCategory);
    }
    if (filterType !== 'all') {
      result = result.filter(p => p.promotion_type === filterType);
    }
    return result;
  }, [promotions, searchTerm, filterStatus, filterCategory, filterType]);

  if (loading && promotions.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#865014] mx-auto mb-4" />
          <p className="text-[#865014]/60">Loading promotions...</p>
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
              <Star className="h-8 w-8 text-[#865014]" />
              Promotion Management
            </h1>
            <p className="text-sm text-[#865014]/60 mt-1">
              Create, schedule, publish, edit and manage all promotional content displayed on the landing page.
            </p>
          </div>
          <Button 
            className="bg-[#865014] hover:bg-[#865014]/90 text-white shadow-lg shadow-[#865014]/20"
            onClick={() => {
              setSelectedPromotion(null);
              setPromotionDraft({});
              setActiveDialog('promotion');
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Promotion
          </Button>
        </div>
      </div>

      {/* Stats Cards - All Clickable */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-8 gap-3">
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
          onClick={() => filterByStatus('published')}
        >
          <CardHeader className="pb-2">
            <CardDescription className="text-xs text-emerald-600">Published</CardDescription>
            <CardTitle className="text-xl text-emerald-700">{stats.published}</CardTitle>
          </CardHeader>
        </Card>
        <Card 
          className={`border-purple-200 bg-purple-50/30 cursor-pointer hover:shadow-lg transition-all ${filterStatus === 'scheduled' ? 'ring-2 ring-purple-500' : ''}`}
          onClick={() => filterByStatus('scheduled')}
        >
          <CardHeader className="pb-2">
            <CardDescription className="text-xs text-purple-600">Scheduled</CardDescription>
            <CardTitle className="text-xl text-purple-700">{stats.scheduled}</CardTitle>
          </CardHeader>
        </Card>
        <Card 
          className={`border-amber-200 bg-amber-50/30 cursor-pointer hover:shadow-lg transition-all ${filterStatus === 'draft' ? 'ring-2 ring-amber-500' : ''}`}
          onClick={() => filterByStatus('draft')}
        >
          <CardHeader className="pb-2">
            <CardDescription className="text-xs text-amber-600">Drafts</CardDescription>
            <CardTitle className="text-xl text-amber-700">{stats.drafts}</CardTitle>
          </CardHeader>
        </Card>
        <Card 
          className={`border-gray-200 bg-gray-50/30 cursor-pointer hover:shadow-lg transition-all ${filterStatus === 'expired' ? 'ring-2 ring-gray-500' : ''}`}
          onClick={() => filterByStatus('expired')}
        >
          <CardHeader className="pb-2">
            <CardDescription className="text-xs text-gray-600">Expired</CardDescription>
            <CardTitle className="text-xl text-gray-700">{stats.expired}</CardTitle>
          </CardHeader>
        </Card>
        <Card 
          className={`border-red-200 bg-red-50/30 cursor-pointer hover:shadow-lg transition-all ${filterStatus === 'archived' ? 'ring-2 ring-red-500' : ''}`}
          onClick={() => filterByStatus('archived')}
        >
          <CardHeader className="pb-2">
            <CardDescription className="text-xs text-red-600">Archived</CardDescription>
            <CardTitle className="text-xl text-red-700">{stats.archived}</CardTitle>
          </CardHeader>
        </Card>
        <Card 
          className="border-blue-200 bg-blue-50/30 cursor-pointer hover:shadow-lg transition-all"
          onClick={() => {
            setFilterStatus('all');
            setSearchTerm('video');
          }}
        >
          <CardHeader className="pb-2">
            <CardDescription className="text-xs text-blue-600">Videos</CardDescription>
            <CardTitle className="text-xl text-blue-700">{stats.videos}</CardTitle>
          </CardHeader>
        </Card>
        <Card 
          className="border-green-200 bg-green-50/30 cursor-pointer hover:shadow-lg transition-all"
          onClick={() => {
            setFilterStatus('all');
            setSearchTerm('image');
          }}
        >
          <CardHeader className="pb-2">
            <CardDescription className="text-xs text-green-600">Images</CardDescription>
            <CardTitle className="text-xl text-green-700">{stats.images}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#865014]/40" />
          <Input
            placeholder="Search promotions..."
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
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
            <option value="expired">Expired</option>
            <option value="archived">Archived</option>
          </select>
          <select
            className="px-4 py-2 rounded-lg border border-[#E0AE3F]/20 focus:ring-2 focus:ring-[#865014]/30 focus:outline-none bg-white"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            className="px-4 py-2 rounded-lg border border-[#E0AE3F]/20 focus:ring-2 focus:ring-[#865014]/30 focus:outline-none bg-white"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Types</option>
            {PROMOTION_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <Button variant="outline" onClick={loadPromotions} className="border-[#E0AE3F]/20 hover:bg-[#F6EBD8]">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Promotions Grid/List */}
      {filteredPromotions.length === 0 ? (
        <Card className="border-dashed border-2 border-[#E0AE3F]/30">
          <CardContent className="text-center py-16">
            <Star className="h-16 w-16 text-[#865014]/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[#1a1a1a] mb-2">No promotions yet</h3>
            <p className="text-[#865014]/60 mb-6">Create your first promotion to share with your congregation.</p>
            <Button 
              className="bg-[#865014] hover:bg-[#865014]/90 text-white"
              onClick={() => {
                setSelectedPromotion(null);
                setPromotionDraft({});
                setActiveDialog('promotion');
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Promotion
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-4`}>
          {filteredPromotions.map((promotion) => (
            <Card 
              key={promotion.id} 
              className="border-[#E0AE3F]/10 hover:shadow-lg transition-all cursor-pointer group overflow-hidden"
              onClick={() => {
                setSelectedPromotion(promotion);
                setActiveDialog('preview');
              }}
            >
              <div className="relative h-48 overflow-hidden">
                {promotion.media_type === 'image' && promotion.image_url && (
                  <img 
                    src={promotion.image_url} 
                    alt={promotion.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
                {promotion.media_type === 'video' && promotion.video_url && (
                  <div className="relative w-full h-full bg-black">
                    <video className="w-full h-full object-cover" muted>
                      <source src={promotion.video_url} />
                    </video>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center">
                        <svg className="w-8 h-8 text-[#865014]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  <Badge className={getStatusColor(promotion.status)}>
                    {getStatusIcon(promotion.status)}
                    <span className="ml-1">{promotion.status}</span>
                  </Badge>
                </div>
                {promotion.is_featured && (
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-amber-500">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  </div>
                )}
                {promotion.event_date && (
                  <div className="absolute bottom-2 left-2">
                    <Badge className="bg-[#865014]/80 text-white">
                      <CalendarDays className="h-3 w-3 mr-1" />
                      {formatDate(promotion.event_date)}
                    </Badge>
                  </div>
                )}
              </div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-[#1a1a1a] group-hover:text-[#865014] transition-colors line-clamp-1">
                      {promotion.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 mt-1">
                      {promotion.description || promotion.header}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#865014]/60">Type</span>
                    <Badge variant="outline" className="border-[#E0AE3F]/20 text-[#865014]">
                      {promotion.promotion_type}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#865014]/60">Category</span>
                    <span className="font-medium">{promotion.category}</span>
                  </div>
                  {promotion.location && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#865014]/60">Location</span>
                      <span className="font-medium truncate max-w-[120px]">{promotion.location}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#865014]/60">Media</span>
                    <Badge variant="outline" className="border-[#E0AE3F]/20">
                      {promotion.media_type === 'video' ? '🎬 Video' : '🖼️ Image'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-[#E0AE3F]/10">
                    <span className="text-xs text-[#865014]/40">
                      {formatDate(promotion.published_at || promotion.created_at)}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-[#E0AE3F]/20 hover:bg-[#F6EBD8]"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPromotion(promotion);
                          setPromotionDraft(promotion);
                          setActiveDialog('promotion');
                        }}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      {promotion.status === 'draft' && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-emerald-500 hover:bg-emerald-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            publishPromotion(promotion.id);
                          }}
                          disabled={saving}
                        >
                          <Rocket className="h-4 w-4" />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-red-400 hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPromotion(promotion);
                          setActiveDialog('delete');
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

      {/* Create/Edit Promotion Dialog */}
      <Dialog open={activeDialog === 'promotion'} onOpenChange={(open) => {
        if (!open) {
          setActiveDialog(null);
          setPromotionDraft({});
          setIsDateRange(false);
          setEventDateEnd('');
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-[#E0AE3F]/20">
          <DialogHeader>
            <DialogTitle className="text-2xl text-[#1a1a1a] flex items-center gap-2">
              {selectedPromotion ? <Edit3 className="h-6 w-6 text-[#865014]" /> : <Plus className="h-6 w-6 text-[#865014]" />}
              {selectedPromotion ? 'Edit Promotion' : 'Create New Promotion'}
            </DialogTitle>
            <DialogDescription className="text-[#865014]/60">
              {selectedPromotion ? 'Update your promotion details' : 'Create a new promotion for your congregation'}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="basic" className="mt-4">
            <TabsList className="bg-[#F6EBD8]/30 flex-wrap">
              <TabsTrigger value="basic" className="data-[state=active]:bg-white">Basic Info</TabsTrigger>
              <TabsTrigger value="media" className="data-[state=active]:bg-white">Media</TabsTrigger>
              <TabsTrigger value="event" className="data-[state=active]:bg-white">Event Details</TabsTrigger>
              <TabsTrigger value="content" className="data-[state=active]:bg-white">Content</TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-white">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 pt-4">
              <div>
                <Label className="text-[#1a1a1a] font-medium">Title *</Label>
                <Input 
                  value={promotionDraft.title || selectedPromotion?.title || ''}
                  onChange={(e) => setPromotionDraft({ ...promotionDraft, title: e.target.value })}
                  className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30 mt-1"
                  placeholder="Enter promotion title"
                />
              </div>
              <div>
                <Label className="text-[#1a1a1a] font-medium">Header</Label>
                <Input 
                  value={promotionDraft.header || selectedPromotion?.header || ''}
                  onChange={(e) => setPromotionDraft({ ...promotionDraft, header: e.target.value })}
                  className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30 mt-1"
                  placeholder="Short header/tagline"
                />
              </div>
              <div>
                <Label className="text-[#1a1a1a] font-medium">Short Description</Label>
                <Textarea 
                  value={promotionDraft.description || selectedPromotion?.description || ''}
                  onChange={(e) => setPromotionDraft({ ...promotionDraft, description: e.target.value })}
                  className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30 mt-1"
                  placeholder="Brief description for the card"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-[#1a1a1a] font-medium">Category</Label>
                  <select
                    className="w-full px-3 py-2 rounded-lg border border-[#E0AE3F]/20 focus:ring-2 focus:ring-[#865014]/30 focus:outline-none mt-1 bg-white"
                    value={promotionDraft.category || selectedPromotion?.category || 'General'}
                    onChange={(e) => setPromotionDraft({ ...promotionDraft, category: e.target.value })}
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label className="text-[#1a1a1a] font-medium">Promotion Type</Label>
                  <select
                    className="w-full px-3 py-2 rounded-lg border border-[#E0AE3F]/20 focus:ring-2 focus:ring-[#865014]/30 focus:outline-none mt-1 bg-white"
                    value={promotionDraft.promotion_type || selectedPromotion?.promotion_type || 'Event'}
                    onChange={(e) => setPromotionDraft({ ...promotionDraft, promotion_type: e.target.value })}
                  >
                    {PROMOTION_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="media" className="space-y-4 pt-4">
              <div className="border-2 border-dashed border-[#E0AE3F]/30 rounded-lg p-8 text-center hover:border-[#865014]/50 transition-colors">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <Upload className="h-12 w-12 text-[#865014]/40 mx-auto mb-4" />
                <p className="text-sm text-[#1a1a1a] font-medium">Drag & drop or click to upload</p>
                <p className="text-xs text-[#865014]/40 mt-1">Supports PNG, JPG, JPEG, WEBP, MP4, MOV, WebM</p>
                <div className="flex items-center justify-center gap-4 mt-4">
                  <Button 
                    variant="outline" 
                    className="border-[#E0AE3F]/20 hover:bg-[#F6EBD8]"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    <Image className="h-4 w-4 mr-2" />
                    Upload Image
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-[#E0AE3F]/20 hover:bg-[#F6EBD8]"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Upload Video
                  </Button>
                </div>
                {isUploading && (
                  <div className="mt-4">
                    <Progress value={uploadProgress} className="h-2" />
                    <p className="text-xs text-[#865014]/40 mt-1">{uploadProgress}% uploaded</p>
                  </div>
                )}
              </div>

              {(promotionDraft.image_url || selectedPromotion?.image_url) && (
                <div className="rounded-lg border border-[#E0AE3F]/20 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Image className="h-5 w-5 text-[#865014]" />
                      <span className="text-sm font-medium">Image uploaded</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-red-400 hover:bg-red-50"
                      onClick={() => setPromotionDraft({ ...promotionDraft, image_url: '' })}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <img 
                    src={promotionDraft.image_url || selectedPromotion?.image_url} 
                    alt="Preview" 
                    className="mt-2 rounded-lg max-h-48 object-contain"
                  />
                </div>
              )}

              {(promotionDraft.video_url || selectedPromotion?.video_url) && (
                <div className="rounded-lg border border-[#E0AE3F]/20 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Video className="h-5 w-5 text-[#865014]" />
                      <span className="text-sm font-medium">Video uploaded</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-red-400 hover:bg-red-50"
                      onClick={() => setPromotionDraft({ ...promotionDraft, video_url: '' })}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <video className="mt-2 rounded-lg max-h-48" controls>
                    <source src={promotionDraft.video_url || selectedPromotion?.video_url} />
                  </video>
                </div>
              )}
            </TabsContent>

            <TabsContent value="event" className="space-y-4 pt-4">
              {/* Date Range Toggle */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isDateRange"
                  checked={isDateRange}
                  onChange={(e) => {
                    setIsDateRange(e.target.checked);
                    if (!e.target.checked) {
                      setEventDateEnd('');
                    }
                  }}
                  className="w-4 h-4 accent-[#865014]"
                />
                <Label htmlFor="isDateRange" className="text-[#1a1a1a]">This is a multi-day event (date range)</Label>
              </div>

              <div>
                <Label className="text-[#1a1a1a] font-medium">
                  {isDateRange ? 'Start Date' : 'Event Date'}
                </Label>
                <Input 
                  type="date"
                  value={promotionDraft.event_date || selectedPromotion?.event_date || ''}
                  onChange={(e) => setPromotionDraft({ ...promotionDraft, event_date: e.target.value })}
                  className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30 mt-1"
                />
              </div>

              {isDateRange && (
                <div>
                  <Label className="text-[#1a1a1a] font-medium">End Date</Label>
                  <Input 
                    type="date"
                    value={eventDateEnd}
                    onChange={(e) => setEventDateEnd(e.target.value)}
                    className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30 mt-1"
                    min={promotionDraft.event_date || selectedPromotion?.event_date || ''}
                  />
                  <p className="text-xs text-[#865014]/40 mt-1">The promotion will be displayed from start date to end date</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-[#1a1a1a] font-medium">Start Time</Label>
                  <Input 
                    type="time"
                    value={promotionDraft.start_time || selectedPromotion?.start_time || ''}
                    onChange={(e) => setPromotionDraft({ ...promotionDraft, start_time: e.target.value })}
                    className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30 mt-1"
                  />
                </div>
                <div>
                  <Label className="text-[#1a1a1a] font-medium">End Time</Label>
                  <Input 
                    type="time"
                    value={promotionDraft.end_time || selectedPromotion?.end_time || ''}
                    onChange={(e) => setPromotionDraft({ ...promotionDraft, end_time: e.target.value })}
                    className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30 mt-1"
                  />
                </div>
              </div>
              <div>
                <Label className="text-[#1a1a1a] font-medium">Location</Label>
                <Input 
                  value={promotionDraft.location || selectedPromotion?.location || ''}
                  onChange={(e) => setPromotionDraft({ ...promotionDraft, location: e.target.value })}
                  className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30 mt-1"
                  placeholder="Event location"
                />
              </div>
              <div>
                <Label className="text-[#1a1a1a] font-medium">Address</Label>
                <Textarea 
                  value={promotionDraft.address || selectedPromotion?.address || ''}
                  onChange={(e) => setPromotionDraft({ ...promotionDraft, address: e.target.value })}
                  className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30 mt-1"
                  placeholder="Full address"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-[#1a1a1a] font-medium">Speaker</Label>
                  <Input 
                    value={promotionDraft.speaker || selectedPromotion?.speaker || ''}
                    onChange={(e) => setPromotionDraft({ ...promotionDraft, speaker: e.target.value })}
                    className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30 mt-1"
                    placeholder="Speaker name"
                  />
                </div>
                <div>
                  <Label className="text-[#1a1a1a] font-medium">Organizer</Label>
                  <Input 
                    value={promotionDraft.organizer || selectedPromotion?.organizer || ''}
                    onChange={(e) => setPromotionDraft({ ...promotionDraft, organizer: e.target.value })}
                    className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30 mt-1"
                    placeholder="Organizer name"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="content" className="space-y-4 pt-4">
              <Label className="text-[#1a1a1a] font-medium">Full Content</Label>
              <Textarea 
                value={promotionDraft.content || selectedPromotion?.content || ''}
                onChange={(e) => setPromotionDraft({ ...promotionDraft, content: e.target.value })}
                className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30 mt-1 min-h-[200px]"
                placeholder="Write the full content here. This will be shown when Read More is clicked."
                rows={10}
              />
            </TabsContent>

            <TabsContent value="settings" className="space-y-4 pt-4">
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox"
                    id="show_homepage"
                    checked={promotionDraft.show_on_homepage !== undefined ? promotionDraft.show_on_homepage : selectedPromotion?.show_on_homepage !== false}
                    onChange={(e) => setPromotionDraft({ ...promotionDraft, show_on_homepage: e.target.checked })}
                    className="w-4 h-4 accent-[#865014]"
                  />
                  <Label htmlFor="show_homepage" className="text-[#1a1a1a]">Show on Landing Page</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox"
                    id="is_featured"
                    checked={promotionDraft.is_featured || selectedPromotion?.is_featured || false}
                    onChange={(e) => setPromotionDraft({ ...promotionDraft, is_featured: e.target.checked })}
                    className="w-4 h-4 accent-[#865014]"
                  />
                  <Label htmlFor="is_featured" className="text-[#1a1a1a]">Featured Promotion</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox"
                    id="allow_share"
                    checked={promotionDraft.allow_share !== undefined ? promotionDraft.allow_share : selectedPromotion?.allow_share !== false}
                    onChange={(e) => setPromotionDraft({ ...promotionDraft, allow_share: e.target.checked })}
                    className="w-4 h-4 accent-[#865014]"
                  />
                  <Label htmlFor="allow_share" className="text-[#1a1a1a]">Allow Sharing</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox"
                    id="allow_download"
                    checked={promotionDraft.allow_download || selectedPromotion?.allow_download || false}
                    onChange={(e) => setPromotionDraft({ ...promotionDraft, allow_download: e.target.checked })}
                    className="w-4 h-4 accent-[#865014]"
                  />
                  <Label htmlFor="allow_download" className="text-[#1a1a1a]">Allow Download</Label>
                </div>
              </div>

              <div>
                <Label className="text-[#1a1a1a] font-medium">Status</Label>
                <select
                  className="w-full px-3 py-2 rounded-lg border border-[#E0AE3F]/20 focus:ring-2 focus:ring-[#865014]/30 focus:outline-none mt-1 bg-white"
                  value={promotionDraft.status || selectedPromotion?.status || 'draft'}
                  onChange={(e) => setPromotionDraft({ ...promotionDraft, status: e.target.value as Promotion['status'] })}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Publish Now</option>
                  <option value="scheduled">Schedule</option>
                </select>
              </div>

              {promotionDraft.status === 'scheduled' && (
                <div>
                  <Label className="text-[#1a1a1a] font-medium">Publish Date/Time</Label>
                  <Input 
                    type="datetime-local"
                    value={promotionDraft.publish_at || selectedPromotion?.publish_at || ''}
                    onChange={(e) => setPromotionDraft({ ...promotionDraft, publish_at: e.target.value })}
                    className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30 mt-1"
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 pt-4 border-t border-[#E0AE3F]/10">
            <Button variant="outline" onClick={() => {
              setActiveDialog(null);
              setPromotionDraft({});
              setIsDateRange(false);
              setEventDateEnd('');
            }} className="border-[#E0AE3F]/20 hover:bg-[#F6EBD8]">
              Cancel
            </Button>
            <Button 
              className="bg-[#865014] hover:bg-[#865014]/90 text-white" 
              onClick={selectedPromotion ? updatePromotion : createPromotion} 
              disabled={saving}
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : selectedPromotion ? 'Update Promotion' : 'Create Promotion'}
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
              Promotion Preview
            </DialogTitle>
            <DialogDescription className="text-[#865014]/60">
              Preview how this promotion will appear
            </DialogDescription>
          </DialogHeader>
          {selectedPromotion && (
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
                <div className="border rounded-lg overflow-hidden">
                  {selectedPromotion.image_url && (
                    <img 
                      src={selectedPromotion.image_url} 
                      alt={selectedPromotion.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  {selectedPromotion.video_url && (
                    <div className="relative w-full bg-black" style={{ height: '200px' }}>
                      <video className="w-full h-full object-cover" muted controls>
                        <source src={selectedPromotion.video_url} />
                      </video>
                    </div>
                  )}
                  <div className="p-4">
                    {selectedPromotion.event_date && (
                      <div className="flex items-center gap-2 text-sm text-[#865014] mb-2">
                        <CalendarDays className="h-4 w-4" />
                        {formatDate(selectedPromotion.event_date)}
                        {selectedPromotion.start_time && ` at ${formatTime(selectedPromotion.start_time)}`}
                      </div>
                    )}
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-[#865014]">{selectedPromotion.category}</Badge>
                      <Badge variant="outline" className="border-[#E0AE3F]/20">{selectedPromotion.promotion_type}</Badge>
                    </div>
                    <h3 className="text-xl font-bold text-[#1a1a1a]">{selectedPromotion.title}</h3>
                    {selectedPromotion.header && (
                      <p className="text-sm text-[#865014]/60 mt-1">{selectedPromotion.header}</p>
                    )}
                    <p className="text-sm text-[#1a1a1a] mt-2">{selectedPromotion.description}</p>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" className="bg-[#865014] hover:bg-[#865014]/90 text-white">
                        Read More
                      </Button>
                      <Button size="sm" variant="outline" className="border-[#E0AE3F]/20">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[#E0AE3F]/10">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedPromotion(null);
                    setActiveDialog(null);
                  }} 
                  className="border-[#E0AE3F]/20 hover:bg-[#F6EBD8]"
                >
                  Close
                </Button>
                <Button 
                  className="bg-[#865014] hover:bg-[#865014]/90 text-white"
                  onClick={() => {
                    setPromotionDraft(selectedPromotion);
                    setActiveDialog('promotion');
                  }}
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                {selectedPromotion.status === 'draft' && (
                  <Button 
                    className="bg-emerald-500 hover:bg-emerald-600 text-white"
                    onClick={() => publishPromotion(selectedPromotion.id)}
                    disabled={saving}
                  >
                    <Rocket className="h-4 w-4 mr-2" />
                    Publish Now
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={activeDialog === 'delete'} onOpenChange={() => setActiveDialog(null)}>
        <DialogContent className="max-w-md border-[#E0AE3F]/20">
          <DialogHeader>
            <DialogTitle className="text-[#1a1a1a] flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Delete Promotion
            </DialogTitle>
            <DialogDescription className="text-[#865014]/60">
              Are you sure you want to delete "{selectedPromotion?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-4 border-t border-[#E0AE3F]/10">
            <Button variant="outline" onClick={() => setActiveDialog(null)} className="border-[#E0AE3F]/20 hover:bg-[#F6EBD8]">
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={() => selectedPromotion && deletePromotion(selectedPromotion.id)}
              disabled={saving}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {saving ? 'Deleting...' : 'Delete Permanently'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Publish Confirmation Dialog with Done button */}
      <Dialog open={publishDialogOpen} onOpenChange={(open) => {
        if (!open && !publishSuccess) {
          setPublishDialogOpen(false);
          setPublishingId(null);
        }
      }}>
        <DialogContent className="max-w-md border-[#E0AE3F]/20">
          {!publishSuccess ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-[#1a1a1a] flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-emerald-500" />
                  Publish Promotion
                </DialogTitle>
                <DialogDescription className="text-[#865014]/60">
                  Are you sure you want to publish this promotion?
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                {selectedPromotion && (
                  <div className="bg-[#F6EBD8]/20 rounded-lg p-4 border border-[#E0AE3F]/10">
                    <div className="flex items-center gap-3">
                      {selectedPromotion.image_url && (
                        <img 
                          src={selectedPromotion.image_url} 
                          alt={selectedPromotion.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      {selectedPromotion.video_url && (
                        <div className="w-16 h-16 bg-black rounded flex items-center justify-center">
                          <Video className="h-8 w-8 text-white" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[#1a1a1a] truncate">{selectedPromotion.title}</p>
                        <p className="text-sm text-[#865014]/60 truncate">{selectedPromotion.category}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className="bg-amber-500 text-white text-xs">Draft</Badge>
                          <span className="text-xs text-[#865014]/40">→</span>
                          <Badge className="bg-emerald-500 text-white text-xs">Published</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2 text-sm text-[#865014]/60">
                  <p className="font-medium text-[#1a1a1a]">When you publish:</p>
                  <ul className="space-y-1 pl-4 list-disc">
                    <li>✅ The promotion will be visible on the landing page</li>
                    <li>✅ It will appear in the promotions section</li>
                    <li>✅ Users will be able to view and share it</li>
                    <li>✅ It will be included in the homepage feed</li>
                  </ul>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-[#E0AE3F]/10">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setPublishDialogOpen(false);
                      setPublishingId(null);
                    }} 
                    className="border-[#E0AE3F]/20 hover:bg-[#F6EBD8]"
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="bg-emerald-500 hover:bg-emerald-600 text-white" 
                    onClick={confirmPublish}
                    disabled={saving}
                  >
                    <Rocket className="h-4 w-4 mr-2" />
                    {saving ? 'Publishing...' : 'Confirm Publish'}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="text-[#1a1a1a] flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-emerald-500" />
                  Success!
                </DialogTitle>
                <DialogDescription className="text-emerald-600">
                  Promotion has been published successfully!
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="flex justify-center py-6">
                  <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle className="h-12 w-12 text-emerald-500" />
                  </div>
                </div>

                <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200 text-center">
                  <p className="text-emerald-700 font-medium">
                    🎉 "{selectedPromotion?.title}" is now live!
                  </p>
                  <p className="text-sm text-emerald-600 mt-1">
                    The promotion has been published and is visible to all users.
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-[#E0AE3F]/10">
                  <Button 
                    className="bg-emerald-500 hover:bg-emerald-600 text-white" 
                    onClick={closePublishDialog}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Done
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Schedule Dialog */}
      <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
        <DialogContent className="max-w-md border-[#E0AE3F]/20">
          <DialogHeader>
            <DialogTitle className="text-[#1a1a1a] flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#865014]" />
              Schedule Promotion
            </DialogTitle>
            <DialogDescription className="text-[#865014]/60">
              Choose the date and time to publish this promotion
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-[#1a1a1a] font-medium">Date</Label>
              <Input 
                type="date"
                value={scheduleData.date}
                onChange={(e) => setScheduleData({ ...scheduleData, date: e.target.value })}
                className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30 mt-1"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <Label className="text-[#1a1a1a] font-medium">Time (24-hour)</Label>
              <Input 
                type="time"
                value={scheduleData.time}
                onChange={(e) => setScheduleData({ ...scheduleData, time: e.target.value })}
                className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30 mt-1"
              />
            </div>
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