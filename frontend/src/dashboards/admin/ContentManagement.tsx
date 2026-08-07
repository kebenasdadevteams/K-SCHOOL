// src/dashboards/admin/ContentManagement.tsx
import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Textarea } from '../../components/ui/textarea';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { 
  FileText, 
  Mic, 
  Edit, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  Loader2, 
  Plus,
  Search,
  User,
  Calendar,
  Tag,
  Sparkles,
  LayoutGrid,
  List,
  RefreshCw,
  Clock,
  AlertCircle,
  Archive,
  BookOpen,
  MessageSquare,
  XCircle,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import api from '../../services/api';

type ContentType = 'post' | 'podcast' | 'course';
type ContentStatus = 'draft' | 'submitted' | 'published' | 'archived';

type ContentItem = {
  id: number;
  title: string;
  type: ContentType;
  status: ContentStatus;
  author_name: string;
  body: string;
  category: string;
  created_at: string;
  updated_at?: string;
  audio_url?: string;
  image_url?: string;
  feedback?: string;
  published_at?: string;
};

const iconForType = (type: ContentType) => {
  if (type === 'podcast') return <Mic className="h-5 w-5 text-purple-500" />;
  if (type === 'course') return <BookOpen className="h-5 w-5 text-blue-500" />;
  return <FileText className="h-5 w-5 text-green-500" />;
};

const statusConfig: Record<string, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  draft: { 
    label: 'Draft', 
    color: 'bg-yellow-500/20 text-yellow-700 border-yellow-300', 
    icon: AlertCircle 
  },
  submitted: { 
    label: 'Under Review', 
    color: 'bg-blue-500/20 text-blue-700 border-blue-300', 
    icon: Clock 
  },
  published: { 
    label: 'Published', 
    color: 'bg-emerald-500/20 text-emerald-700 border-emerald-300', 
    icon: CheckCircle2 
  },
  archived: { 
    label: 'Archived', 
    color: 'bg-gray-500/20 text-gray-700 border-gray-300', 
    icon: Archive 
  }
};

