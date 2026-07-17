import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { SidebarLayout } from '../components/SidebarLayout';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Users, 
  FileText, 
  Calendar, 
  Church,
  TrendingUp,
  BarChart3,
  Heart,
  MessageCircle,
  UserPlus
} from 'lucide-react';
import ChurchManagement from './ChurchManagement';
import Courses from './Courses';
import Promotions from './Promotions';
import Podcasts from './Podcasts';
import Messages from './Messages';

// UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';

// Types
interface Member {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  membership_date: string;
  status: 'active' | 'inactive';
}

interface MemberFormData {
  full_name: string;
  email: string;
  phone: string;
  address: string;
  membership_date: string;
  status: 'active' | 'inactive';
}

interface Activity {
  member: string;
  action: string;
  ministry: string;
  time: string;
}

interface Ministry {
  name: string;
  members: number;
  progress: number;
}

interface AttendanceData {
  day: string;
  value: number;
}

// Modal Component Props
interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, onClose, children }) => (
  <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
      <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-700">
        <h3 className="font-bold text-xl text-slate-800 dark:text-white">{title}</h3>
        <button 
          onClick={onClose} 
          className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-2xl transition-colors"
        >
          ✕
        </button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  </div>
);

// Pastor Overview Component
const Overview: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [memberCount, setMemberCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => { 
    api.get('/pastor/members')
      .then((r: any) => setMemberCount(r.data.data?.length || 0))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Pastor stats
  const pastorStats = {
    totalMembers: 156,
    todayAttendance: 87,
    activeMinistries: 4,
    prayerRequests: 12,
  };

  // Recent activities
  const recentActivities: Activity[] = [
    { member: 'Abebe Kebede', action: 'joined', ministry: 'Youth Ministry', time: '2 hours ago' },
    { member: 'Tigist Alemayehu', action: 'attended', ministry: 'Sunday Service', time: '5 hours ago' },
    { member: 'Dawit Tesfaye', action: 'submitted prayer request', ministry: 'Prayer Ministry', time: '1 day ago' },
    { member: 'Meron Hailu', action: 'volunteered for', ministry: 'Children\'s Ministry', time: '2 days ago' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, Pastor {user?.full_name || 'Demo'}! 🙌
        </h1>
        <p className="text-muted-foreground">
          Manage your congregation and ministry activities
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Total Members</CardDescription>
              <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900/20">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pastorStats.totalMembers}</div>
            <p className="text-xs text-muted-foreground mt-1">Active congregation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Today's Attendance</CardDescription>
              <div className="p-2 bg-purple-100 rounded-lg dark:bg-purple-900/20">
                <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pastorStats.todayAttendance}</div>
            <p className="text-xs text-muted-foreground mt-1">Checked in today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Active Ministries</CardDescription>
              <div className="p-2 bg-orange-100 rounded-lg dark:bg-orange-900/20">
                <Church className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pastorStats.activeMinistries}</div>
            <p className="text-xs text-muted-foreground mt-1">Current programs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Prayer Requests</CardDescription>
              <div className="p-2 bg-green-100 rounded-lg dark:bg-green-900/20">
                <Heart className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pastorStats.prayerRequests}</div>
            <p className="text-xs text-muted-foreground mt-1">Needing prayer</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used ministry tools</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="justify-start h-auto py-3"
              onClick={() => navigate('/pastor/members')}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
            <Button 
              variant="outline" 
              className="justify-start h-auto py-3"
              onClick={() => navigate('/pastor/attendance')}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Take Attendance
            </Button>
            <Button 
              variant="outline" 
              className="justify-start h-auto py-3"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Send Message
            </Button>
            <Button 
              variant="outline" 
              className="justify-start h-auto py-3"
            >
              <Heart className="h-4 w-4 mr-2" />
              Prayer Requests
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest member interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-3 py-2 border-b border-border last:border-0"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs">
                      {activity.member.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {activity.member} <span className="font-normal text-muted-foreground">{activity.action}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.ministry}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ministry Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Ministry Overview</CardTitle>
          <CardDescription>Active ministries and their engagement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Youth Ministry', members: 45, progress: 75 },
              { name: 'Women\'s Ministry', members: 52, progress: 90 },
              { name: 'Men\'s Ministry', members: 38, progress: 65 },
              { name: 'Children\'s Ministry', members: 21, progress: 50 },
            ].map((ministry: Ministry) => (
              <div key={ministry.name} className="p-4 bg-muted rounded-lg">
                <p className="font-medium text-sm">{ministry.name}</p>
                <p className="text-2xl font-bold mt-1">{ministry.members}</p>
                <p className="text-xs text-muted-foreground">members</p>
                <Progress value={ministry.progress} className="mt-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Members Management Component
const Members: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [form, setForm] = useState<MemberFormData>({ 
    full_name: '', 
    email: '', 
    phone: '', 
    address: '', 
    membership_date: '', 
    status: 'active' 
  });

  const load = (): void => { 
    setLoading(true); 
    api.get('/pastor/members')
      .then((r: any) => setMembers(r.data.data || []))
      .catch(() => setMembers([]))
      .finally(() => setLoading(false)); 
  };
  
  useEffect(() => { load(); }, []);

  const save = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    await api.post('/pastor/members', form);
    setShowModal(false); 
    setForm({ full_name: '', email: '', phone: '', address: '', membership_date: '', status: 'active' }); 
    load();
  };

  const del = async (id: number): Promise<void> => { 
    if (!confirm('Remove this member?')) return; 
    await api.delete(`/pastor/members/${id}`).catch(() => {}); 
    load(); 
  };

  const filtered = members.filter((m: Member) => 
    m.full_name?.toLowerCase().includes(search.toLowerCase()) || 
    m.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Church Members</h1>
          <p className="text-muted-foreground">Manage your congregation</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Member
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input 
            className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" 
            placeholder="Search members..." 
            value={search} 
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)} 
          />
        </div>
        <Badge variant="secondary" className="h-10 px-4 flex items-center">
          {filtered.length} members
        </Badge>
      </div>

      {loading ? (
        <div className="card text-center py-12">
          <p className="text-muted-foreground">Loading members...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-12">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            {search ? 'No members found matching your search.' : 'No members yet. Add your first member.'}
          </p>
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground hidden md:table-cell">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground hidden lg:table-cell">Phone</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((m: Member) => (
                    <tr key={m.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3 font-medium">{m.full_name}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">{m.email || '—'}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground hidden lg:table-cell">{m.phone || '—'}</td>
                      <td className="px-4 py-3">
                        <Badge variant={m.status === 'active' ? 'default' : 'secondary'}>
                          {m.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                          onClick={() => del(m.id)}
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {showModal && (
        <Modal title="Add Member" onClose={() => setShowModal(false)}>
          <form onSubmit={save} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Full Name</label>
              <input 
                className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 mt-1" 
                value={form.full_name} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, full_name: e.target.value })} 
                required 
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">Email</label>
                <input 
                  type="email" 
                  className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 mt-1" 
                  value={form.email} 
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, email: e.target.value })} 
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Phone</label>
                <input 
                  className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 mt-1" 
                  value={form.phone} 
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, phone: e.target.value })} 
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Address</label>
              <input 
                className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 mt-1" 
                value={form.address} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, address: e.target.value })} 
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">Membership Date</label>
                <input 
                  type="date" 
                  className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 mt-1" 
                  value={form.membership_date} 
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, membership_date: e.target.value })} 
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Status</label>
                <select 
                  className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 mt-1" 
                  value={form.status} 
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setForm({ ...form, status: e.target.value as 'active' | 'inactive' })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button type="submit">Add Member</Button>
              <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

