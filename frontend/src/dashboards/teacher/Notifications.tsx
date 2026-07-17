import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import api from '../../services/api';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { LayoutDashboard, Bell, CheckCircle2, FileText, MessageSquare, Calendar } from 'lucide-react';

type NotificationItem = {
  id: number;
  title: string;
  message: string;
  type: 'assignment' | 'message' | 'progress' | 'calendar';
  created_at: string;
};

export default function Notifications() {
  const navigate = useNavigate();
  const location = useLocation();

  const locationState = location.state as {
    role?: string;
    userName?: string;
    userEmail?: string;
    view?: 'student' | 'teacher' | 'pastor' | 'editor' | 'admin' | 'developer';
  } | null;

  const [role] = useState(locationState?.role || 'teacher');
  const [activeView] = useState<
    'student' | 'teacher' | 'pastor' | 'editor' | 'admin' | 'developer'
  >(locationState?.view ?? 'teacher');
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const { data } = await api.get('/activity/notifications');
        setNotifications(data.data || []);
      } catch (error) {
        setNotifications([
          {
            id: 1,
            title: 'New assignment submission',
            message: 'Your class submitted Chapter 4 assignments.',
            type: 'assignment',
            created_at: new Date().toISOString(),
          },
          {
            id: 2,
            title: 'Message from Pastor John',
            message: 'Please send the classroom summary by tomorrow.',
            type: 'message',
            created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          },
          {
            id: 3,
            title: 'Schedule reminder',
            message: 'Weekly course meeting starts at 7:00 PM.',
            type: 'calendar',
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
          },
        ]);
      }
    };

    loadNotifications();
  }, []);

  const user = {
    full_name: locationState?.userName || 'Teacher',
    email: locationState?.userEmail || 'teacher@church.com',
  };

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
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Bell className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Activity Feed</span>
          </div>
            <h1 className="text-3xl font-bold mb-2">Notifications</h1>
            <p className="text-muted-foreground">Keep track of messages, assignments, and course updates.</p>
          </div>
          <Button variant="outline" onClick={() => navigateWithState(`/${activeView}`)}>
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle>Recent notifications</CardTitle>
                <CardDescription>Important updates for your teacher dashboard</CardDescription>
              </div>
              <Badge variant="secondary">{notifications.length} new</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.length === 0 ? (
              <p className="text-sm text-muted-foreground">No notifications yet.</p>
            ) : (
              notifications.map((notification) => {
                const Icon = iconMap[notification.type] || FileText;
                return (
                  <div key={notification.id} className="flex items-start gap-3 rounded-xl border p-4 hover:bg-muted/40 transition-colors">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium">{notification.title}</p>
                        <span className="text-xs text-muted-foreground">
                          {new Date(notification.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>

  );
}
