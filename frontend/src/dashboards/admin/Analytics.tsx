import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import api from '../../services/api';
import { BarChart3, ArrowLeft, Users, HeartHandshake, TrendingUp, CalendarDays } from 'lucide-react';

export default function Analytics() {
  const navigate = useNavigate();
  const location = useLocation();

  const locationState = location.state as { role?: string; userName?: string; userEmail?: string; view?: 'student' | 'teacher' | 'pastor' | 'editor' | 'admin' } | null;
  const [role] = useState(locationState?.role || 'admin');
  const [activeView] = useState<'student' | 'teacher' | 'pastor' | 'editor' | 'admin'>(
    locationState?.view ?? (locationState?.role === 'teacher' ? 'teacher' : locationState?.role === 'pastor' ? 'pastor' : locationState?.role === 'editor' ? 'editor' : locationState?.role === 'admin' ? 'admin' : 'admin')
  );

  const user = {
    full_name: locationState?.userName || 'Demo User',
    email: locationState?.userEmail || 'demo@church.com',
  };

  const [contentItems, setContentItems] = useState<any[]>([]);
  const [podcasts, setPodcasts] = useState<any[]>([]);
  const [userCount, setUserCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const [contentRes, podcastsRes, usersRes, notificationsRes] = await Promise.all([
          api.get('/content/all'),
          api.get('/content/podcasts'),
          api.get('/users'),
          api.get('/activity/notifications'),
        ]);

        const allContent = contentRes.data?.data ?? [];
        const allPodcasts = podcastsRes.data?.data ?? [];
        const users = usersRes.data?.data ?? [];
        const notifications = notificationsRes.data?.data ?? [];

        setContentItems(allContent);
        setPodcasts(allPodcasts);
        setUserCount(users.length);
        setNotificationCount(notifications.filter((item: any) => !item.is_read).length);
      } catch (err) {
        console.error('Failed to load analytics data', err);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  const donationSummary = [
    { label: 'Total content', value: contentItems.length.toString(), icon: HeartHandshake, tone: 'text-primary' },
    { label: 'Podcasts', value: podcasts.length.toString(), icon: Users, tone: 'text-blue-600' },
    { label: 'Active users', value: userCount.toString(), icon: TrendingUp, tone: 'text-orange-600' },
    { label: 'Unread notifications', value: notificationCount.toString(), icon: CalendarDays, tone: 'text-green-600' },
  ];

  const recentDonations = contentItems.slice(0, 3).map((item: any, index: number) => ({
    id: `content-${item.id ?? index}`,
    name: item.title || item.name || 'Untitled',
    amount: item.type === 'podcast' ? 'Podcast' : item.type === 'course' ? 'Course' : 'Post',
    type: item.category || item.type || 'Content',
    time: item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Unknown',
  }));

  const campaigns = contentItems.slice(0, 3).map((item: any, index: number) => ({
    id: `campaign-${item.id ?? index}`,
    name: item.title || 'Untitled',
    progress: item.status === 'published' ? 100 : 40,
    target: item.type === 'course' ? 'Course release' : item.type === 'podcast' ? 'Podcast launch' : 'Content publish',
    raised: item.author_name ? `by ${item.author_name}` : 'by unknown',
  }));

  if (loading) {
    return <div className="p-6 text-sm text-slate-600">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Donations & Reports</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Church analytics</h1>
          <p className="text-muted-foreground">Track donations, campaigns, and giving trends across the church.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => navigate('/admin')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin Dashboard
          </Button>
        </div>
      </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {donationSummary.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.label}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardDescription>{item.label}</CardDescription>
                    <Icon className={`h-5 w-5 ${item.tone}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{item.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-6 xl:grid-cols-12">
          <Card className="xl:col-span-7">
            <CardHeader>
              <CardTitle>Giving campaigns</CardTitle>
              <CardDescription>Progress toward active ministry goals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="rounded-xl border p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h4 className="font-semibold">{campaign.name}</h4>
                      <p className="text-sm text-muted-foreground">Raised {campaign.raised} of {campaign.target}</p>
                    </div>
                    <Badge variant="secondary">{campaign.progress}%</Badge>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-primary" style={{ width: `${campaign.progress}%` }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="xl:col-span-5">
            <CardHeader>
              <CardTitle>Recent donations</CardTitle>
              <CardDescription>Latest gifts and contributions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentDonations.map((donation) => (
                <div key={donation.id} className="flex items-center justify-between rounded-xl border p-4">
                  <div>
                    <h4 className="font-medium">{donation.name}</h4>
                    <p className="text-xs text-muted-foreground">{donation.type} • {donation.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-700">{donation.amount}</p>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full" onClick={() => navigate('/admin/users')}>
                View Members
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Reporting summary</CardTitle>
            <CardDescription>Snapshot of giving activity by period</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl bg-muted/40 p-4">
              <CalendarDays className="h-5 w-5 text-primary" />
              <p className="mt-2 text-sm text-muted-foreground">This week</p>
              <p className="mt-1 text-2xl font-bold">$4,230</p>
            </div>
            <div className="rounded-xl bg-muted/40 p-4">
              <CalendarDays className="h-5 w-5 text-primary" />
              <p className="mt-2 text-sm text-muted-foreground">This month</p>
              <p className="mt-1 text-2xl font-bold">$24,890</p>
            </div>
            <div className="rounded-xl bg-muted/40 p-4">
              <CalendarDays className="h-5 w-5 text-primary" />
              <p className="mt-2 text-sm text-muted-foreground">Year to date</p>
              <p className="mt-1 text-2xl font-bold">$182,400</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
}
