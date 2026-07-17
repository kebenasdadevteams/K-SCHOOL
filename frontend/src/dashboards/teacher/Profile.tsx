import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { LayoutDashboard, UserCircle2, Save, Camera, Lock, Mail, Shield, Upload } from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const [displayName, setDisplayName] = useState(locationState?.userName || 'Teacher User');
  const [emailAddress, setEmailAddress] = useState(locationState?.userEmail || 'teacher@kebenasdachurch.org');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('kschool_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setDisplayName(parsedUser.full_name || displayName);
        setEmailAddress(parsedUser.email || emailAddress);
        if (parsedUser.profile_picture) setProfilePicture(parsedUser.profile_picture);
      } catch {
        // ignore malformed storage
      }
    }
  }, []);

  const navigateWithState = (path: string) => {
    navigate(path, {
      state: {
        ...((location.state as Record<string, unknown>) || {}),
        role,
        view: activeView,
        userName: displayName,
        userEmail: emailAddress,
      },
    });
  };

  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setProfilePictureFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setProfilePicture(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = () => {
    setIsSaving(true);
    setTimeout(() => {
      const updatedProfile = {
        full_name: displayName,
        email: emailAddress,
        phone_number: phoneNumber,
        profile_picture: profilePicture,
      };

      localStorage.setItem('kschool_user', JSON.stringify(updatedProfile));
      window.dispatchEvent(new CustomEvent('church-cms-profile-updated'));
      setIsSaving(false);
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <UserCircle2 className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Personal profile</span>
          </div>
            <h1 className="text-3xl font-bold mb-2">Profile</h1>
            <p className="text-muted-foreground">Update your teacher profile and account details.</p>
          </div>
          <Button variant="outline" onClick={() => navigateWithState(`/${activeView}`)}>
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
        </div>

        <div className="grid gap-6 xl:grid-cols-12">
          <Card className="xl:col-span-4">
            <CardHeader>
              <CardTitle>Profile Photo</CardTitle>
              <CardDescription>Upload or change your profile image.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center gap-4">
                <div className="relative h-28 w-28 overflow-hidden rounded-full bg-muted flex items-center justify-center">
                  {profilePicture ? (
                    <img src={profilePicture} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <Camera className="h-10 w-10 text-slate-500" />
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  className="w-full text-sm text-slate-600"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="xl:col-span-8">
            <CardHeader>
              <CardTitle>Account details</CardTitle>
              <CardDescription>Personal information used across the dashboard.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="display-name">Display name</Label>
                  <Input id="display-name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input id="email" value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="phone">Phone number</Label>
                  <Input id="phone" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button onClick={handleSaveProfile} disabled={isSaving}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Profile'}
                </Button>
                <Button variant="outline" onClick={() => navigateWithState(`/${activeView}`)}>
                  <Shield className="h-4 w-4 mr-2" />
                  Back to dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  );
}
