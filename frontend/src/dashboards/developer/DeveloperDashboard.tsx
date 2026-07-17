import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { SidebarLayout } from '../components/SidebarLayout';
import { useAuth } from '../../contexts/AuthContext';
import DeveloperAnalytics from './Analytics';
import Messages from './Messages';
import UsersPage from './Users';
import ContentManagement from './ContentManagement';
import SettingsPage from './Settings';
import { 
  LayoutDashboard,
  FileText,
  Activity,
  Server,
  Users,
  TrendingUp,
  Shield,
  Settings,
  Code,
  GitBranch,
  Database,
  Cloud,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw
} from 'lucide-react';

// UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';

// Types
interface SystemStatus {
  status: 'ok' | 'error' | 'checking';
  uptime?: string;
  responseTime?: number;
  lastChecked?: string;
}

interface ServiceStatus {
  name: string;
  status: 'online' | 'offline' | 'degraded';
  responseTime?: number;
  uptime?: string;
}

// Health Check Component
const HealthCheck: React.FC = () => {
  const [status, setStatus] = useState<SystemStatus['status']>('checking');
  const [uptime, setUptime] = useState<string>('2h 34m');
  const [responseTime, setResponseTime] = useState<number>(42);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const checkHealth = async (): Promise<void> => {
    setIsRefreshing(true);
    try {
      const response = await fetch('/health');
      if (response.ok) {
        setStatus('ok');
        setResponseTime(Math.floor(Math.random() * 50 + 20));
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const services: ServiceStatus[] = [
    { name: 'API Server', status: status === 'ok' ? 'online' : status === 'error' ? 'offline' : 'degraded', responseTime: responseTime, uptime: uptime },
    { name: 'Database', status: 'online', responseTime: 28, uptime: '2h 34m' },
    { name: 'Redis Cache', status: 'online', responseTime: 5, uptime: '2h 34m' },
    { name: 'Storage Service', status: 'online', responseTime: 63, uptime: '2h 30m' },
    { name: 'Email Service', status: 'degraded', responseTime: 120, uptime: '1h 12m' },
    { name: 'CDN', status: 'online', responseTime: 15, uptime: '2h 34m' },
  ];

  const getStatusColor = (status: ServiceStatus['status']): string => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-red-500';
      case 'degraded': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: ServiceStatus['status']): string => {
    switch (status) {
      case 'online': return 'Online';
      case 'offline': return 'Offline';
      case 'degraded': return 'Degraded';
      default: return 'Unknown';
    }
  };

  const getStatusBadgeVariant = (status: ServiceStatus['status']): 'default' | 'secondary' | 'destructive' => {
    switch (status) {
      case 'online': return 'default';
      case 'offline': return 'destructive';
      case 'degraded': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">System Health</h1>
          <p className="text-muted-foreground">Monitor the health of all services</p>
        </div>
        <Button onClick={checkHealth} disabled={isRefreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Overall Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Overall Status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {status === 'ok' ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : status === 'error' ? (
                <XCircle className="h-5 w-5 text-red-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-yellow-500 animate-pulse" />
              )}
              <span className="text-xl font-bold capitalize">
                {status === 'ok' ? 'Healthy' : status === 'error' ? 'Critical' : 'Checking...'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Uptime</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">99.98%</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Response Time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{responseTime}ms</div>
            <p className="text-xs text-muted-foreground">Average latency</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {services.filter(s => s.status === 'online').length}/{services.length}
            </div>
            <p className="text-xs text-muted-foreground">Services online</p>
          </CardContent>
        </Card>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <Card key={service.name} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">{service.name}</CardTitle>
                <Badge variant={getStatusBadgeVariant(service.status)}>
                  {getStatusText(service.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Response Time</span>
                  <span className="font-medium">{service.responseTime}ms</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Uptime</span>
                  <span className="font-medium">{service.uptime}</span>
                </div>
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${getStatusColor(service.status)}`} />
                    <span className="text-xs text-muted-foreground">Last checked: 1 min ago</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* System Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>System Metrics</CardTitle>
          <CardDescription>Key performance indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground">CPU Usage</p>
              <div className="flex items-center gap-2 mt-1">
                <Progress value={45} className="flex-1" />
                <span className="text-sm font-medium">45%</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Memory Usage</p>
              <div className="flex items-center gap-2 mt-1">
                <Progress value={62} className="flex-1" />
                <span className="text-sm font-medium">62%</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Disk Usage</p>
              <div className="flex items-center gap-2 mt-1">
                <Progress value={38} className="flex-1" />
                <span className="text-sm font-medium">38%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Logs Component
const Logs: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    // Simulate loading logs
    setTimeout(() => {
      setLogs([
        { id: 1, timestamp: '2026-07-16 14:32:21', level: 'info', message: 'User login successful', source: 'auth-service' },
        { id: 2, timestamp: '2026-07-16 14:30:15', level: 'warning', message: 'High memory usage detected', source: 'system-monitor' },
        { id: 3, timestamp: '2026-07-16 14:25:08', level: 'error', message: 'Failed to connect to database', source: 'database' },
        { id: 4, timestamp: '2026-07-16 14:20:45', level: 'info', message: 'Course published: Introduction to Biblical Studies', source: 'content-service' },
        { id: 5, timestamp: '2026-07-16 14:15:33', level: 'debug', message: 'Cache miss for key: user:123:profile', source: 'cache' },
        { id: 6, timestamp: '2026-07-16 14:10:22', level: 'info', message: 'New user registered: abebe@example.com', source: 'auth-service' },
        { id: 7, timestamp: '2026-07-16 14:05:11', level: 'warning', message: 'Slow query detected: SELECT * FROM courses', source: 'database' },
        { id: 8, timestamp: '2026-07-16 14:00:00', level: 'info', message: 'System health check passed', source: 'system-monitor' },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getLevelColor = (level: string): string => {
    switch (level) {
      case 'info': return 'text-blue-500';
      case 'warning': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      case 'debug': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  };

  const getLevelBadge = (level: string): 'default' | 'secondary' | 'destructive' => {
    switch (level) {
      case 'info': return 'default';
      case 'warning': return 'secondary';
      case 'error': return 'destructive';
      case 'debug': return 'secondary';
      default: return 'secondary';
    }
  };

  const filteredLogs = filter === 'all' ? logs : logs.filter(log => log.level === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">System Logs</h1>
          <p className="text-muted-foreground">View and filter system logs</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>
            All
          </Button>
          <Button size="sm" variant={filter === 'info' ? 'default' : 'outline'} onClick={() => setFilter('info')}>
            Info
          </Button>
          <Button size="sm" variant={filter === 'warning' ? 'default' : 'outline'} onClick={() => setFilter('warning')}>
            Warning
          </Button>
          <Button size="sm" variant={filter === 'error' ? 'default' : 'outline'} onClick={() => setFilter('error')}>
            Error
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading logs...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Timestamp</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Level</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Message</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground hidden md:table-cell">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3 text-sm font-mono text-muted-foreground">{log.timestamp}</td>
                      <td className="px-4 py-3">
                        <Badge variant={getLevelBadge(log.level)}>
                          <span className={getLevelColor(log.level)}>{log.level}</span>
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm">{log.message}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">{log.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {!loading && filteredLogs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No logs found matching the filter.</p>
        </div>
      )}
    </div>
  );
};

// API Status Component
const ApiStatus: React.FC = () => {
  const [endpoints, setEndpoints] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => {
      setEndpoints([
        { id: 1, path: '/api/auth/login', method: 'POST', status: 'online', responseTime: 45, lastChecked: '1 min ago' },
        { id: 2, path: '/api/auth/register', method: 'POST', status: 'online', responseTime: 52, lastChecked: '1 min ago' },
        { id: 3, path: '/api/courses', method: 'GET', status: 'online', responseTime: 38, lastChecked: '1 min ago' },
        { id: 4, path: '/api/courses/:id', method: 'GET', status: 'online', responseTime: 42, lastChecked: '1 min ago' },
        { id: 5, path: '/api/courses/:id/enroll', method: 'POST', status: 'degraded', responseTime: 125, lastChecked: '2 min ago' },
        { id: 6, path: '/api/assignments', method: 'GET', status: 'online', responseTime: 35, lastChecked: '1 min ago' },
        { id: 7, path: '/api/assignments/:id/submit', method: 'POST', status: 'online', responseTime: 48, lastChecked: '1 min ago' },
        { id: 8, path: '/api/podcasts', method: 'GET', status: 'offline', responseTime: 0, lastChecked: '5 min ago' },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const getStatusBadge = (status: string): 'default' | 'secondary' | 'destructive' => {
    switch (status) {
      case 'online': return 'default';
      case 'offline': return 'destructive';
      case 'degraded': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">API Status</h1>
          <p className="text-muted-foreground">Monitor the status of all API endpoints</p>
        </div>
        <Badge variant="secondary" className="px-3 py-1">
          {endpoints.filter(e => e.status === 'online').length}/{endpoints.length} Online
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Endpoints</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{endpoints.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Average Response Time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {endpoints.length > 0 
                ? Math.round(endpoints.filter(e => e.status === 'online').reduce((acc, curr) => acc + curr.responseTime, 0) / endpoints.filter(e => e.status === 'online').length)
                : 0}ms
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Uptime</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.5%</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading endpoints...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Endpoint</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Method</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Response Time</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground hidden md:table-cell">Last Checked</th>
                  </tr>
                </thead>
                <tbody>
                  {endpoints.map((endpoint) => (
                    <tr key={endpoint.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3 text-sm font-mono">{endpoint.path}</td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary" className="font-mono text-xs">
                          {endpoint.method}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={getStatusBadge(endpoint.status)}>
                          {endpoint.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {endpoint.responseTime > 0 ? `${endpoint.responseTime}ms` : '—'}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">
                        {endpoint.lastChecked}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Developer Overview Component
const DeveloperOverview: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const stats = {
    totalUsers: 9,
    debugTickets: 4,
    systemHealth: 'Live',
    activeSites: 1,
    apiEndpoints: 24,
    uptime: '99.98%',
  };

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, Developer {user?.full_name || 'Demo'}! 🛠️
        </h1>
        <p className="text-muted-foreground">
          Full site access, manage users, and debug the platform
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Total Users</CardDescription>
              <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900/20">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">Active platform accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Debug Tickets</CardDescription>
              <div className="p-2 bg-orange-100 rounded-lg dark:bg-orange-900/20">
                <Code className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.debugTickets}</div>
            <p className="text-xs text-muted-foreground mt-1">Open tickets</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>System Health</CardDescription>
              <div className="p-2 bg-green-100 rounded-lg dark:bg-green-900/20">
                <Activity className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.systemHealth}</div>
            <p className="text-xs text-muted-foreground mt-1">All systems operational</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Uptime</CardDescription>
              <div className="p-2 bg-purple-100 rounded-lg dark:bg-purple-900/20">
                <Server className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.uptime}</div>
            <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Developer Actions</CardTitle>
            <CardDescription>Manage users, inspect content, and monitor the system</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="justify-start" onClick={() => navigate('/developer/users')}>
              <Users className="h-4 w-4 mr-2" />
              Manage Users
            </Button>
            <Button variant="outline" className="justify-start" onClick={() => navigate('/developer/content')}>
              <FileText className="h-4 w-4 mr-2" />
              Inspect Content
            </Button>
            <Button variant="outline" className="justify-start" onClick={() => navigate('/developer/analytics')}>
              <TrendingUp className="h-4 w-4 mr-2" />
              System Analytics
            </Button>
            <Button variant="outline" className="justify-start" onClick={() => navigate('/developer/settings')}>
              <Settings className="h-4 w-4 mr-2" />
              Debug & Settings
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Overview</CardTitle>
            <CardDescription>Quick system statistics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">API Endpoints</span>
              </div>
              <Badge variant="secondary">{stats.apiEndpoints}</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <Cloud className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Active Sites</span>
              </div>
              <Badge variant="secondary">{stats.activeSites}</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Recent Deployments</span>
              </div>
              <Badge variant="secondary">3</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const DeveloperNotifications: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">System notifications</h1>
        <p className="text-muted-foreground">Track important alerts, deployments, and operational updates.</p>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Latest updates</CardTitle>
            <CardDescription>Recent platform activity and maintenance notices.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { title: 'Deployment completed', detail: 'API gateway updated successfully and is healthy.', time: '2 min ago' },
              { title: 'New content review request', detail: 'Editor submissions are waiting for admin verification.', time: '18 min ago' },
              { title: 'Cache warming finished', detail: 'Performance caches were refreshed for the public site.', time: '1 hr ago' },
            ].map((item) => (
              <div key={item.title} className="rounded-lg border bg-muted/40 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.detail}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{item.time}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const DeveloperProfile: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Developer profile</h1>
        <p className="text-muted-foreground">Manage your account details, preferences, and access settings.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account overview</CardTitle>
          <CardDescription>Developer workspace details and preferred tools.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border bg-muted/40 p-4">
            <p className="text-sm text-muted-foreground">Primary role</p>
            <p className="mt-1 font-semibold">Developer</p>
          </div>
          <div className="rounded-lg border bg-muted/40 p-4">
            <p className="text-sm text-muted-foreground">Workspace</p>
            <p className="mt-1 font-semibold">Kebena Church CMS</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Main Developer Dashboard Component
const DeveloperDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <SidebarLayout
      userRole="developer"
      userName={user?.full_name || 'Developer'}
      userEmail={user?.email || 'developer@church.com'}
    >
      <Routes>
        <Route index element={<DeveloperOverview />} />
        <Route path="health" element={<HealthCheck />} />
        <Route path="logs" element={<Logs />} />
        <Route path="api-status" element={<ApiStatus />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="content" element={<ContentManagement />} />
        <Route path="messages" element={<Messages embedded />} />
        <Route path="notifications" element={<DeveloperNotifications />} />
        <Route path="profile" element={<DeveloperProfile />} />
        <Route path="analytics" element={<DeveloperAnalytics />} />
        <Route path="settings" element={<SettingsPage />} />
      </Routes>
    </SidebarLayout>
  );
};

export default DeveloperDashboard;