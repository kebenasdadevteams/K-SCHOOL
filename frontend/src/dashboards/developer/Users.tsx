import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router';
import api from '../../services/api';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { 
  ArrowLeft, Users, Search, Shield, UserX, UserCheck, Edit, Mail, 
  Clock, Calendar, MoreVertical, Filter, Plus, Download, Upload,
  Key, Lock, UserPlus, Trash2, RefreshCw, ChevronDown, CheckCircle,
  XCircle, AlertCircle, Activity, BarChart3, PieChart, Eye, EyeOff,
  Crown, Star, BookOpen, Award, Briefcase, GraduationCap
} from 'lucide-react';

// Types
interface User {
  id: number;
  full_name: string;
  email: string;
  role: string;
  is_blocked: boolean;
  is_active: boolean;
  created_at: string;
  last_login: string;
  avatar?: string;
  phone?: string;
  department?: string;
  bio?: string;
}

interface RoleStats {
  admin: number;
  editor: number;
  teacher: number;
  pastor: number;
  developer: number;
  student: number;
  total: number;
}

export default function UserManagement() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // New user form state
  const [newUser, setNewUser] = useState({
    full_name: '',
    email: '',
    role: 'student',
    password: '',
    confirm_password: ''
  });

  const locationState = location.state as { role?: string; userName?: string; userEmail?: string; view?: string } | null;
  const [user] = useState({
    full_name: locationState?.userName || 'Demo User',
    email: locationState?.userEmail || 'demo@church.com'
  });
  const [role] = useState(locationState?.role || 'admin');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/users');
      setUsers(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      // Fallback mock data
      setUsers([
        { id: 1, full_name: 'John Smith', email: 'john@church.com', role: 'admin', is_blocked: false, is_active: true, created_at: '2024-01-15', last_login: '2024-12-10', phone: '+1 (555) 123-4567', department: 'Leadership' },
        { id: 2, full_name: 'Mary Johnson', email: 'mary@church.com', role: 'teacher', is_blocked: false, is_active: true, created_at: '2024-02-20', last_login: '2024-12-09', phone: '+1 (555) 234-5678', department: 'Education' },
        { id: 3, full_name: 'Pastor David', email: 'david@church.com', role: 'pastor', is_blocked: false, is_active: true, created_at: '2023-11-01', last_login: '2024-12-08', phone: '+1 (555) 345-6789', department: 'Pastoral' },
        { id: 4, full_name: 'Lisa Anderson', email: 'lisa@church.com', role: 'editor', is_blocked: false, is_active: true, created_at: '2024-03-10', last_login: '2024-12-07', phone: '+1 (555) 456-7890', department: 'Media' },
        { id: 5, full_name: 'Mike Developer', email: 'mike@church.com', role: 'developer', is_blocked: false, is_active: true, created_at: '2024-04-05', last_login: '2024-12-06', phone: '+1 (555) 567-8901', department: 'Technology' },
        { id: 6, full_name: 'Student One', email: 'student1@church.com', role: 'student', is_blocked: false, is_active: true, created_at: '2024-05-12', last_login: '2024-12-05', phone: '+1 (555) 678-9012', department: 'Discipleship' },
        { id: 7, full_name: 'Blocked User', email: 'blocked@church.com', role: 'student', is_blocked: true, is_active: false, created_at: '2024-06-18', last_login: '2024-11-20', phone: '+1 (555) 789-0123', department: 'None' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const hasRole = (user: User, roleName: string) => {
    if (!user || !user.role) return false;
    if (Array.isArray(user.role)) {
      return user.role.includes(roleName);
    }
    return user.role === roleName;
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = (user.full_name?.toLowerCase() || '').includes(searchLower) ||
                           (user.email?.toLowerCase() || '').includes(searchLower) ||
                           (user.department?.toLowerCase() || '').includes(searchLower);
      const matchesRole = roleFilter === 'all' || hasRole(user, roleFilter);
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'active' && !user.is_blocked && user.is_active) ||
                           (statusFilter === 'blocked' && user.is_blocked) ||
                           (statusFilter === 'inactive' && !user.is_active && !user.is_blocked);
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  const roleStats: RoleStats = {
    admin: users.filter((u) => hasRole(u, 'admin')).length,
    editor: users.filter((u) => hasRole(u, 'editor')).length,
    teacher: users.filter((u) => hasRole(u, 'teacher')).length,
    pastor: users.filter((u) => hasRole(u, 'pastor')).length,
    developer: users.filter((u) => hasRole(u, 'developer')).length,
    student: users.filter((u) => hasRole(u, 'student')).length,
    total: users.length,
  };

  const handleChangePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }

    try {
      await api.put('/auth/change-password', {
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      setPasswordSuccess('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setIsPasswordDialogOpen(false), 1500);
    } catch (err: any) {
      setPasswordError(err.response?.data?.message || 'Failed to change password');
    }
  };

  const handleRoleChange = async (userId: number, newRole: string) => {
    try {
      await api.put(`/users/${userId}/roles`, { roles: [newRole] });
      setUsers((current) => current.map((user) => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      setIsRoleDialogOpen(false);
      setSelectedUser(null);
    } catch (err) {
      console.error('Failed to update role:', err);
    }
  };

  const handleAddUser = async (event: React.FormEvent) => {
    event.preventDefault();
    if (newUser.password !== newUser.confirm_password) {
      alert('Passwords do not match');
      return;
    }
    try {
      const response = await api.post('/users', {
        full_name: newUser.full_name,
        email: newUser.email,
        role: newUser.role,
        password: newUser.password,
      });
      setUsers([...users, response.data.data]);
      setIsAddUserDialogOpen(false);
      setNewUser({ full_name: '', email: '', role: 'student', password: '', confirm_password: '' });
    } catch (err) {
      console.error('Failed to add user:', err);
    }
  };

  const handleToggleBlock = async (userId: number) => {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) return;
      await api.put(`/users/${userId}/block`, { block: !user.is_blocked });
      setUsers((current) => current.map((u) => 
        u.id === userId ? { ...u, is_blocked: !u.is_blocked, is_active: u.is_active ? !u.is_blocked : u.is_active } : u
      ));
    } catch (err) {
      console.error('Failed to toggle block:', err);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    if (!role) return 'bg-gray-500';
    const colors: Record<string, string> = {
      admin: 'bg-[#865014]',
      editor: 'bg-[#E0AE3F]',
      teacher: 'bg-[#865014]',
      pastor: 'bg-[#E0AE3F]',
      developer: 'bg-[#865014]',
      student: 'bg-gray-500',
    };
    return colors[role] || 'bg-gray-500';
  };

  const getRoleIcon = (role: string) => {
    if (!role) return <Users className="h-3.5 w-3.5" />;
    const icons: Record<string, any> = {
      admin: <Crown className="h-3.5 w-3.5" />,
      editor: <Edit className="h-3.5 w-3.5" />,
      teacher: <BookOpen className="h-3.5 w-3.5" />,
      pastor: <Star className="h-3.5 w-3.5" />,
      developer: <Briefcase className="h-3.5 w-3.5" />,
      student: <GraduationCap className="h-3.5 w-3.5" />,
    };
    return icons[role] || <Users className="h-3.5 w-3.5" />;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    if (!dateString) return 'Never';
    try {
      const now = new Date();
      const date = new Date(dateString);
      const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
      
      if (diff < 60) return 'Just now';
      if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
      if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
      return formatDate(dateString);
    } catch {
      return dateString;
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const StatCard = ({ icon, label, value, color }: any) => (
    <Card className="border-[#E0AE3F]/10 hover:border-[#E0AE3F]/30 transition-all hover:shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardDescription className="flex items-center gap-1 text-xs font-medium text-[#865014]/60">
            {icon}
            {label}
          </CardDescription>
          <div className={`w-8 h-8 rounded-full bg-[#F6EBD8] flex items-center justify-center ${color}`}>
            <span className="text-[#865014] font-bold text-sm">{value}</span>
          </div>
        </div>
      </CardHeader>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a1a] flex items-center gap-2">
            <Users className="h-6 w-6 text-[#865014]" />
            User Management
          </h1>
          <p className="text-sm text-[#865014]/60 mt-1">
            Manage user accounts, roles, and permissions across the platform
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={fetchUsers}
            className="border-[#E0AE3F]/20 hover:bg-[#F6EBD8] text-[#865014]"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsPasswordDialogOpen(true)}
            className="border-[#E0AE3F]/20 hover:bg-[#F6EBD8] text-[#865014]"
          >
            <Key className="h-4 w-4 mr-2" />
            Change Password
          </Button>
          <Button 
            onClick={() => setIsAddUserDialogOpen(true)}
            className="bg-[#865014] hover:bg-[#865014]/90 text-white"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        <StatCard icon={<Crown className="h-3 w-3" />} label="Admin" value={roleStats.admin} />
        <StatCard icon={<Edit className="h-3 w-3" />} label="Editor" value={roleStats.editor} />
        <StatCard icon={<BookOpen className="h-3 w-3" />} label="Teacher" value={roleStats.teacher} />
        <StatCard icon={<Star className="h-3 w-3" />} label="Pastor" value={roleStats.pastor} />
        <StatCard icon={<Briefcase className="h-3 w-3" />} label="Developer" value={roleStats.developer} />
        <StatCard icon={<GraduationCap className="h-3 w-3" />} label="Student" value={roleStats.student} />
        <StatCard icon={<Users className="h-3 w-3" />} label="Total" value={roleStats.total} />
      </div>

      {/* Filters */}
      <Card className="border-[#E0AE3F]/10">
        <CardContent className="pt-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#865014]/40" />
              <Input
                placeholder="Search by name, email, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30 text-sm"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-40 border-[#E0AE3F]/20 focus:ring-[#865014]/30">
                <Filter className="h-4 w-4 mr-2 text-[#865014]/40" />
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="teacher">Teacher</SelectItem>
                <SelectItem value="pastor">Pastor</SelectItem>
                <SelectItem value="developer">Developer</SelectItem>
                <SelectItem value="student">Student</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40 border-[#E0AE3F]/20 focus:ring-[#865014]/30">
                <Activity className="h-4 w-4 mr-2 text-[#865014]/40" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card className="border-[#E0AE3F]/10">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-[#1a1a1a]">
                All Users
                <span className="text-sm font-normal text-[#865014]/60 ml-2">
                  ({filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'})
                </span>
              </CardTitle>
              <CardDescription className="text-xs text-[#865014]/50">
                Manage user accounts, roles, and permissions
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#865014]/40">
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-emerald-500" />
                Active
              </span>
              <span className="flex items-center gap-1">
                <XCircle className="h-3 w-3 text-red-500" />
                Blocked
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#865014] border-t-transparent"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="group relative rounded-xl border border-[#E0AE3F]/10 hover:border-[#E0AE3F]/30 transition-all hover:shadow-sm bg-white"
                >
                  <div className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      {/* Avatar & Name */}
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="relative flex-shrink-0">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#F6EBD8] to-[#E0AE3F]/20 flex items-center justify-center">
                            <span className="text-[#865014] font-semibold text-sm">
                              {getInitials(user.full_name)}
                            </span>
                          </div>
                          <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                            user.is_blocked ? 'bg-red-500' : user.is_active ? 'bg-emerald-500' : 'bg-gray-400'
                          }`} />
                        </div>
                        
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold text-[#1a1a1a] truncate">
                              {user.full_name || 'Unnamed User'}
                            </h3>
                            <Badge className={`${getRoleBadgeColor(user.role)} text-white text-xs px-2.5 py-0.5 flex items-center gap-1`}>
                              {getRoleIcon(user.role)}
                              <span>{user.role ? user.role.toUpperCase() : 'UNKNOWN'}</span>
                            </Badge>
                            {user.is_blocked ? (
                              <Badge variant="outline" className="border-red-200 text-red-600 bg-red-50 text-xs px-2.5 py-0.5 flex items-center gap-1">
                                <XCircle className="h-3 w-3" />
                                Blocked
                              </Badge>
                            ) : user.is_active ? (
                              <Badge variant="outline" className="border-emerald-200 text-emerald-600 bg-emerald-50 text-xs px-2.5 py-0.5 flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                Active
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="border-gray-200 text-gray-600 bg-gray-50 text-xs px-2.5 py-0.5 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                Inactive
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-[#865014]/60">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3.5 w-3.5" />
                              {user.email || 'No email'}
                            </span>
                            {user.department && (
                              <span className="flex items-center gap-1">
                                <Briefcase className="h-3.5 w-3.5" />
                                {user.department}
                              </span>
                            )}
                            {user.phone && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {user.phone}
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-[#865014]/40">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Joined {formatDate(user.created_at)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Last seen {formatTimeAgo(user.last_login)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center gap-2 ml-auto sm:ml-0">
                        <Dialog open={isRoleDialogOpen && selectedUser?.id === user.id} onOpenChange={(open) => {
                          setIsRoleDialogOpen(open);
                          if (!open) setSelectedUser(null);
                        }}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-[#E0AE3F]/20 hover:bg-[#F6EBD8] text-[#865014] h-8"
                              onClick={() => setSelectedUser(user)}
                            >
                              <Edit className="h-3.5 w-3.5 mr-1.5" />
                              Role
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="border-[#E0AE3F]/20 max-w-md">
                            <DialogHeader>
                              <DialogTitle className="text-[#1a1a1a]">Edit User Role</DialogTitle>
                              <DialogDescription className="text-[#865014]/60">
                                Change the role for <span className="font-medium text-[#1a1a1a]">{user.full_name}</span>
                              </DialogDescription>
                            </DialogHeader>
                            <EditRoleForm 
                              user={user} 
                              onRoleChange={(newRole) => handleRoleChange(user.id, newRole)}
                              onCancel={() => {
                                setIsRoleDialogOpen(false);
                                setSelectedUser(null);
                              }}
                            />
                          </DialogContent>
                        </Dialog>

                        <Button 
                          variant="outline" 
                          size="sm"
                          className={`h-8 ${user.is_blocked ? 'border-emerald-200 text-emerald-600 hover:bg-emerald-50' : 'border-red-200 text-red-600 hover:bg-red-50'}`}
                          onClick={() => handleToggleBlock(user.id)}
                        >
                          {user.is_blocked ? (
                            <><UserCheck className="h-3.5 w-3.5 mr-1.5" /> Unblock</>
                          ) : (
                            <><UserX className="h-3.5 w-3.5 mr-1.5" /> Block</>
                          )}
                        </Button>

                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => {
                            setSelectedUser(user);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 mx-auto text-[#865014]/20 mb-4" />
                  <h3 className="font-medium text-[#1a1a1a] mb-1">No users found</h3>
                  <p className="text-sm text-[#865014]/50">
                    Try adjusting your search or filters
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Change Password Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="border-[#E0AE3F]/20 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#1a1a1a] flex items-center gap-2">
              <Key className="h-5 w-5 text-[#865014]" />
              Change Password
            </DialogTitle>
            <DialogDescription className="text-[#865014]/60">
              Update your account password for security
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1a1a1a]">Current Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30 pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#865014]/40 hover:text-[#865014] transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1a1a1a]">New Password</label>
              <Input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30"
                minLength={8}
              />
              <p className="text-xs text-[#865014]/40">Must be at least 8 characters</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1a1a1a]">Confirm New Password</label>
              <Input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30"
              />
            </div>
            {passwordError && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {passwordError}
              </p>
            )}
            {passwordSuccess && (
              <p className="text-sm text-emerald-600 flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                {passwordSuccess}
              </p>
            )}
            <div className="flex gap-2 justify-end pt-2 border-t border-[#E0AE3F]/10">
              <Button type="button" variant="outline" onClick={() => setIsPasswordDialogOpen(false)} className="border-[#E0AE3F]/20 hover:bg-[#F6EBD8]">
                Cancel
              </Button>
              <Button type="submit" className="bg-[#865014] hover:bg-[#865014]/90 text-white">
                Update Password
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add User Dialog */}
      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent className="border-[#E0AE3F]/20 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#1a1a1a] flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-[#865014]" />
              Add New User
            </DialogTitle>
            <DialogDescription className="text-[#865014]/60">
              Create a new user account with specific role permissions
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddUser} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1a1a1a]">Full Name</label>
              <Input
                value={newUser.full_name}
                onChange={(e) => setNewUser({...newUser, full_name: e.target.value})}
                required
                className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30"
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1a1a1a]">Email</label>
              <Input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                required
                className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30"
                placeholder="john@church.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1a1a1a]">Role</label>
              <Select value={newUser.role} onValueChange={(value) => setNewUser({...newUser, role: value})}>
                <SelectTrigger className="border-[#E0AE3F]/20 focus:ring-[#865014]/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="pastor">Pastor</SelectItem>
                  <SelectItem value="developer">Developer</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1a1a1a]">Password</label>
              <Input
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                required
                className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30"
                minLength={8}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1a1a1a]">Confirm Password</label>
              <Input
                type="password"
                value={newUser.confirm_password}
                onChange={(e) => setNewUser({...newUser, confirm_password: e.target.value})}
                required
                className="border-[#E0AE3F]/20 focus-visible:ring-[#865014]/30"
              />
            </div>
            <div className="flex gap-2 justify-end pt-2 border-t border-[#E0AE3F]/10">
              <Button type="button" variant="outline" onClick={() => setIsAddUserDialogOpen(false)} className="border-[#E0AE3F]/20 hover:bg-[#F6EBD8]">
                Cancel
              </Button>
              <Button type="submit" className="bg-[#865014] hover:bg-[#865014]/90 text-white">
                <UserPlus className="h-4 w-4 mr-2" />
                Create User
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="border-[#E0AE3F]/20 max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-[#1a1a1a] flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              Delete User
            </DialogTitle>
            <DialogDescription className="text-[#865014]/60">
              Are you sure you want to delete <span className="font-medium text-[#1a1a1a]">{selectedUser?.full_name}</span>? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="border-[#E0AE3F]/20 hover:bg-[#F6EBD8]">
              Cancel
            </Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete User
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Edit Role Form Component
function EditRoleForm({ user, onRoleChange, onCancel }: { user: User; onRoleChange: (role: string) => void; onCancel: () => void }) {
  const [selectedRole, setSelectedRole] = useState(user.role || 'student');

  const roleOptions = [
    { 
      value: 'admin', 
      label: 'Administrator', 
      icon: <Crown className="h-4 w-4 text-[#865014]" />,
      description: 'Full system access with all permissions',
      permissions: ['Full system access', 'User management', 'All content features', 'System configuration', 'View analytics']
    },
    { 
      value: 'editor', 
      label: 'Editor', 
      icon: <Edit className="h-4 w-4 text-[#E0AE3F]" />,
      description: 'Content management and publishing',
      permissions: ['Create and manage posts', 'Manage podcasts', 'Create promotions', 'Content review']
    },
    { 
      value: 'teacher', 
      label: 'Teacher', 
      icon: <BookOpen className="h-4 w-4 text-[#865014]" />,
      description: 'Course creation and student management',
      permissions: ['Create courses', 'Manage chapters and lessons', 'View student progress', 'Grade assignments']
    },
    { 
      value: 'pastor', 
      label: 'Pastor', 
      icon: <Star className="h-4 w-4 text-[#E0AE3F]" />,
      description: 'Spiritual oversight and content approval',
      permissions: ['Content oversight', 'View all content', 'Spiritual leadership features', 'Approve content']
    },
    { 
      value: 'developer', 
      label: 'Developer', 
      icon: <Briefcase className="h-4 w-4 text-[#865014]" />,
      description: 'Technical access and system configuration',
      permissions: ['Technical system access', 'API access', 'System configuration', 'Debug tools']
    },
    { 
      value: 'student', 
      label: 'Student', 
      icon: <GraduationCap className="h-4 w-4 text-gray-500" />,
      description: 'Course access and learning',
      permissions: ['Access courses', 'Track progress', 'View content', 'Submit assignments']
    },
  ];

  const selectedRoleData = roleOptions.find(r => r.value === selectedRole) || roleOptions[5];

  return (
    <form onSubmit={(e) => { e.preventDefault(); onRoleChange(selectedRole); }} className="space-y-4">
      <div className="bg-[#F6EBD8]/20 p-3 rounded-xl border border-[#E0AE3F]/10">
        <p className="text-sm text-[#865014]/60">
          Current role: <span className="font-medium text-[#1a1a1a] capitalize">{user.role || 'None'}</span>
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[#1a1a1a]">Select New Role</label>
        <Select value={selectedRole} onValueChange={setSelectedRole}>
          <SelectTrigger className="border-[#E0AE3F]/20 focus:ring-[#865014]/30">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {roleOptions.map((option) => (
              <SelectItem key={option.value} value={option.value} className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  {option.icon}
                  <div>
                    <span className="font-medium">{option.label}</span>
                    <p className="text-xs text-[#865014]/50">{option.description}</p>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-[#F6EBD8]/30 p-4 rounded-xl border border-[#E0AE3F]/10">
        <h4 className="font-medium text-sm text-[#1a1a1a] mb-2 flex items-center gap-2">
          <Shield className="h-4 w-4 text-[#865014]" />
          Role Permissions
        </h4>
        <ul className="space-y-1.5">
          {selectedRoleData.permissions.map((perm, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-[#865014]/70">
              <CheckCircle className="h-3.5 w-3.5 text-[#865014]" />
              {perm}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-2 justify-end pt-2 border-t border-[#E0AE3F]/10">
        <Button type="button" variant="outline" onClick={onCancel} className="border-[#E0AE3F]/20 hover:bg-[#F6EBD8]">
          Cancel
        </Button>
        <Button type="submit" className="bg-[#865014] hover:bg-[#865014]/90 text-white">
          <Shield className="h-4 w-4 mr-2" />
          Update Role
        </Button>
      </div>
    </form>
  );
}