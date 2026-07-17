import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label'; // Added missing import
import { Switch } from '../../components/ui/switch';
import { ArrowLeft, Shield, Settings as SettingsIcon } from 'lucide-react';

export default function Settings() {
  const navigate = useNavigate();
 
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <SettingsIcon className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Developer settings</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Debug & system settings</h1>
          <p className="text-muted-foreground">Configure platform tools and performance settings for the developer workspace.</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/developer')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Developer Dashboard
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Debug mode</CardTitle>
            <CardDescription>Enable verbose logging and runtime debugging output.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-sm">Verbose logging</span>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Access control</CardTitle>
            <CardDescription>Developer tools and admin guard settings.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Show debug sidebar</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Enable API inspection</span>
                <Switch />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Developer account</CardTitle>
          <CardDescription>Update your contact info and workspace preferences.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <Label htmlFor="email">Contact email</Label>
            <Input id="email" type="email" defaultValue="developer@kebenaschurch.org" />
          </div>
          <div className="space-y-3">
            <Label htmlFor="timezone">Timezone</Label>
            <Input id="timezone" type="text" defaultValue="Africa/Addis_Ababa" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}