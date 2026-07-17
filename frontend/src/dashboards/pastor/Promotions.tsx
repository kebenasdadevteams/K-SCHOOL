import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { ArrowLeft, Plus, Megaphone, Calendar, ExternalLink, Eye, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

export default function Promotions() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get user info from navigation state, or use defaults
  const locationState = location.state as { role?: string; userName?: string; userEmail?: string; view?: 'student' | 'teacher' | 'pastor' | 'editor' | 'admin' } | null;
  const [user] = useState({
    full_name: locationState?.userName || 'Demo User',
    email: locationState?.userEmail || 'demo@church.com'
  });
  const [role] = useState(locationState?.role || 'editor');
  const [activeView, setActiveView] = useState<'student' | 'teacher' | 'pastor' | 'editor' | 'admin'>(
    locationState?.view ?? (locationState?.role === 'teacher' ? 'teacher' : locationState?.role === 'pastor' ? 'pastor' : locationState?.role === 'editor' ? 'editor' : locationState?.role === 'admin' ? 'admin' : 'student')
  );

  // Mock data
  const promotions = [
    {
      id: 1,
      title: 'Easter Sunday Service',
      description: 'Join us for a special Easter celebration service with worship, communion, and fellowship',
      image_url: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=600&h=400&fit=crop',
      link_url: '/events/easter-2026',
      start_date: '2026-03-15',
      end_date: '2026-04-05',
      is_active: true,
      views: 1245,
      clicks: 234,
    },
    {
      id: 2,
      title: 'Youth Bible Camp',
      description: 'Summer Bible camp for youth ages 13-18. Registration now open!',
      image_url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&h=400&fit=crop',
      link_url: '/events/youth-camp',
      start_date: '2026-02-10',
      end_date: '2026-06-30',
      is_active: true,
      views: 892,
      clicks: 156,
    },
    {
      id: 3,
      title: 'New Member Orientation',
      description: 'Learn about our church community and how to get involved',
      image_url: 'https://images.unsplash.com/photo-1528605105345-5344ea20e269?w=600&h=400&fit=crop',
      link_url: '/membership',
      start_date: '2026-02-01',
      end_date: '2026-02-28',
      is_active: true,
      views: 567,
      clicks: 89,
    },
    {
      id: 4,
      title: 'Christmas Concert 2025',
      description: 'Thank you for joining our amazing Christmas celebration!',
      image_url: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=600&h=400&fit=crop',
      link_url: '/events/christmas-2025',
      start_date: '2025-12-01',
      end_date: '2025-12-25',
      is_active: false,
      views: 2134,
      clicks: 445,
    },
  ];

  const activePromotions = promotions.filter(p => p.is_active);
  const inactivePromotions = promotions.filter(p => !p.is_active);

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Promotions</CardDescription>
            <CardTitle className="text-3xl">{promotions.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Now</CardDescription>
            <CardTitle className="text-3xl text-green-600">{activePromotions.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Views</CardDescription>
            <CardTitle className="text-3xl">
              {promotions.reduce((sum, p) => sum + p.views, 0).toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Clicks</CardDescription>
            <CardTitle className="text-3xl">
              {promotions.reduce((sum, p) => sum + p.clicks, 0).toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Active Promotions Billboard Preview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Billboard Preview</CardTitle>
          <CardDescription>How promotions appear on the homepage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activePromotions.slice(0, 3).map((promo) => (
              <div key={promo.id} className="relative group overflow-hidden rounded-lg">
                <img 
                  src={promo.image_url} 
                  alt={promo.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-4">
                  <h3 className="text-white font-bold text-lg mb-1">{promo.title}</h3>
                  <p className="text-white/90 text-sm line-clamp-2">{promo.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Promotions List */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Active Promotions</h2>
        <div className="space-y-4">
          {activePromotions.map((promo) => (
            <Card key={promo.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex gap-4">
                  <img 
                    src={promo.image_url} 
                    alt={promo.title}
                    className="w-48 h-32 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-green-600">Active</Badge>
                          <Badge variant="outline">
                            <Megaphone className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        </div>
                        <CardTitle className="mb-2">{promo.title}</CardTitle>
                        <CardDescription className="text-base">
                          {promo.description}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <ToggleRight className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 mt-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Start Date</p>
                        <p className="font-medium flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {promo.start_date}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">End Date</p>
                        <p className="font-medium flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {promo.end_date}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Views</p>
                        <p className="font-medium flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {promo.views.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Clicks</p>
                        <p className="font-medium flex items-center gap-1">
                          <ExternalLink className="h-4 w-4" />
                          {promo.clicks.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* Inactive Promotions List */}
      {inactivePromotions.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Past Promotions</h2>
          <div className="space-y-4">
            {inactivePromotions.map((promo) => (
              <Card key={promo.id} className="opacity-75">
                <CardHeader>
                  <div className="flex gap-4">
                    <img 
                      src={promo.image_url} 
                      alt={promo.title}
                      className="w-48 h-32 object-cover rounded-lg grayscale"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary">Inactive</Badge>
                          </div>
                          <CardTitle className="mb-2">{promo.title}</CardTitle>
                          <CardDescription className="text-base">
                            {promo.description}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <ToggleLeft className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-4 mt-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Start Date</p>
                          <p className="font-medium">{promo.start_date}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">End Date</p>
                          <p className="font-medium">{promo.end_date}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Views</p>
                          <p className="font-medium">{promo.views.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Clicks</p>
                          <p className="font-medium">{promo.clicks.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CreatePromotionForm() {
  return (
    <form className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Promotion Title</Label>
        <Input id="title" placeholder="Enter promotion title" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          placeholder="Describe the promotion or event..." 
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image_url">Image URL</Label>
        <Input id="image_url" placeholder="https://example.com/image.jpg" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="link_url">Link URL (optional)</Label>
        <Input id="link_url" placeholder="/events/easter-2026" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start_date">Start Date</Label>
          <Input id="start_date" type="date" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_date">End Date</Label>
          <Input id="end_date" type="date" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" id="is_active" defaultChecked className="h-4 w-4" />
        <Label htmlFor="is_active">Activate immediately</Label>
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline">Cancel</Button>
        <Button type="submit">Create Promotion</Button>
      </div>
    </form>
  );
}