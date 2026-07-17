import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Switch } from '../../components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import {
  Bell,
  BookOpen,
  Calendar,
  Lock,
  Mail,
  Save,
  Settings as SettingsIcon,
  Shield,
  UserCircle2,
  FileText,
  LayoutDashboard,
} from 'lucide-react';

export default function Settings() {
  const navigate = useNavigate();
  const location = useLocation();

  const locationState = location.state as { role?: string; userName?: string; userEmail?: string; view?: 'student' | 'teacher' | 'pastor' | 'editor' | 'admin' } | null;
  const [role] = useState(locationState?.role || 'editor');
  const [activeView] = useState<'student' | 'teacher' | 'pastor' | 'editor' | 'admin'>(
    locationState?.view ?? (locationState?.role === 'teacher' ? 'teacher' : locationState?.role === 'pastor' ? 'pastor' : locationState?.role === 'editor' ? 'editor' : locationState?.role === 'admin' ? 'admin' : 'editor')
  );
  const settingsKey = `church-cms-settings-${role}-${activeView}`;
  const passwordKey = `church-cms-password-${role}`;
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailDigest, setEmailDigest] = useState(true);
  const [darkReminders, setDarkReminders] = useState(false);
  const [displayName, setDisplayName] = useState(locationState?.userName || 'Demo User');
  const [emailAddress, setEmailAddress] = useState(locationState?.userEmail || 'demo@church.com');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);

  useEffect(() => {
    const storedSettings = localStorage.getItem(settingsKey);
    if (storedSettings) {
      try {
        const parsed = JSON.parse(storedSettings) as {
          displayName?: string;
          emailAddress?: string;
          phoneNumber?: string;
          notificationsEnabled?: boolean;
          emailDigest?: boolean;
          darkReminders?: boolean;
        };
        if (parsed.displayName) setDisplayName(parsed.displayName);
        if (parsed.emailAddress) setEmailAddress(parsed.emailAddress);
        if (parsed.phoneNumber) setPhoneNumber(parsed.phoneNumber);
        if (typeof parsed.notificationsEnabled === 'boolean') setNotificationsEnabled(parsed.notificationsEnabled);
        if (typeof parsed.emailDigest === 'boolean') setEmailDigest(parsed.emailDigest);
        if (typeof parsed.darkReminders === 'boolean') setDarkReminders(parsed.darkReminders);
      } catch {
        // Ignore malformed local data and fall back to defaults.
      }
    }

    const storedPassword = localStorage.getItem(passwordKey);
    if (!storedPassword) {
      localStorage.setItem(passwordKey, 'Church@123');
    }
  }, [passwordKey, settingsKey]);

  const user = {
    full_name: displayName,
    email: emailAddress,
  };

  const navigateWithState = (path: string, nextView: 'student' | 'teacher' | 'pastor' | 'editor' | 'admin' = activeView) => {
    navigate(path, {
      state: {
        ...((location.state as Record<string, unknown>) || {}),
        role,
        view: nextView,
        userName: displayName,
        userEmail: emailAddress,
      },
    });
  };

  const handleSave = () => {
    localStorage.setItem(
      settingsKey,
      JSON.stringify({
        displayName,
        emailAddress,
        phoneNumber,
        notificationsEnabled,
        emailDigest,
        darkReminders,
      })
    );

    window.dispatchEvent(new CustomEvent('church-cms-profile-updated'));

    toast.success('Settings saved', {
      description: 'Your account preferences have been updated.',
    });
  };

  const handlePasswordChange = () => {
    const storedPassword = localStorage.getItem(passwordKey) || 'Church@123';
    if (currentPassword !== storedPassword) {
      toast.error('Current password is incorrect');
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    localStorage.setItem(passwordKey, newPassword);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setIsPasswordOpen(false);

    toast.success('Password updated', {
      description: 'Your password has been changed successfully.',
    });
  };

  return (
    <>
      <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <SettingsIcon className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Account Settings</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Profile and preferences</h1>
          <p className="text-muted-foreground">Keep your student experience organized and easy to move through.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => navigateWithState(`/${activeView}`)}>
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-12">
        <Card className="xl:col-span-4">
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Identity and access</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 rounded-xl border p-4 bg-muted/20">
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                <UserCircle2 className="h-7 w-7 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold truncate">{user.full_name}</p>
                <p className="text-sm text-muted-foreground truncate">{user.email}</p>
              </div>
              <Badge variant="outline" className="capitalize">{role}</Badge>
            </div>

            <div className="space-y-2">
              <Label htmlFor="display-name">Display name</Label>
              <Input id="display-name" value={displayName} onChange={(event) => setDisplayName(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input id="email" value={emailAddress} onChange={(event) => setEmailAddress(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone number</Label>
              <Input id="phone" value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)} placeholder="Add your phone number" />
            </div>
          </CardContent>
        </Card>

        <Card className="xl:col-span-4">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Control how the dashboard keeps you updated</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-xl border p-4">
              <div className="flex items-center gap-3">
                <Bell className="h-4 w-4 text-primary" />
                <div>
                  <p className="font-medium">Push notifications</p>
                  <p className="text-xs text-muted-foreground">Assignments, reminders, and updates</p>
                </div>
              </div>
              <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
            </div>

              <div className="flex items-center justify-between rounded-xl border p-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-primary" />
                  <div>
                    <p className="font-medium">Weekly email digest</p>
                    <p className="text-xs text-muted-foreground">Summary of progress and upcoming work</p>
                  </div>
                </div>
                <Switch checked={emailDigest} onCheckedChange={setEmailDigest} />
              </div>

              <div className="flex items-center justify-between rounded-xl border p-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-primary" />
                  <div>
                    <p className="font-medium">Reminders after dark</p>
                    <p className="text-xs text-muted-foreground">Reduce late-night nudges</p>
                  </div>
                </div>
                <Switch checked={darkReminders} onCheckedChange={setDarkReminders} />
              </div>
            </CardContent>
          </Card>

          <Card className="xl:col-span-4">
            <CardHeader>
              <CardTitle>Security and flow</CardTitle>
              <CardDescription>Keep the experience smooth and safe</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" onClick={() => navigateWithState('/assignments', activeView)}>
                <FileText className="h-4 w-4 mr-2" />
                Go to assignments
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => navigateWithState(role === 'teacher' ? '/manage-courses' : '/courses', role === 'teacher' ? 'teacher' : 'student')}>
                <BookOpen className="h-4 w-4 mr-2" />
                {role === 'teacher' ? 'Go to manage courses' : 'Go to courses'}
              </Button>

              <div className="rounded-xl border bg-muted/20 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <p className="font-medium">Account protection</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Password and login controls can be added here when authentication settings are connected.
                </p>
                <Button variant="outline" className="w-full justify-start" onClick={() => setIsPasswordOpen(true)}>
                  <Lock className="h-4 w-4 mr-2" />
                  Change password
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isPasswordOpen} onOpenChange={setIsPasswordOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>Update your login password for this account.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current password</Label>
              <Input id="current-password" type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New password</Label>
              <Input id="new-password" type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm password</Label>
              <Input id="confirm-password" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsPasswordOpen(false)}>Cancel</Button>
              <Button type="button" onClick={handlePasswordChange}>Save Password</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}