import { useLocation } from 'react-router';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { ArrowRight, BookOpen, Calendar, ClipboardList, Users } from 'lucide-react';

export default function ChurchManagement() {
  const location = useLocation();
  const locationState = location.state as { role?: string; userName?: string; userEmail?: string; view?: 'student' | 'teacher' | 'pastor' | 'editor' | 'admin' | 'developer' } | null;
  const userName = locationState?.userName || 'Pastor User';

  const managementCards = [
    { title: 'Members', description: 'Manage congregation records and permissions.', icon: Users, badge: 'Active' },
    { title: 'Services', description: 'Set worship services, events, and prayer meetings.', icon: Calendar, badge: 'Today' },
    { title: 'Resources', description: 'Publish sermons, study guides, and announcements.', icon: BookOpen, badge: 'New' },
    { title: 'Reports', description: 'Track attendance, growth, and ministry outcomes.', icon: ClipboardList, badge: 'Updated' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Church Management</h1>
          <p className="text-muted-foreground max-w-2xl">
            Welcome back, {userName}. Manage your ministry resources, members, services,
            and reports from one dedicated pastor workspace.
          </p>
        </div>
        <Button className="w-full sm:w-auto" variant="outline">
          <ArrowRight className="mr-2 h-4 w-4" />
          Open ministry tools
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {managementCards.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title} className="border-slate-200 bg-white shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-base">{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </div>
                  <Badge>{item.badge}</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                  <Icon className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ministry operations</CardTitle>
          <CardDescription>Start a focused workflow for all church administration tasks.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h2 className="text-lg font-semibold">Member management</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Add, approve, and organize members, volunteers, and ministry teams.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h2 className="text-lg font-semibold">Service planning</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Schedule worship services, special events, and weekly meetings.
              </p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h2 className="text-lg font-semibold">Content publishing</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Publish devotional content, sermon notes, and congregation updates.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h2 className="text-lg font-semibold">Reports & attendance</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Review attendance trends, member engagement, and ministry effectiveness.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