// Attendance Component
const Attendance: React.FC = () => {
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    api.get('/pastor/attendance')
      .then((r: any) => setAttendance(r.data.data || []))
      .catch(() => setAttendance([]))
      .finally(() => setLoading(false));
  }, []);

  const weeklyData: AttendanceData[] = [
    { day: 'Mon', value: 45 },
    { day: 'Tue', value: 52 },
    { day: 'Wed', value: 38 },
    { day: 'Thu', value: 61 },
    { day: 'Fri', value: 48 },
    { day: 'Sat', value: 73 },
    { day: 'Sun', value: 87 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Attendance</h1>
        <p className="text-muted-foreground">Track service attendance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Today</CardDescription>
            <CardTitle className="text-3xl">87</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">+12 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>This Week</CardDescription>
            <CardTitle className="text-3xl">342</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Average 68 per service</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Growth Rate</CardDescription>
            <CardTitle className="text-3xl">+8%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Month over month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Attendance</CardTitle>
          <CardDescription>Service attendance over the past 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end gap-2">
            {weeklyData.map((item: AttendanceData) => (
              <div key={item.day} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full bg-primary/20 rounded-t-lg transition-all hover:bg-primary/30"
                  style={{ height: `${(item.value / 100) * 100}%`, minHeight: '20px' }}
                >
                  <div 
                    className="w-full bg-primary rounded-t-lg transition-all"
                    style={{ height: `${(item.value / 100) * 100}%`, minHeight: '20px' }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{item.day}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Reports Component
const Reports: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reports</h1>
        <p className="text-muted-foreground">Ministry analytics and insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Member Growth</CardTitle>
            <CardDescription>Last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+24%</div>
            <Progress value={24} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Service Attendance</CardTitle>
            <CardDescription>Average per service</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68</div>
            <p className="text-xs text-muted-foreground mt-1">Up 5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">New Members</CardTitle>
            <CardDescription>This month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">3 more than last month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detailed Reports</CardTitle>
          <CardDescription>Export and view detailed ministry reports</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            <FileText className="h-4 w-4 mr-2" />
            Member Report (PDF)
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <BarChart3 className="h-4 w-4 mr-2" />
            Attendance Report (Excel)
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <TrendingUp className="h-4 w-4 mr-2" />
            Growth Analytics (CSV)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

const PastorNotifications: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-bold">Notifications</h1>
      <p className="text-muted-foreground">Stay informed about new member activity, service updates, and prayer alerts.</p>
    </div>
    <div className="grid gap-4">
      {[
        { title: 'Service update', description: 'Sunday worship time changed to 10:00 AM.', time: '10 min ago' },
        { title: 'Prayer request', description: 'New prayer request submitted for the youth ministry.', time: '1 hr ago' },
        { title: 'Member check-in', description: '23 members checked in for today’s small group.', time: 'Yesterday' },
      ].map((item) => (
        <Card key={item.title} className="border">
          <CardContent>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-semibold">{item.title}</h2>
                <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
              </div>
              <span className="text-xs text-muted-foreground">{item.time}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

const PastorProfile: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-bold">Profile</h1>
      <p className="text-muted-foreground">Manage your pastor profile, contact details, and ministry role.</p>
    </div>
    <Card>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="font-medium">Pastor User</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">pastor@church.com</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Role</p>
            <p className="font-medium">Pastor</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Location</p>
            <p className="font-medium">Kebena Church</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

const PastorSettings: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-bold">Settings</h1>
      <p className="text-muted-foreground">Configure notifications, calendar reminders, and service preferences.</p>
    </div>
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Control how you receive alerts.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Email updates</span>
              <Badge variant="outline">On</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Service reminders</span>
              <Badge variant="outline">On</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Profile preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Two-factor auth</span>
              <Badge variant="secondary">Off</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Weekly digest</span>
              <Badge variant="outline">On</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

// Main Pastor Dashboard Component
const PastorDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <SidebarLayout
      userRole="pastor"
      userName={user?.full_name || 'Pastor'}
      userEmail={user?.email || 'pastor@church.com'}
    >
      <Routes>
        <Route index element={<Overview />} />
        <Route path="users" element={<Members />} />
        <Route path="content" element={<ChurchManagement />} />
        <Route path="podcasts" element={<Podcasts />} />
        <Route path="promotions" element={<Promotions />} />
        <Route path="analytics" element={<Reports />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="messages" element={<Messages />} />
        <Route path="notifications" element={<PastorNotifications />} />
        <Route path="profile" element={<PastorProfile />} />
        <Route path="settings" element={<PastorSettings />} />
      </Routes>
    </SidebarLayout>
  );
};

export default PastorDashboard;