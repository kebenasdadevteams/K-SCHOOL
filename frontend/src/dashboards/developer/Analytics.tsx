import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { TrendingUp, Database, Cloud, GitBranch, Activity, ArrowLeft, Server, Shield } from 'lucide-react';

const systemStats = [
  { id: 1, label: 'Server uptime', value: '99.97%', icon: Server },
  { id: 2, label: 'API success', value: '98.4%', icon: Shield },
  { id: 3, label: 'Deployments', value: '14', icon: GitBranch },
  { id: 4, label: 'Active sites', value: '7', icon: Cloud },
];

const serviceHealth = [
  { id: 1, name: 'API Gateway', status: 'Online', metric: '22ms' },
  { id: 2, name: 'Database', status: 'Online', metric: '28ms' },
  { id: 3, name: 'Cache', status: 'Degraded', metric: '58ms' },
  { id: 4, name: 'CDN', status: 'Online', metric: '14ms' },
];

export default function Analytics() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Developer analytics</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">System observability</h1>
          <p className="text-muted-foreground">Monitor uptime, service health, and delivery performance for your platform.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => navigate('/developer')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Developer Dashboard
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {systemStats.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardDescription>{item.label}</CardDescription>
                  <Icon className="h-5 w-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{item.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Service health</CardTitle>
          <CardDescription>System status and response metrics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {serviceHealth.map((service) => (
            <div key={service.id} className="flex flex-col gap-2 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold">{service.name}</p>
                <p className="text-sm text-muted-foreground">{service.status === 'Online' ? 'Healthy' : service.status}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={service.status === 'Online' ? 'secondary' : 'outline'}>{service.status}</Badge>
                <span className="text-sm text-muted-foreground">{service.metric}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Performance highlights</CardTitle>
          <CardDescription>Recent delivery and system trends</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-muted/50 p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Activity className="h-4 w-4" />
              <span>Request throughput</span>
            </div>
            <p className="mt-3 text-3xl font-semibold">18.2k</p>
          </div>
          <div className="rounded-xl bg-muted/50 p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Database className="h-4 w-4" />
              <span>DB queries</span>
            </div>
            <p className="mt-3 text-3xl font-semibold">4.8k</p>
          </div>
          <div className="rounded-xl bg-muted/50 p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Activity className="h-4 w-4" />
              <span>Incidents</span>
            </div>
            <p className="mt-3 text-3xl font-semibold">1</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
