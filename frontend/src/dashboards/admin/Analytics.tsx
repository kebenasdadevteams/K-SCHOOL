import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { BarChart3, ArrowLeft, DollarSign, Users, HeartHandshake, TrendingUp, CalendarDays } from 'lucide-react';

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

  const donationSummary = [
    { label: 'Total Donations', value: '$24,890', icon: DollarSign, tone: 'text-green-600' },
    { label: 'Active Donors', value: '312', icon: Users, tone: 'text-blue-600' },
    { label: 'Campaigns', value: '8', icon: HeartHandshake, tone: 'text-primary' },
    { label: 'Growth', value: '+18%', icon: TrendingUp, tone: 'text-orange-600' },
  ];

  const recentDonations = [
    { id: 1, name: 'Abebe K.', amount: '$150', type: 'Tithe', time: '2h ago' },
    { id: 2, name: 'Tigist A.', amount: '$80', type: 'Offering', time: '6h ago' },
    { id: 3, name: 'Dawit T.', amount: '$250', type: 'Building Fund', time: '1d ago' },
  ];

  const campaigns = [
    { id: 1, name: 'Church Renovation', progress: 78, target: '$15,000', raised: '$11,700' },
    { id: 2, name: 'Youth Outreach', progress: 52, target: '$5,000', raised: '$2,600' },
    { id: 3, name: 'Mission Support', progress: 34, target: '$8,000', raised: '$2,720' },
  ];

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
