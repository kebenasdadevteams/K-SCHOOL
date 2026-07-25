import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { SidebarLayout } from '../../SidebarLayout';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import {
  Lock,
  Mail,
  Save,
  Shield,
  UserCircle2,
  LayoutDashboard,
  Upload,
  Camera,
} from 'lucide-react';

const API_BASE_URL = '/api/v1';

export default function Profile() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: authUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const locationState = location.state as { role?: string; userName?: string; userEmail?: string; view?: 'student' | 'teacher' | 'pastor' | 'editor' | 'admin' } | null;
  const [role] = useState(locationState?.role || 'student');
  const [activeView, setActiveView] = useState<'student' | 'teacher' | 'pastor' | 'editor' | 'admin' | 'developer'>(
    locationState?.view ?? 'student'
  );

  const [displayName, setDisplayName] = useState(authUser?.full_name || locationState?.userName || 'Demo User');
  const [emailAddress, setEmailAddress] = useState(authUser?.email || locationState?.userEmail || 'demo@church.com');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('kschool_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.full_name) setDisplayName(parsedUser.full_name);
        if (parsedUser.email) setEmailAddress(parsedUser.email);
        if (parsedUser.phone_number) setPhoneNumber(parsedUser.phone_number);
        if (parsedUser.profile_picture) setProfilePicture(parsedUser.profile_picture);
      } catch (error) {
        console.error('Unable to restore profile', error);
      }
    }
  }, []);

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

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePictureFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfilePicture(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('kschool_token');
      if (!token) {
        alert('Please log in again');
        return;
      }

      const profileData: Record<string, string> = {
        full_name: displayName,
        email: emailAddress,
      };

      if (phoneNumber) {
        profileData.phone_number = phoneNumber;
      }

      if (profilePictureFile) {
        const formData = new FormData();
        formData.append('file', profilePictureFile);
        
        // For now, we'll just use a data URL since we don't have a file upload endpoint
        // In production, you'd upload to a file server and get a URL back
        profileData.profile_picture = profilePicture || '';
      }

      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();
      if (data.success) {
        // Update localStorage with new user data
        const userData = {
          id: authUser?.id,
          full_name: displayName,
          email: emailAddress,
          roles: authUser?.roles || [],
          phone_number: phoneNumber || null,
          profile_picture: profilePicture || null,
        };
        localStorage.setItem('kschool_user', JSON.stringify(userData));
        
        alert('Profile updated successfully!');
        window.dispatchEvent(new CustomEvent('profile-updated'));
        window.dispatchEvent(new CustomEvent('church-cms-profile-updated'));
      } else {
        alert('Error: ' + (data.message || 'Failed to update profile'));
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('Please fill all password fields');
      return;
    }

    if (newPassword.length < 8) {
      alert('New password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setIsChangingPassword(true);
    try {
      const token = localStorage.getItem('kschool_token');
      if (!token) {
        alert('Please log in again');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
          confirm_password: confirmPassword,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setIsPasswordOpen(false);
        alert('Password changed successfully!');
      } else {
        alert('Error: ' + (data.message || 'Failed to change password'));
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Failed to change password. Please try again.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <SidebarLayout
      userRole={role}
      userName={user.full_name}
      userEmail={user.email}
      activeView={activeView}
    >
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <UserCircle2 className="h-5 w-5 text-[#865014]" />
              <span className="text-sm font-medium text-muted-foreground">My Account</span>
            </div>
            <h1 className="text-3xl font-bold mb-2 text-[#865014]">Your Profile</h1>
            <p className="text-muted-foreground">Manage your personal information and account security.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => navigateWithState('/student')}>
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Button onClick={handleSaveProfile} disabled={isSaving} className="bg-[#865014] hover:bg-[#6b3f0f]">
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-12">
          {/* Profile Picture Card */}
          <Card className="xl:col-span-4 border-[#E0AE3F]/30">
            <CardHeader>
              <CardTitle className="text-[#865014]">Profile Picture</CardTitle>
              <CardDescription>Update your profile photo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center gap-4">
                <div className="relative h-24 w-24 rounded-full bg-[#F6EBD8] flex items-center justify-center overflow-hidden">
                  {profilePicture ? (
                    <img src={profilePicture} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <Camera className="h-10 w-10 text-[#865014]" />
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-[#E0AE3F] text-[#865014] hover:bg-[#F6EBD8]"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Photo
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information Card */}
          <Card className="xl:col-span-4 border-[#E0AE3F]/30">
            <CardHeader>
              <CardTitle className="text-[#865014]">Personal Information</CardTitle>
              <CardDescription>Update your basic information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 rounded-xl border border-[#E0AE3F]/30 p-4 bg-[#F6EBD8]/20">
                <div className="h-14 w-14 rounded-full bg-[#E0AE3F]/20 flex items-center justify-center">
                  <UserCircle2 className="h-7 w-7 text-[#865014]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold truncate">{user.full_name}</p>
                  <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                </div>
                <Badge variant="outline" className="capitalize bg-[#E0AE3F]/20 text-[#865014] border-[#E0AE3F]">{role}</Badge>
              </div>

              <div className="space-y-2">
                <Label htmlFor="display-name" className="text-[#865014]">Full Name</Label>
                <Input
                  id="display-name"
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  className="border-[#E0AE3F]/30 focus:border-[#E0AE3F]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#865014]">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={emailAddress}
                  onChange={(event) => setEmailAddress(event.target.value)}
                  className="border-[#E0AE3F]/30 focus:border-[#E0AE3F]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-[#865014]">Phone Number</Label>
                <Input
                  id="phone"
                  value={phoneNumber}
                  onChange={(event) => setPhoneNumber(event.target.value)}
                  placeholder="Add your phone number"
                  className="border-[#E0AE3F]/30 focus:border-[#E0AE3F]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Card */}
          <Card className="xl:col-span-4 border-[#E0AE3F]/30">
            <CardHeader>
              <CardTitle className="text-[#865014]">Security</CardTitle>
              <CardDescription>Protect your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-xl border border-[#E0AE3F]/30 bg-[#F6EBD8]/20 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-[#865014]" />
                  <p className="font-medium text-[#865014]">Account Protection</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Manage your password and keep your account secure.
                </p>
                <Button
                  variant="outline"
                  className="w-full justify-start border-[#E0AE3F] text-[#865014] hover:bg-[#F6EBD8]"
                  onClick={() => setIsPasswordOpen(true)}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Password Change Dialog */}
      <Dialog open={isPasswordOpen} onOpenChange={setIsPasswordOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-[#865014]">Change Password</DialogTitle>
            <DialogDescription>Update your login password for enhanced security.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password" className="text-[#865014]">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                placeholder="Enter your current password"
                className="border-[#E0AE3F]/30 focus:border-[#E0AE3F]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password" className="text-[#865014]">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                placeholder="Enter new password (min 8 characters)"
                className="border-[#E0AE3F]/30 focus:border-[#E0AE3F]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-[#865014]">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Confirm your new password"
                className="border-[#E0AE3F]/30 focus:border-[#E0AE3F]"
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsPasswordOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handlePasswordChange}
                disabled={isChangingPassword}
                className="bg-[#865014] hover:bg-[#6b3f0f]"
              >
                {isChangingPassword ? 'Changing...' : 'Save Password'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarLayout>
  );
}
