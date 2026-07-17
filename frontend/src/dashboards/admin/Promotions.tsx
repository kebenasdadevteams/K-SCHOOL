import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Gift, Megaphone, CalendarDays, BarChart3, DollarSign } from 'lucide-react';

const promotionsData = [
  { id: 1, title: 'Welcome Week Campaign', status: 'Live', impressions: '12.5k', conversions: '4.3%', budget: '$2,400' },
  { id: 2, title: 'Fundraising Drive', status: 'Paused', impressions: '8.4k', conversions: '2.1%', budget: '$1,200' },
  { id: 3, title: 'Community Outreach', status: 'Live', impressions: '15.2k', conversions: '5.8%', budget: '$3,600' },
];

export default function Promotions() {
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
            <CardDescription>Live messages running now</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">3 live campaigns</p>
              <p className="mt-3 text-3xl font-semibold">75.4%</p>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              <span>Weekly reach is up 12%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Engagement</CardTitle>
            <CardDescription>Recent response metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">Average conversion</p>
              <p className="mt-3 text-3xl font-semibold">4.6%</p>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <BarChart3 className="h-4 w-4" />
              <span>Promotions engagement up 8% this month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Budget</CardTitle>
            <CardDescription>Planned vs spent</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">Campaign budget</p>
              <p className="mt-3 text-3xl font-semibold">$7,200</p>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>60% of monthly budget used</span>
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
