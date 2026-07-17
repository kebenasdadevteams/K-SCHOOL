import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { ArrowLeft, Plus, FileText, Mic, Edit, Trash2, Eye } from 'lucide-react';

export default function ContentManagement() {
  const navigate = useNavigate();
  const location = useLocation();
  const [filter, setFilter] = useState('all');

  // Get user info from navigation state, or use defaults
  const locationState = location.state as { role?: string; userName?: string; userEmail?: string; view?: 'student' | 'teacher' | 'pastor' | 'editor' | 'admin' } | null;
  const [user] = useState({
    full_name: locationState?.userName || 'Demo User',
    email: locationState?.userEmail || 'demo@church.com'
  });
  const [role] = useState(locationState?.role || 'editor');
  const isAdmin = role === 'admin';
  const isEditor = role === 'editor';
  const [activeView, setActiveView] = useState<'student' | 'teacher' | 'pastor' | 'editor' | 'admin'>(
    locationState?.view ?? (locationState?.role === 'teacher' ? 'teacher' : locationState?.role === 'pastor' ? 'pastor' : locationState?.role === 'editor' ? 'editor' : locationState?.role === 'admin' ? 'admin' : 'student')
  );
  const [pendingReviewItems, setPendingReviewItems] = useState([
    { id: 1, title: 'Youth Ministry Update', type: 'post', author: 'Editor Mary', submittedAt: 'Today', verified: false },
    { id: 2, title: 'Weekly Podcast: Faith in Action', type: 'podcast', author: 'Editor Mary', submittedAt: 'Yesterday', verified: false },
    { id: 3, title: 'Worship Night Recording', type: 'podcast', author: 'Editor John', submittedAt: '2d ago', verified: false },
  ]);

  const verifyContent = (itemId: number) => {
    setPendingReviewItems((current) => current.filter((item) => item.id !== itemId));
  };

  // Mock data
  const content = [
    {
      id: 1,
      title: 'Sunday Morning Sermon: Love Your Neighbor',
      type: 'post',
      status: 'published',
      author: 'Pastor John',
      date: '2026-02-14',
      views: 245,
      categories: ['Sermons', 'Bible Study'],
    },
    {
      id: 2,
      title: 'Weekly Podcast: Faith in Action',
      type: 'podcast',
      status: 'published',
      author: 'Editor Mary',
      date: '2026-02-13',
      views: 189,
      categories: ['Podcast', 'Teaching'],
    },
    {
      id: 3,
      title: 'Youth Ministry Update',
      type: 'post',
      status: 'draft',
      author: 'Editor Mary',
      date: '2026-02-12',
      views: 0,
      categories: ['Youth Ministry', 'Announcements'],
    },
    {
      id: 4,
      title: 'Worship Night Recording',
      type: 'podcast',
      status: 'published',
      author: 'Pastor John',
      date: '2026-02-11',
      views: 312,
      categories: ['Worship', 'Music'],
    },
  ];

  const filteredContent = content.filter(item => 
    filter === 'all' || item.type === filter
  );

  return (
    <div className="space-y-6">
      {(isEditor || isAdmin) && (
        <Card className="mb-6 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle>{isAdmin ? 'Admin Verification Queue' : 'Editor Submission Queue'}</CardTitle>
            <CardDescription>
              {isAdmin ? 'Review and verify editor content before it is published' : 'Submit drafts and wait for admin verification before posting'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingReviewItems.length === 0 ? (
              <p className="text-sm text-muted-foreground">No items waiting for verification.</p>
            ) : (
              pendingReviewItems.map((item) => (
                <div key={item.id} className="flex flex-col gap-3 rounded-lg border bg-background p-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.author} • {item.submittedAt} • {item.type}</p>
                  </div>
                  <div className="flex gap-2">
                    {isAdmin ? (
                      <>
                        <Button variant="outline" onClick={() => navigate('/developer/content', { state: { ...((location.state as Record<string, unknown>) || {}), role } })}>
                          Open Draft
                        </Button>
                        <Button onClick={() => verifyContent(item.id)}>Verify & Publish</Button>
                      </>
                    ) : (
                      <Button variant="outline" onClick={() => navigate('/developer', { state: { ...((location.state as Record<string, unknown>) || {}), role } })}>
                        Continue Drafting
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}

      {/* Remove old header */}
      {/* Filters */}
      <div className="mb-6 flex gap-4 flex-wrap items-center justify-between">
        <div className="flex gap-2">
          <Button 
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All Content
          </Button>
          <Button 
            variant={filter === 'post' ? 'default' : 'outline'}
            onClick={() => setFilter('post')}
          >
            <FileText className="h-4 w-4 mr-2" />
            Posts
          </Button>
          <Button 
            variant={filter === 'podcast' ? 'default' : 'outline'}
            onClick={() => setFilter('podcast')}
          >
            <Mic className="h-4 w-4 mr-2" />
            Podcasts
          </Button>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {isAdmin ? 'Review Content' : isEditor ? 'Submit Content' : 'Create Content'}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{isAdmin ? 'Review Content' : 'Create New Content'}</DialogTitle>
              <DialogDescription>
                {isAdmin ? 'Verify editor submissions before they are published' : 'Create a new post or podcast for your church'}
              </DialogDescription>
            </DialogHeader>
            <CreateContentForm />
          </DialogContent>
        </Dialog>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Content</CardDescription>
              <CardTitle className="text-3xl">4</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Published</CardDescription>
              <CardTitle className="text-3xl text-green-600">3</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Drafts</CardDescription>
              <CardTitle className="text-3xl text-orange-600">1</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Views</CardDescription>
              <CardTitle className="text-3xl">746</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Content List */}
        <div className="space-y-4">
          {filteredContent.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {item.type === 'post' ? (
                        <FileText className="h-4 w-4 text-primary" />
                      ) : (
                        <Mic className="h-4 w-4 text-accent" />
                      )}
                      <Badge variant={item.status === 'published' ? 'default' : 'secondary'}>
                        {item.status}
                      </Badge>
                    </div>
                    <CardTitle className="mb-2">{item.title}</CardTitle>
                    <CardDescription>
                      By {item.author} • {item.date} • {item.views} views
                    </CardDescription>
                    <div className="flex gap-2 mt-3">
                      {item.categories.map((cat, idx) => (
                        <Badge key={idx} variant="outline">{cat}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    {(isAdmin || isEditor) && item.status === 'draft' && (
                      <Button variant="ghost" size="sm" onClick={() => verifyContent(item.id)}>
                        Verify
                      </Button>
                    )}
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}

function CreateContentForm() {
  const [contentType, setContentType] = useState('post');

  return (
    <form className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="type">Content Type</Label>
        <Select value={contentType} onValueChange={setContentType}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="post">Post</SelectItem>
            <SelectItem value="podcast">Podcast</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" placeholder="Enter content title" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="body">Content</Label>
        <Textarea 
          id="body" 
          placeholder="Write your content here..." 
          rows={8}
        />
      </div>

      {contentType === 'podcast' && (
        <div className="space-y-2">
          <Label htmlFor="audio_url">Audio URL</Label>
          <Input id="audio_url" placeholder="https://example.com/audio.mp3" />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="categories">Categories</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sermons">Sermons</SelectItem>
            <SelectItem value="bible-study">Bible Study</SelectItem>
            <SelectItem value="youth">Youth Ministry</SelectItem>
            <SelectItem value="worship">Worship</SelectItem>
            <SelectItem value="announcements">Announcements</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select defaultValue="draft">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline">Cancel</Button>
        <Button type="submit">{contentType === 'podcast' ? 'Save Draft' : 'Save Draft'}</Button>
      </div>
    </form>
  );
}