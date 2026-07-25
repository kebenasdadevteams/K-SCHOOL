import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Textarea } from '../../components/ui/textarea';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { ArrowLeft, FileText, Mic, Edit, Trash2, Eye, CheckCircle2, XCircle, Send, Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../services/api';

type ContentType = 'post' | 'podcast' | 'course';
type ContentStatus = 'draft' | 'published' | 'archived';

type ContentItem = {
  id: number;
  title: string;
  type: ContentType;
  status: ContentStatus;
  author_name: string;
  body: string;
  category: string;
  created_at?: string;
  updated_at?: string;
  audio_url?: string;
};

const iconForType = (type: ContentType) => {
  if (type === 'podcast') return <Mic className="h-4 w-4 text-primary" />;
  if (type === 'course') return <FileText className="h-4 w-4 text-primary" />;
  return <FileText className="h-4 w-4 text-primary" />;
};

export default function ContentManagement() {
  const location = useLocation();
  const locationState = location.state as { role?: string; userName?: string; userEmail?: string; view?: 'student' | 'teacher' | 'pastor' | 'editor' | 'admin' } | null;
  const [role] = useState(locationState?.role || 'admin');
  const [filter, setFilter] = useState<'all' | 'post' | 'podcast' | 'course'>('all');
  const [allContent, setAllContent] = useState<ContentItem[]>([]);
  const [reviewQueue, setReviewQueue] = useState<ContentItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'preview' | 'edit'>('preview');

  const isAdmin = role === 'admin';

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
      console.error('Unable to load content queue', error);
      toast.error('Failed to load content review queue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredContent = useMemo(() => {
    return allContent.filter((item) => filter === 'all' || item.type === filter);
  }, [allContent, filter]);

  const stats = useMemo(() => {
    const total = allContent.length;
    const published = allContent.filter((item) => item.status === 'published').length;
    const drafts = allContent.filter((item) => item.status === 'draft').length;
    return { total, published, drafts };
  }, [allContent]);

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

      toast.success(`${item.title} was verified and published`);
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
      toast.error('Please provide feedback before sending it back to the submitter.');
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

      toast.success('Feedback sent successfully');
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
    if (!window.confirm(`Delete ${item.title}?`)) return;

    try {
      await api.delete(`/content/type/${item.type}/${item.id}`);
      toast.success('Content deleted');
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

      toast.success('Draft changes saved');
      await loadData();
      setDialogOpen(false);
    } catch (error) {
      console.error('Unable to save edits', error);
      toast.error('Unable to save these edits right now');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {isAdmin && (
        <Card className="mb-6 border-primary/20 bg-gradient-to-r from-primary/10 via-background to-primary/5">
          <CardHeader>
            <CardTitle>Admin Verification Queue</CardTitle>
            <CardDescription>
              Review submitted drafts, preview the item, publish it, or send a correction note back to the creator.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading draft queue...
              </div>
            ) : reviewQueue.length === 0 ? (
              <p className="text-sm text-muted-foreground">No items waiting for verification.</p>
            ) : (
              reviewQueue.map((item) => (
                <div key={`${item.type}-${item.id}`} className="flex flex-col gap-3 rounded-lg border bg-background p-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.author_name} • {new Date(item.created_at || Date.now()).toLocaleDateString()} • {item.type}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => openReviewDialog(item, 'preview')}>
                      Open Draft
                    </Button>
                    <Button onClick={() => handlePublish(item)} disabled={saving}>
                      Verify & Publish
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}

      <div className="mb-6 flex gap-4 flex-wrap items-center justify-between">
        <div className="flex gap-2">
          <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>All Content</Button>
          <Button variant={filter === 'post' ? 'default' : 'outline'} onClick={() => setFilter('post')}>
            <FileText className="h-4 w-4 mr-2" />
            Posts
          </Button>
          <Button variant={filter === 'podcast' ? 'default' : 'outline'} onClick={() => setFilter('podcast')}>
            <Mic className="h-4 w-4 mr-2" />
            Podcasts
          </Button>
          <Button variant={filter === 'course' ? 'default' : 'outline'} onClick={() => setFilter('course')}>
            <FileText className="h-4 w-4 mr-2" />
            Courses
          </Button>
        </div>

        <Button onClick={() => setDialogOpen(true)} disabled={reviewQueue.length === 0}>
          <Plus className="h-4 w-4 mr-2" />
          Review Content
        </Button>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Content</CardDescription>
              <CardTitle className="text-3xl">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Published</CardDescription>
              <CardTitle className="text-3xl text-green-600">{stats.published}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Drafts</CardDescription>
              <CardTitle className="text-3xl text-orange-600">{stats.drafts}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Queue</CardDescription>
              <CardTitle className="text-3xl">{reviewQueue.length}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <div className="space-y-4">
          {filteredContent.map((item) => (
            <Card key={`${item.type}-${item.id}`} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {iconForType(item.type)}
                      <Badge variant={item.status === 'published' ? 'default' : 'secondary'}>{item.status}</Badge>
                    </div>
                    <CardTitle className="mb-2">{item.title}</CardTitle>
                    <CardDescription>
                      By {item.author_name} • {new Date(item.created_at || Date.now()).toLocaleDateString()} • {item.type}
                    </CardDescription>
                    <div className="flex gap-2 mt-3 flex-wrap">
                      <Badge variant="outline">{item.category}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Button variant="ghost" size="sm" onClick={() => openReviewDialog(item, 'preview')}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    {isAdmin && item.status === 'draft' && (
                      <Button variant="ghost" size="sm" onClick={() => handlePublish(item)}>
                        <CheckCircle2 className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => openReviewDialog(item, 'edit')}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(item)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </main>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl rounded-3xl border-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white shadow-[0_30px_90px_rgba(15,23,42,0.85)]">
          <DialogHeader className="border-b border-white/10 pb-4">
            <DialogTitle className="text-2xl font-bold text-white">{modalMode === 'edit' ? 'Edit Draft' : 'Review Content'}</DialogTitle>
            <DialogDescription className="text-slate-300">
              {modalMode === 'edit'
                ? 'Update the draft and save it back to the database before resubmitting.'
                : 'Preview the submitted content, verify and publish it, or send a correction note.'}
            </DialogDescription>
          </DialogHeader>

          {selectedItem ? (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-2 text-sm text-slate-300 mb-3">
                    {iconForType(selectedItem.type)}
                    <span className="uppercase tracking-wide">{selectedItem.type}</span>
                  </div>
                  <Label className="text-slate-200">Title</Label>
                  <Input
                    value={selectedItem.title}
                    onChange={(event) => setSelectedItem({ ...selectedItem, title: event.target.value })}
                    className="mt-2 border-white/10 bg-white/5 text-white"
                  />

                  <div className="mt-4">
                    <Label className="text-slate-200">Category</Label>
                    <Input
                      value={selectedItem.category}
                      onChange={(event) => setSelectedItem({ ...selectedItem, category: event.target.value })}
                      className="mt-2 border-white/10 bg-white/5 text-white"
                    />
                  </div>

                  {selectedItem.type === 'podcast' && (
                    <div className="mt-4">
                      <Label className="text-slate-200">Audio URL</Label>
                      <Input
                        value={selectedItem.audio_url || ''}
                        onChange={(event) => setSelectedItem({ ...selectedItem, audio_url: event.target.value })}
                        className="mt-2 border-white/10 bg-white/5 text-white"
                      />
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <Label className="text-slate-200">Content Preview</Label>
                  <Textarea
                    value={selectedItem.body}
                    onChange={(event) => setSelectedItem({ ...selectedItem, body: event.target.value })}
                    rows={14}
                    className="mt-2 border-white/10 bg-white/5 text-white"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-amber-400/30 bg-amber-500/10 p-4">
                <Label className="text-amber-100">Admin Feedback</Label>
                <Textarea
                  value={feedbackText}
                  onChange={(event) => setFeedbackText(event.target.value)}
                  rows={4}
                  className="mt-2 border-amber-300/20 bg-slate-950/30 text-white"
                  placeholder="Leave notes, corrections, or a required fix for the content creator."
                />
              </div>

              <div className="flex flex-wrap gap-2 justify-end">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" onClick={() => setDialogOpen(false)}>
                  Close
                </Button>
                {modalMode === 'edit' ? (
                  <Button onClick={handleSaveEdits} disabled={saving}>
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Draft'}
                  </Button>
                ) : (
                  <>
                    <Button variant="secondary" onClick={handleReject} disabled={saving}>
                      <Send className="h-4 w-4 mr-2" />
                      Send Feedback
                    </Button>
                    <Button onClick={() => handlePublish(selectedItem)} disabled={saving}>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Verify & Publish
                    </Button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <p className="text-slate-300">Select a draft to review.</p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}