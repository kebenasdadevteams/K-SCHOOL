import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SidebarLayout } from '../../SidebarLayout';
import api from '../../services/api';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { LayoutDashboard, Bell, CheckCircle2, FileText, MessageSquare, Calendar } from 'lucide-react';

export default function Notifications() {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as { role?: string; userName?: string; userEmail?: string; view?: 'student' | 'teacher' | 'pastor' | 'editor' | 'admin' | 'developer' } | null;

  const [notifications, setNotifications] = useState<Array<{id:number; title:string; message:string; type:string; created_at:string}>>([]);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const { data } = await api.get('/activity/notifications');
        setNotifications(data.data || []);
      } catch (error) {
        console.error('Unable to load notifications', error);
      }
    };

    loadNotifications();
  }, []);

  const user = {
    full_name: locationState?.userName || 'Demo User',
    email: locationState?.userEmail || 'demo@church.com',
  };

  const role = locationState?.role || 'student';
  const activeView = locationState?.view ?? (locationState?.role === 'teacher' ? 'teacher' : locationState?.role === 'pastor' ? 'pastor' : locationState?.role === 'editor' ? 'editor' : locationState?.role === 'admin' ? 'admin' : locationState?.role === 'developer' ? 'developer' : 'student');

  const navigateWithState = (path: string) => {
    navigate(path, {
      state: {
        ...((location.state as Record<string, unknown>) || {}),
        role,
        view: activeView,
      },
    });
  };

  const iconMap = {
    assignment: FileText,
    message: MessageSquare,
    progress: CheckCircle2,
    calendar: Calendar,
  } as const;

  return (
    <SidebarLayout userRole={role} userName={user.full_name} userEmail={user.email} activeView={activeView}>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Bell className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Activity Feed</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Notifications</h1>
            <p className="text-muted-foreground">Keep track of assignments, messages, and learning updates in one place.</p>
          </div>
          <Button variant="outline" onClick={() => navigateWithState('/student')}>
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle>Recent notifications</CardTitle>
                <CardDescription>Important updates for the student dashboard</CardDescription>
              </div>
              <Badge variant="secondary">4 new</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.length === 0 ? (
              <p className="text-sm text-muted-foreground">No notifications yet.</p>
            ) : notifications.map((notification) => {
              const Icon = iconMap[(notification.type as keyof typeof iconMap) || 'assignment'];
              return (
                <div key={notification.id} className="flex items-start gap-3 rounded-xl border p-4 hover:bg-muted/40 transition-colors">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium">{notification.title}</p>
                      <span className="text-xs text-muted-foreground">{new Date(notification.created_at).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </SidebarLayout>
  );
}