export default function ContentManagement() {
  const location = useLocation();
  const locationState = location.state as { role?: string; userName?: string; userEmail?: string; view?: string } | null;
  const [role] = useState(locationState?.role || 'admin');
  const [filterType, setFilterType] = useState<'all' | 'post' | 'podcast' | 'course'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | ContentStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [allContent, setAllContent] = useState<ContentItem[]>([]);
  const [reviewQueue, setReviewQueue] = useState<ContentItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'preview' | 'edit'>('preview');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<'all' | 'review'>('all');

  const isAdmin = role === 'admin' || role === 'developer';

  const loadData = async () => {
    try {
      setLoading(true);
      const [allResponse, queueResponse] = await Promise.all([
        api.get('/content/all'),
        api.get('/content/review-queue'),
      ]);

      setAllContent((allResponse.data?.data || []) as ContentItem[]);
      setReviewQueue((queueResponse.data?.data || []) as ContentItem[]);
    } catch (error) {
      console.error('Unable to load content', error);
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredContent = useMemo(() => {
    let result = allContent;
    
    if (filterType !== 'all') {
      result = result.filter(item => item.type === filterType);
    }
    
    if (filterStatus !== 'all') {
      result = result.filter(item => item.status === filterStatus);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.title.toLowerCase().includes(query) ||
        item.author_name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      );
    }
    
    return result;
  }, [allContent, filterType, filterStatus, searchQuery]);

  const stats = useMemo(() => {
    const total = allContent.length;
    const published = allContent.filter(item => item.status === 'published').length;
    const drafts = allContent.filter(item => item.status === 'draft' || item.status === 'submitted').length;
    const archived = allContent.filter(item => item.status === 'archived').length;
    return { total, published, drafts, archived, review: reviewQueue.length };
  }, [allContent, reviewQueue]);

  const openReviewDialog = (item: ContentItem, mode: 'preview' | 'edit' = 'preview') => {
    setSelectedItem(item);
    setFeedbackText('');
    setModalMode(mode);
    setDialogOpen(true);
  };

  const handlePublish = async (item: ContentItem) => {
    if (!item) return;

    try {
      setSaving(true);
      await api.post(`/content/type/${item.type}/${item.id}/review`, {
        action: 'publish',
        title: item.title,
        body: item.body,
        category: item.category,
        audio_url: item.audio_url,
      });

      toast.success(`✅ "${item.title}" published successfully`);
      await loadData();
      setDialogOpen(false);
    } catch (error) {
      console.error('Unable to publish content', error);
      toast.error('Unable to publish this content right now');
    } finally {
      setSaving(false);
    }
  };

  const handleReject = async () => {
    if (!selectedItem || !feedbackText.trim()) {
      toast.error('Please provide feedback before rejecting.');
      return;
    }

    try {
      setSaving(true);
      await api.post(`/content/type/${selectedItem.type}/${selectedItem.id}/review`, {
        action: 'reject',
        feedback: feedbackText,
        title: selectedItem.title,
        body: selectedItem.body,
        category: selectedItem.category,
        audio_url: selectedItem.audio_url,
      });

      toast.success('📝 Feedback sent successfully');
      await loadData();
      setDialogOpen(false);
    } catch (error) {
      console.error('Unable to send feedback', error);
      toast.error('Unable to send feedback right now');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: ContentItem) => {
    if (!window.confirm(`⚠️ Delete "${item.title}"? This action cannot be undone.`)) return;

    try {
      await api.delete(`/content/type/${item.type}/${item.id}`);
      toast.success('🗑️ Content deleted');
      await loadData();
    } catch (error) {
      console.error('Unable to delete content', error);
      toast.error('Unable to delete this content right now');
    }
  };

  const handleSaveEdits = async () => {
    if (!selectedItem) return;

    try {
      setSaving(true);
      await api.put(`/content/type/${selectedItem.type}/${selectedItem.id}`, {
        title: selectedItem.title,
        body: selectedItem.body,
        category: selectedItem.category,
        status: selectedItem.status,
        audio_url: selectedItem.audio_url,
      });

      toast.success('💾 Changes saved successfully');
      await loadData();
      setDialogOpen(false);
    } catch (error) {
      console.error('Unable to save edits', error);
      toast.error('Unable to save these edits right now');
    } finally {
      setSaving(false);
    }
  };

  // Safe getStatusBadge with fallback
  const getStatusBadge = (status: string) => {
    const config = statusConfig[status] || statusConfig.draft;
    const Icon = config.icon;
    return (
      <Badge className={`${config.color} border font-medium`}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-50 via-white to-slate-50/50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-amber-500" />
            Content Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage, review, and publish content across your platform
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadData}
            className="border-slate-200 hover:bg-slate-100"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button 
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/30"
            onClick={() => {
              toast.info('Content creation coming soon!');
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Content
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs text-slate-500">Total</CardDescription>
            <CardTitle className="text-2xl text-slate-800">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-emerald-200 bg-emerald-50/50 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs text-emerald-600">Published</CardDescription>
            <CardTitle className="text-2xl text-emerald-700">{stats.published}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-yellow-200 bg-yellow-50/50 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs text-yellow-600">Drafts</CardDescription>
            <CardTitle className="text-2xl text-yellow-700">{stats.drafts}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-blue-200 bg-blue-50/50 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs text-blue-600">Review Queue</CardDescription>
            <CardTitle className="text-2xl text-blue-700">{stats.review}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-gray-200 bg-gray-50/50 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs text-gray-600">Archived</CardDescription>
            <CardTitle className="text-2xl text-gray-700">{stats.archived}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="w-full" onValueChange={(v) => setActiveTab(v as 'all' | 'review')}>
        <TabsList className="bg-slate-100/80 p-1">
          <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            All Content
          </TabsTrigger>
          <TabsTrigger value="review" className="data-[state=active]:bg-white data-[state=active]:shadow-sm relative">
            Review Queue
            {reviewQueue.length > 0 && (
              <Badge className="ml-2 bg-amber-500 text-white text-xs px-1.5">
                {reviewQueue.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 border-slate-200 focus-visible:ring-amber-500/30 bg-white"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <select
                className="px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-500/30 focus:outline-none bg-white"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
              >
                <option value="all">All Types</option>
                <option value="post">Posts</option>
                <option value="podcast">Podcasts</option>
                <option value="course">Courses</option>
              </select>
              <select
                className="px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-500/30 focus:outline-none bg-white"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="submitted">Under Review</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
              <div className="flex bg-white border border-slate-200 rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  className={viewMode === 'grid' ? 'bg-amber-500 text-white' : ''}
                  onClick={() => setViewMode('grid')}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  className={viewMode === 'list' ? 'bg-amber-500 text-white' : ''}
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Content Grid/List */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            </div>
          ) : filteredContent.length === 0 ? (
            <Card className="border-dashed border-2 border-slate-200">
              <CardContent className="text-center py-12">
                <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-600 mb-2">No content found</h3>
                <p className="text-sm text-slate-400">Try adjusting your filters or create new content</p>
              </CardContent>
            </Card>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredContent.map((item) => (
                <Card key={`${item.type}-${item.id}`} className="hover:shadow-lg transition-shadow border-slate-200 overflow-hidden group">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {iconForType(item.type)}
                        <span className="text-xs text-slate-500 uppercase tracking-wider">{item.type}</span>
                      </div>
                      {getStatusBadge(item.status)}
                    </div>
                    <CardTitle className="text-lg mt-2 line-clamp-2">{item.title}</CardTitle>
                    <CardDescription className="line-clamp-3 text-sm">{item.body}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-slate-500">
                        <User className="h-3.5 w-3.5" />
                        <span>{item.author_name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{formatDate(item.created_at)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <Badge variant="outline" className="text-xs border-slate-200">
                        <Tag className="h-3 w-3 mr-1" />
                        {item.category}
                      </Badge>
                      {item.type === 'podcast' && item.audio_url && (
                        <Badge variant="outline" className="text-xs border-purple-200 text-purple-600">
                          <Mic className="h-3 w-3 mr-1" />
                          Audio
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="flex-1 text-slate-600 hover:bg-slate-100"
                        onClick={() => openReviewDialog(item, 'preview')}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      {isAdmin && (item.status === 'draft' || item.status === 'submitted') && (
                        <Button 
                          size="sm"
                          className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
                          onClick={() => handlePublish(item)}
                          disabled={saving}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Publish
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-red-400 hover:bg-red-50"
                        onClick={() => handleDelete(item)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredContent.map((item) => (
                <Card key={`${item.type}-${item.id}`} className="hover:shadow-md transition-shadow border-slate-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex items-center gap-2">
                          {iconForType(item.type)}
                          <span className="text-xs text-slate-500 uppercase">{item.type}</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-800">{item.title}</p>
                          <p className="text-xs text-slate-500 flex items-center gap-2">
                            <span>{item.author_name}</span>
                            <span>•</span>
                            <span>{formatDate(item.created_at)}</span>
                            <span>•</span>
                            <span>{item.category}</span>
                          </p>
                        </div>
                        {getStatusBadge(item.status)}
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-slate-600 hover:bg-slate-100"
                          onClick={() => openReviewDialog(item, 'preview')}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {isAdmin && (item.status === 'draft' || item.status === 'submitted') && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-emerald-600 hover:bg-emerald-50"
                            onClick={() => handlePublish(item)}
                            disabled={saving}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-red-400 hover:bg-red-50"
                          onClick={() => handleDelete(item)}
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
        </TabsContent>

        <TabsContent value="review" className="space-y-4 mt-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            </div>
          ) : reviewQueue.length === 0 ? (
            <Card className="border-dashed border-2 border-green-200 bg-green-50/30">
              <CardContent className="text-center py-12">
                <CheckCircle2 className="h-16 w-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-green-600 mb-2">All caught up!</h3>
                <p className="text-sm text-green-500">No content waiting for review</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {reviewQueue.map((item) => (
                <Card key={`${item.type}-${item.id}`} className="border-amber-200 bg-amber-50/30 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {iconForType(item.type)}
                          <Badge className="bg-amber-500 text-white">
                            <Clock className="h-3 w-3 mr-1" />
                            Pending Review
                          </Badge>
                          <span className="text-xs text-slate-500 uppercase">{item.type}</span>
                        </div>
                        <p className="font-semibold text-slate-800">{item.title}</p>
                        <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                          <span className="flex items-center gap-1">
                            <User className="h-3.5 w-3.5" />
                            {item.author_name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatDate(item.created_at)}
                          </span>
                          <Badge variant="outline" className="text-xs border-slate-200">
                            {item.category}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline"
                          className="border-amber-200 hover:bg-amber-100/50"
                          onClick={() => openReviewDialog(item, 'preview')}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Review
                        </Button>
                        <Button 
                          className="bg-emerald-500 hover:bg-emerald-600 text-white"
                          onClick={() => handlePublish(item)}
                          disabled={saving}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Publish
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Review Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-5xl rounded-3xl border-0 bg-white shadow-2xl max-h-[90vh] overflow-hidden">
          <DialogHeader className="border-b border-slate-200 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                  {modalMode === 'edit' ? <Edit className="h-6 w-6 text-amber-500" /> : <Eye className="h-6 w-6 text-amber-500" />}
                  {modalMode === 'edit' ? 'Edit Draft' : 'Review Content'}
                </DialogTitle>
                <DialogDescription className="text-slate-500">
                  {modalMode === 'edit'
                    ? 'Update the draft and save it back before resubmitting.'
                    : 'Preview the content, verify it, or send feedback to the creator.'}
                </DialogDescription>
              </div>
              {selectedItem && getStatusBadge(selectedItem.status)}
            </div>
          </DialogHeader>

          {selectedItem ? (
            <div className="flex-1 overflow-y-auto p-1">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Left Column - Content Preview */}
                <div className="space-y-4">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                      {iconForType(selectedItem.type)}
                      <span className="uppercase tracking-wider font-medium">{selectedItem.type}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-400">{selectedItem.category}</span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-semibold text-slate-700">Title</Label>
                        <Input
                          value={selectedItem.title}
                          onChange={(e) => setSelectedItem({ ...selectedItem, title: e.target.value })}
                          className="mt-1 border-slate-200 focus-visible:ring-amber-500/30 bg-white"
                        />
                      </div>

                      {selectedItem.type === 'podcast' && (
                        <div>
                          <Label className="text-sm font-semibold text-slate-700">Audio URL</Label>
                          <Input
                            value={selectedItem.audio_url || ''}
                            onChange={(e) => setSelectedItem({ ...selectedItem, audio_url: e.target.value })}
                            className="mt-1 border-slate-200 focus-visible:ring-amber-500/30 bg-white"
                            placeholder="https://example.com/audio.mp3"
                          />
                        </div>
                      )}

                      <div>
                        <Label className="text-sm font-semibold text-slate-700">Content</Label>
                        <Textarea
                          value={selectedItem.body}
                          onChange={(e) => setSelectedItem({ ...selectedItem, body: e.target.value })}
                          rows={12}
                          className="mt-1 border-slate-200 focus-visible:ring-amber-500/30 bg-white font-mono text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Admin Actions */}
                <div className="space-y-4">
                  <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4">
                    <div className="flex items-center gap-2 text-amber-700 mb-3">
                      <MessageSquare className="h-5 w-5" />
                      <span className="font-semibold">Admin Feedback</span>
                    </div>
                    <Textarea
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      rows={8}
                      className="border-amber-200 focus-visible:ring-amber-500/30 bg-white"
                      placeholder="Provide feedback, corrections, or suggestions for improvement..."
                    />
                    <p className="text-xs text-amber-600/70 mt-2">
                      {feedbackText.length} characters • This will be sent to the content creator
                    </p>
                  </div>

                  {/* Content Info */}
                  <Card className="border-slate-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-semibold text-slate-700">Content Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Author</span>
                        <span className="font-medium text-slate-700">{selectedItem.author_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Created</span>
                        <span className="font-medium text-slate-700">
                          {formatDate(selectedItem.created_at)}
                        </span>
                      </div>
                      {selectedItem.updated_at && (
                        <div className="flex justify-between">
                          <span className="text-slate-500">Last Updated</span>
                          <span className="font-medium text-slate-700">
                            {formatDate(selectedItem.updated_at)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-slate-500">Type</span>
                        <span className="font-medium text-slate-700 capitalize">{selectedItem.type}</span>
                      </div>
                      {selectedItem.audio_url && (
                        <div className="flex justify-between">
                          <span className="text-slate-500">Audio</span>
                          <a 
                            href={selectedItem.audio_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline flex items-center gap-1"
                          >
                            Listen <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 justify-end mt-4 pt-4 border-t border-slate-200">
                <Button 
                  variant="outline" 
                  className="border-slate-200 hover:bg-slate-100"
                  onClick={() => setDialogOpen(false)}
                >
                  Close
                </Button>
                
                {modalMode === 'edit' ? (
                  <Button 
                    className="bg-amber-500 hover:bg-amber-600 text-white"
                    onClick={handleSaveEdits}
                    disabled={saving}
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                    Save Changes
                  </Button>
                ) : (
                  <>
                    <Button 
                      variant="destructive"
                      onClick={handleReject}
                      disabled={saving || !feedbackText.trim()}
                    >
                      {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <XCircle className="h-4 w-4 mr-2" />}
                      Reject & Send Feedback
                    </Button>
                    <Button 
                      className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30"
                      onClick={() => handlePublish(selectedItem)}
                      disabled={saving}
                    >
                      {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                      Verify & Publish
                    </Button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <p className="text-slate-500 text-center py-8">Select a draft to review.</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}