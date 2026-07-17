import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Gift, Megaphone, CalendarDays, BarChart3, DollarSign } from 'lucide-react';

const promotions = [
  { id: 1, title: 'New Content Launch', type: 'Newsletter', reach: '18.4k', status: 'Live' },
  { id: 2, title: 'Weekly Podcast Push', type: 'Podcast', reach: '12.1k', status: 'Active' },
  { id: 3, title: 'Youth Event Spotlight', type: 'Social', reach: '9.3k', status: 'Planned' },
];

export default function Promotions() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Megaphone className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Editor promotions</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Campaign planning</h1>
          <p className="text-muted-foreground">Manage editorial campaigns, broadcast schedules, and audience reach from one place.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => navigate('/editor')}>
            <Gift className="h-4 w-4 mr-2" />
            Back to Editor Dashboard
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Current campaigns</CardTitle>
            <CardDescription>Active editorial work</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">Open campaigns</p>
              <p className="mt-3 text-3xl font-semibold">3</p>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              <span>Next release scheduled in 2 days</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Audience reach</CardTitle>
            <CardDescription>Recent engagement</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">Total audience</p>
              <p className="mt-3 text-3xl font-semibold">39.8k</p>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <BarChart3 className="h-4 w-4" />
              <span>Reach grew 6% this week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Budget status</CardTitle>
            <CardDescription>Editorial campaign spend</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">Estimated budget</p>
              <p className="mt-3 text-3xl font-semibold">$6,200</p>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>45% of monthly campaign budget used</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Promotion schedule</CardTitle>
          <CardDescription>Upcoming editorial campaigns</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {promotions.map((promo) => (
            <div key={promo.id} className="rounded-xl border p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold">{promo.title}</h3>
                  <p className="text-sm text-muted-foreground">Type: {promo.type}</p>
                </div>
                <Badge variant={promo.status === 'Live' ? 'secondary' : 'outline'}>{promo.status}</Badge>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em]">Reach</p>
                  <p className="mt-1 font-semibold">{promo.reach}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em]">Conversion</p>
                  <p className="mt-1 font-semibold">{promo.status === 'Live' ? '5.2%' : 'TBD'}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
