import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import api from '../../services/api';
import { Gift, Megaphone, CalendarDays, BarChart3, DollarSign } from 'lucide-react';

export default function Promotions() {
  const navigate = useNavigate();
  const location = useLocation();

  const locationState = location.state as { role?: string; userName?: string; userEmail?: string; view?: 'student' | 'teacher' | 'pastor' | 'editor' | 'admin' } | null;
  const [role] = useState(locationState?.role || 'admin');
  const [activeView] = useState<'student' | 'teacher' | 'pastor' | 'editor' | 'admin'>(
    locationState?.view ?? (locationState?.role === 'teacher' ? 'teacher' : locationState?.role === 'pastor' ? 'pastor' : locationState?.role === 'editor' ? 'editor' : locationState?.role === 'admin' ? 'admin' : 'admin')
  );

  const [promotions, setPromotions] = useState<any[]>([]);
  const [activeCount, setActiveCount] = useState(0);
  const [pausedCount, setPausedCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPromotions = async () => {
      try {
        const [contentRes, usersRes] = await Promise.all([
          api.get('/content/all'),
          api.get('/users'),
        ]);

        const allContent = contentRes.data?.data ?? [];
        const promotionsList = allContent.filter((item: any) => item.type === 'post');
        const users = usersRes.data?.data ?? [];

        setPromotions(promotionsList);
        setActiveCount(promotionsList.filter((promo: any) => promo.status === 'published').length);
        setPausedCount(promotionsList.filter((promo: any) => promo.status !== 'published').length);
        setUserCount(users.length);
      } catch (err) {
        console.error('Failed to load promotions data', err);
      } finally {
        setLoading(false);
      }
    };

    loadPromotions();
  }, []);

  const promotionsData = promotions.map((promo) => ({
    id: promo.id,
    title: promo.title || 'Untitled promotion',
    status: promo.status === 'published' ? 'Live' : 'Paused',
    impressions: promo.views ? promo.views.toLocaleString() : 'N/A',
    conversions: promo.conversion_rate ? `${promo.conversion_rate}%` : 'N/A',
    budget: promo.budget ? `$${promo.budget}` : 'TBD',
    category: promo.category || 'General',
    target: promo.type === 'course' ? 'Course release' : promo.type === 'podcast' ? 'Podcast launch' : 'Content publish',
  }));

  if (loading) {
    return <div className="p-6 text-sm text-slate-600">Loading promotions...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Megaphone className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Promotions</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Campaign management</h1>
          <p className="text-muted-foreground">Create, track, and optimize your admin promotions all from one place.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => navigate('/admin')}>
            <Gift className="h-4 w-4 mr-2" />
            Back to Admin Dashboard
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Active campaigns</CardTitle>
            <CardDescription>Live promotions running now</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">Live campaigns</p>
              <p className="mt-3 text-3xl font-semibold">{activeCount}</p>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              <span>{promotions.length} total promotions</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Paused campaigns</CardTitle>
            <CardDescription>Pending promotions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">Paused campaigns</p>
              <p className="mt-3 text-3xl font-semibold">{pausedCount}</p>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <BarChart3 className="h-4 w-4" />
              <span>{promotions.length > 0 ? `${promotions.length - activeCount} paused` : 'No promotions yet'}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User reach</CardTitle>
            <CardDescription>Marketing audience size</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">Users in the system</p>
              <p className="mt-3 text-3xl font-semibold">{userCount}</p>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>{`${promotions.length} content items evaluated`}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Promotion lineup</CardTitle>
          <CardDescription>Active and paused campaigns</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {promotionsData.map((promo) => (
            <div key={promo.id} className="rounded-xl border p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold">{promo.title}</h3>
                  <p className="text-sm text-muted-foreground">{promo.impressions} impressions • {promo.conversions} conversion rate</p>
                </div>
                <Badge variant={promo.status === 'Live' ? 'secondary' : 'outline'}>{promo.status}</Badge>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em]">Target</p>
                  <p className="mt-1 font-semibold">{promo.target}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em]">Budget</p>
                  <p className="mt-1 font-semibold">{promo.budget}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
        </Card>
      </div>
  );
}
