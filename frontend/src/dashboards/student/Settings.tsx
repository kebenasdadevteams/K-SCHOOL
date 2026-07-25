import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { SidebarLayout } from '../../SidebarLayout';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Switch } from '../../components/ui/switch';
import {
  Save,
  Settings as SettingsIcon,
  Moon,
  Sun,
  Globe,
  Type,
  Bell,
  Mail,
  Calendar,
  LayoutDashboard,
  Sparkles,
  Zap,
  Shield,
  Lock,
  User,
  Monitor,
  Palette,
  Eye,
  Volume2,
  Vibrate,
  Cloud,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Info,
  ChevronRight,
} from 'lucide-react';

const API_BASE_URL = '/api/v1';

export default function Settings() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: authUser } = useAuth();

  const locationState = location.state as { role?: string; userName?: string; userEmail?: string; view?: 'student' | 'teacher' | 'pastor' | 'editor' | 'admin' } | null;
  const [role] = useState('student');
  const [activeView, setActiveView] = useState<'student' | 'teacher' | 'pastor' | 'editor' | 'admin' | 'developer'>(
    locationState?.view ?? 'student'
  );

  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('en');
  const [fontSize, setFontSize] = useState('medium');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailDigest, setEmailDigest] = useState(true);
  const [darkReminders, setDarkReminders] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const [compactMode, setCompactMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('app_theme') || 'light';
    const savedLanguage = localStorage.getItem('app_language') || 'en';
    const savedFontSize = localStorage.getItem('app_font_size') || 'medium';
    const savedNotifications = localStorage.getItem('app_notifications') !== 'false';
    const savedEmailDigest = localStorage.getItem('app_email_digest') !== 'false';
    const savedDarkReminders = localStorage.getItem('app_dark_reminders') === 'true';
    const savedSound = localStorage.getItem('app_sound') !== 'false';
    const savedVibration = localStorage.getItem('app_vibration') === 'true';
    const savedAutoSync = localStorage.getItem('app_auto_sync') !== 'false';
    const savedCompact = localStorage.getItem('app_compact') === 'true';

    setTheme(savedTheme);
    setLanguage(savedLanguage);
    setFontSize(savedFontSize);
    setNotificationsEnabled(savedNotifications);
    setEmailDigest(savedEmailDigest);
    setDarkReminders(savedDarkReminders);
    setSoundEnabled(savedSound);
    setVibrationEnabled(savedVibration);
    setAutoSync(savedAutoSync);
    setCompactMode(savedCompact);

    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const fontSizeMap: Record<string, string> = {
      small: '14px',
      medium: '16px',
      large: '18px',
    };
    document.documentElement.style.fontSize = fontSizeMap[savedFontSize] || '16px';
  }, []);

  const user = {
    full_name: authUser?.full_name || locationState?.userName || 'Demo User',
    email: authUser?.email || locationState?.userEmail || 'demo@church.com',
  };

  const navigateWithState = (path: string, nextView: 'student' | 'teacher' | 'pastor' | 'editor' | 'admin' = activeView) => {
    navigate(path, {
      state: {
        ...((location.state as Record<string, unknown>) || {}),
        role,
        view: nextView,
        userName: user.full_name,
        userEmail: user.email,
      },
    });
  };

  const dashboardPath = activeView === 'student' ? '/student' : `/${activeView}`;

  const handleSaveSettings = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const token = localStorage.getItem('kschool_token');
      if (!token) {
        alert('Please log in again');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/auth/preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          theme,
          language,
          font_size: fontSize,
        }),
      });

      const data = await response.json();
      if (data.success) {
        localStorage.setItem('app_theme', theme);
        localStorage.setItem('app_language', language);
        localStorage.setItem('app_font_size', fontSize);
        localStorage.setItem('app_notifications', String(notificationsEnabled));
        localStorage.setItem('app_email_digest', String(emailDigest));
        localStorage.setItem('app_dark_reminders', String(darkReminders));
        localStorage.setItem('app_sound', String(soundEnabled));
        localStorage.setItem('app_vibration', String(vibrationEnabled));
        localStorage.setItem('app_auto_sync', String(autoSync));
        localStorage.setItem('app_compact', String(compactMode));

        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }

        const fontSizeMap: Record<string, string> = {
          small: '14px',
          medium: '16px',
          large: '18px',
        };
        document.documentElement.style.fontSize = fontSizeMap[fontSize];

        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        window.dispatchEvent(new CustomEvent('settings-updated'));
      } else {
        alert('Error: ' + (data.message || 'Failed to save settings'));
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      localStorage.setItem('app_theme', theme);
      localStorage.setItem('app_language', language);
      localStorage.setItem('app_font_size', fontSize);
      localStorage.setItem('app_notifications', String(notificationsEnabled));
      localStorage.setItem('app_email_digest', String(emailDigest));
      localStorage.setItem('app_dark_reminders', String(darkReminders));
      localStorage.setItem('app_sound', String(soundEnabled));
      localStorage.setItem('app_vibration', String(vibrationEnabled));
      localStorage.setItem('app_auto_sync', String(autoSync));
      localStorage.setItem('app_compact', String(compactMode));

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SidebarLayout
      userRole={role}
      userName={user.full_name}
      userEmail={user.email}
      activeView={activeView}
    >
      <div className="space-y-6 max-w-7xl mx-auto px-4 pb-12">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-900/20">
                <SettingsIcon className="h-5 w-5 text-amber-500" />
              </div>
              <span className="text-sm font-medium text-slate-500 dark:text-slate-600">Preferences</span>
            </div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3 text-slate-800 dark:text-slate-1000">
              System Settings
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-900/30 px-3 py-1 text-sm font-medium text-amber-700 dark:text-amber-400">
                <Sparkles className="h-4 w-4" />
                Customize
              </span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500" />
              Customize your learning experience and platform preferences
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              onClick={() => navigateWithState(dashboardPath)} 
              className="rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:border-amber-200 dark:hover:border-amber-700 hover:text-amber-700 dark:hover:text-amber-400 transition-all duration-200"
            >
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Button 
              onClick={handleSaveSettings} 
              disabled={isSaving} 
              className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : saveSuccess ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Success Message */}
        {saveSuccess && (
          <div className="flex items-center gap-3 rounded-xl bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 p-4 animate-in slide-in-from-top-2 fade-in duration-300">
            <div className="p-1.5 rounded-lg bg-green-100 dark:bg-green-900/30">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-sm text-green-700 dark:text-green-400 font-medium">Settings saved successfully!</p>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Appearance Card */}
          <Card className="border-2 border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all duration-300 bg-white dark:bg-slate-900">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-900/20">
                  <Palette className="h-5 w-5 text-amber-500" />
                </div>
                <CardTitle className="text-slate-800 dark:text-white">Appearance</CardTitle>
              </div>
              <CardDescription className="text-slate-500 dark:text-slate-400">Customize how the platform looks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Theme */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  {theme === 'dark' ? (
                    <Moon className="h-4 w-4 text-amber-500" />
                  ) : (
                    <Sun className="h-4 w-4 text-amber-500" />
                  )}
                  <Label className="text-slate-700 dark:text-slate-300 font-medium cursor-pointer">Theme</Label>
                </div>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger className="w-full h-11 px-4 py-2 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-amber-400 dark:hover:border-amber-600 focus:border-amber-500 dark:focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 dark:focus:ring-amber-500/20 transition-all duration-200 text-slate-700 dark:text-slate-200">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-xl rounded-xl overflow-hidden p-1">
                    <SelectItem 
                      value="light" 
                      className="px-4 py-2.5 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 focus:bg-amber-50 dark:focus:bg-amber-900/20 cursor-pointer text-slate-700 dark:text-slate-200 transition-colors duration-150 data-[state=checked]:bg-amber-100 dark:data-[state=checked]:bg-amber-900/30 data-[state=checked]:text-amber-700 dark:data-[state=checked]:text-amber-400"
                    >
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4 text-amber-500" />
                        Light Mode
                      </div>
                    </SelectItem>
                    <SelectItem 
                      value="dark" 
                      className="px-4 py-2.5 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 focus:bg-amber-50 dark:focus:bg-amber-900/20 cursor-pointer text-slate-700 dark:text-slate-200 transition-colors duration-150 data-[state=checked]:bg-amber-100 dark:data-[state=checked]:bg-amber-900/30 data-[state=checked]:text-amber-700 dark:data-[state=checked]:text-amber-400"
                    >
                      <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4 text-amber-500" />
                        Dark Mode
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  {theme === 'light' ? 'Bright interface for daytime use' : 'Dark interface for reduced eye strain'}
                </p>
              </div>

              {/* Font Size */}
              <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <Type className="h-4 w-4 text-amber-500" />
                  <Label className="text-slate-700 dark:text-slate-300 font-medium cursor-pointer">Font Size</Label>
                </div>
                <Select value={fontSize} onValueChange={setFontSize}>
                  <SelectTrigger className="w-full h-11 px-4 py-2 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-amber-400 dark:hover:border-amber-600 focus:border-amber-500 dark:focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 dark:focus:ring-amber-500/20 transition-all duration-200 text-slate-700 dark:text-slate-200">
                    <SelectValue placeholder="Select font size" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-xl rounded-xl overflow-hidden p-1">
                    <SelectItem 
                      value="small" 
                      className="px-4 py-2.5 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 focus:bg-amber-50 dark:focus:bg-amber-900/20 cursor-pointer text-slate-700 dark:text-slate-200 transition-colors duration-150 data-[state=checked]:bg-amber-100 dark:data-[state=checked]:bg-amber-900/30 data-[state=checked]:text-amber-700 dark:data-[state=checked]:text-amber-400"
                    >
                      Small
                    </SelectItem>
                    <SelectItem 
                      value="medium" 
                      className="px-4 py-2.5 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 focus:bg-amber-50 dark:focus:bg-amber-900/20 cursor-pointer text-slate-700 dark:text-slate-200 transition-colors duration-150 data-[state=checked]:bg-amber-100 dark:data-[state=checked]:bg-amber-900/30 data-[state=checked]:text-amber-700 dark:data-[state=checked]:text-amber-400"
                    >
                      Medium (Default)
                    </SelectItem>
                    <SelectItem 
                      value="large" 
                      className="px-4 py-2.5 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 focus:bg-amber-50 dark:focus:bg-amber-900/20 cursor-pointer text-slate-700 dark:text-slate-200 transition-colors duration-150 data-[state=checked]:bg-amber-100 dark:data-[state=checked]:bg-amber-900/30 data-[state=checked]:text-amber-700 dark:data-[state=checked]:text-amber-400"
                    >
                      Large
                    </SelectItem>
                  </SelectContent>
                </Select>
                <div className="rounded-xl bg-amber-50/50 dark:bg-amber-900/10 border-2 border-amber-200/50 dark:border-amber-800/30 p-3">
                  <p className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
                    <Eye className="h-3 w-3 text-amber-500" />
                    Preview: 
                    <span className={fontSize === 'small' ? 'text-sm' : fontSize === 'large' ? 'text-lg' : 'text-base'}>
                      The quick brown fox jumps over the lazy dog
                    </span>
                  </p>
                </div>
              </div>

              {/* Compact Mode */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between rounded-xl border-2 border-slate-200 dark:border-slate-700 p-4 hover:bg-amber-50/30 dark:hover:bg-amber-900/10 transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                      <Monitor className="h-4 w-4 text-amber-500" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800 dark:text-white">Compact Mode</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Reduce spacing and padding</p>
                    </div>
                  </div>
                  <Switch checked={compactMode} onCheckedChange={setCompactMode} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Language Card */}
          <Card className="border-2 border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all duration-300 bg-white dark:bg-slate-900">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-900/20">
                  <Globe className="h-5 w-5 text-amber-500" />
                </div>
                <CardTitle className="text-slate-800 dark:text-white">Language & Region</CardTitle>
              </div>
              <CardDescription className="text-slate-500 dark:text-slate-400">Choose your preferred language</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-amber-500" />
                  <Label className="text-slate-700 dark:text-slate-300 font-medium cursor-pointer">Language</Label>
                </div>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-full h-11 px-4 py-2 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-amber-400 dark:hover:border-amber-600 focus:border-amber-500 dark:focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 dark:focus:ring-amber-500/20 transition-all duration-200 text-slate-700 dark:text-slate-200">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-xl rounded-xl overflow-hidden p-1">
                    <SelectItem 
                      value="en" 
                      className="px-4 py-2.5 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 focus:bg-amber-50 dark:focus:bg-amber-900/20 cursor-pointer text-slate-700 dark:text-slate-200 transition-colors duration-150 data-[state=checked]:bg-amber-100 dark:data-[state=checked]:bg-amber-900/30 data-[state=checked]:text-amber-700 dark:data-[state=checked]:text-amber-400"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🇬🇧</span>
                        English
                      </div>
                    </SelectItem>
                    <SelectItem 
                      value="am" 
                      className="px-4 py-2.5 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 focus:bg-amber-50 dark:focus:bg-amber-900/20 cursor-pointer text-slate-700 dark:text-slate-200 transition-colors duration-150 data-[state=checked]:bg-amber-100 dark:data-[state=checked]:bg-amber-900/30 data-[state=checked]:text-amber-700 dark:data-[state=checked]:text-amber-400"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🇪🇹</span>
                        አማርኛ (Amharic)
                      </div>
                    </SelectItem>
                    <SelectItem 
                      value="om" 
                      className="px-4 py-2.5 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 focus:bg-amber-50 dark:focus:bg-amber-900/20 cursor-pointer text-slate-700 dark:text-slate-200 transition-colors duration-150 data-[state=checked]:bg-amber-100 dark:data-[state=checked]:bg-amber-900/30 data-[state=checked]:text-amber-700 dark:data-[state=checked]:text-amber-400"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🇪🇹</span>
                        Afaan Oromoo
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <div className="rounded-xl bg-amber-50/50 dark:bg-amber-900/10 border-2 border-amber-200/50 dark:border-amber-800/30 p-3">
                  <p className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1">
                    <Info className="h-3 w-3 text-amber-500" />
                    Language preferences will be applied on your next page reload. Not all content may be available in all languages.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications Card */}
          <Card className="border-2 border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all duration-300 lg:col-span-2 bg-white dark:bg-slate-900">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-900/20">
                  <Bell className="h-5 w-5 text-amber-500" />
                </div>
                <CardTitle className="text-slate-800 dark:text-white">Notifications</CardTitle>
              </div>
              <CardDescription className="text-slate-500 dark:text-slate-400">Control how you receive updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center justify-between rounded-xl border-2 border-slate-200 dark:border-slate-700 p-4 hover:bg-amber-50/30 dark:hover:bg-amber-900/10 transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                      <Bell className="h-4 w-4 text-amber-500" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800 dark:text-white">Push Notifications</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Assignments, reminders</p>
                    </div>
                  </div>
                  <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
                </div>

                <div className="flex items-center justify-between rounded-xl border-2 border-slate-200 dark:border-slate-700 p-4 hover:bg-amber-50/30 dark:hover:bg-amber-900/10 transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                      <Mail className="h-4 w-4 text-amber-500" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800 dark:text-white">Email Digest</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Weekly summary</p>
                    </div>
                  </div>
                  <Switch checked={emailDigest} onCheckedChange={setEmailDigest} />
                </div>

                <div className="flex items-center justify-between rounded-xl border-2 border-slate-200 dark:border-slate-700 p-4 hover:bg-amber-50/30 dark:hover:bg-amber-900/10 transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                      <Calendar className="h-4 w-4 text-amber-500" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800 dark:text-white">Dark Reminders</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Reduce late-night alerts</p>
                    </div>
                  </div>
                  <Switch checked={darkReminders} onCheckedChange={setDarkReminders} />
                </div>

                <div className="flex items-center justify-between rounded-xl border-2 border-slate-200 dark:border-slate-700 p-4 hover:bg-amber-50/30 dark:hover:bg-amber-900/10 transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                      <Volume2 className="h-4 w-4 text-amber-500" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800 dark:text-white">Sound Effects</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Notification sounds</p>
                    </div>
                  </div>
                  <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
                </div>

                <div className="flex items-center justify-between rounded-xl border-2 border-slate-200 dark:border-slate-700 p-4 hover:bg-amber-50/30 dark:hover:bg-amber-900/10 transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                      <Vibrate className="h-4 w-4 text-amber-500" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800 dark:text-white">Vibration</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Mobile device vibration</p>
                    </div>
                  </div>
                  <Switch checked={vibrationEnabled} onCheckedChange={setVibrationEnabled} />
                </div>

                <div className="flex items-center justify-between rounded-xl border-2 border-slate-200 dark:border-slate-700 p-4 hover:bg-amber-50/30 dark:hover:bg-amber-900/10 transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                      <Cloud className="h-4 w-4 text-amber-500" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800 dark:text-white">Auto Sync</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Sync across devices</p>
                    </div>
                  </div>
                  <Switch checked={autoSync} onCheckedChange={setAutoSync} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Data Card */}
          <Card className="border-2 border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all duration-300 lg:col-span-2 bg-white dark:bg-slate-900">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-900/20">
                  <Shield className="h-5 w-5 text-amber-500" />
                </div>
                <CardTitle className="text-slate-800 dark:text-white">Privacy & Data</CardTitle>
              </div>
              <CardDescription className="text-slate-500 dark:text-slate-400">Manage your data preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border-2 border-amber-200/50 dark:border-amber-800/30 bg-amber-50/50 dark:bg-amber-900/10 p-4">
                  <div className="flex items-start gap-3">
                    <Badge className="mt-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 px-3 py-1">Privacy</Badge>
                    <div>
                      <p className="font-medium text-slate-800 dark:text-white flex items-center gap-2">
                        <Lock className="h-4 w-4 text-amber-500" />
                        Data Collection
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                        We collect minimal data to improve your learning experience. Your personal information is always kept private and secure.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border-2 border-slate-200 dark:border-slate-700 p-4 hover:bg-amber-50/30 dark:hover:bg-amber-900/10 transition-all duration-200">
                  <div className="flex items-start gap-3">
                    <Badge className="mt-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 px-3 py-1">Account</Badge>
                    <div className="flex-1">
                      <p className="font-medium text-slate-800 dark:text-white flex items-center gap-2">
                        <User className="h-4 w-4 text-amber-500" />
                        Account Information
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                        For additional account settings and security options, please visit your{' '}
                        <button
                          onClick={() => navigateWithState('/student/profile')}
                          className="text-amber-600 dark:text-amber-400 hover:underline font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all"
                        >
                          Profile
                          <ChevronRight className="h-3 w-3" />
                        </button>
                        .
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border-2 border-amber-200/50 dark:border-amber-800/30 bg-amber-50/50 dark:bg-amber-900/10 p-4">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800 dark:text-white">Data Security</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                      Your data is encrypted and stored securely. We never share your personal information with third parties.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarLayout>
  );
}