import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { SidebarLayout } from '../components/SidebarLayout';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { ArrowLeft, Users, Search, Shield, UserX, UserCheck, Edit } from 'lucide-react';

export default function UserManagement() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Get user info from navigation state, or use defaults
  const locationState = location.state as { role?: string; userName?: string; userEmail?: string; view?: 'student' | 'teacher' | 'pastor' | 'editor' | 'admin' } | null;
  const [user] = useState({
    full_name: locationState?.userName || 'Demo User',
    email: locationState?.userEmail || 'demo@church.com'
  });
  const [role] = useState(locationState?.role || 'admin');
  const [activeView, setActiveView] = useState<'student' | 'teacher' | 'pastor' | 'editor' | 'admin'>(
    locationState?.view ?? (locationState?.role === 'teacher' ? 'teacher' : locationState?.role === 'pastor' ? 'pastor' : locationState?.role === 'editor' ? 'editor' : locationState?.role === 'admin' ? 'admin' : 'student')
  );

  // Mock data
  const users = [
    {
      id: 1,
      full_name: 'Admin User',
      email: 'admin@church.com',
      role: 'admin',
      is_active: true,
      is_blocked: false,
      created_at: '2025-01-15',
      last_login: '2026-02-15',
    },
    {
      id: 2,
      full_name: 'Editor User',
      email: 'editor@church.com',
      role: 'editor',
      is_active: true,
      is_blocked: false,
      created_at: '2025-02-10',
      last_login: '2026-02-14',
    },
    {
      id: 3,
      full_name: 'Teacher User',
      email: 'teacher@church.com',
      role: 'teacher',
      is_active: true,
      is_blocked: false,
      created_at: '2025-02-20',
      last_login: '2026-02-13',
    },
    {
      id: 4,
      full_name: 'Pastor User',
      email: 'pastor@church.com',
      role: 'pastor',
      is_active: true,
      is_blocked: false,
      created_at: '2025-01-01',
      last_login: '2026-02-15',
    },
    {
      id: 5,
      full_name: 'Developer User',
      email: 'developer@church.com',
      role: 'developer',
      is_active: true,
      is_blocked: false,
      created_at: '2025-01-20',
      last_login: '2026-02-12',
    },
    {
      id: 6,
      full_name: 'Student User',
      email: 'student@church.com',
      role: 'student',
      is_active: true,
      is_blocked: false,
      created_at: '2025-03-05',
      last_login: '2026-02-15',
    },
    {
      id: 7,
      full_name: 'Abebe Kebede',
      email: 'abebe@example.com',
      role: 'student',
      is_active: true,
      is_blocked: false,
      created_at: '2025-11-12',
      last_login: '2026-02-14',
    },
    {
      id: 8,
      full_name: 'Tigist Alemayehu',
      email: 'tigist@example.com',
      role: 'student',
      is_active: true,
      is_blocked: false,
      created_at: '2025-12-01',
      last_login: '2026-02-10',
    },
    {
      id: 9,
      full_name: 'Dawit Tesfaye',
      email: 'dawit@example.com',
      role: 'student',
      is_active: false,
      is_blocked: true,
      created_at: '2025-10-15',
      last_login: '2026-01-20',
    },
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const roleStats = {
    admin: users.filter(u => u.role === 'admin').length,
    editor: users.filter(u => u.role === 'editor').length,
    teacher: users.filter(u => u.role === 'teacher').length,
    pastor: users.filter(u => u.role === 'pastor').length,
    developer: users.filter(u => u.role === 'developer').length,
    student: users.filter(u => u.role === 'student').length,
  };

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: 'bg-red-600',
      editor: 'bg-blue-600',
      teacher: 'bg-green-600',
      pastor: 'bg-purple-600',
      developer: 'bg-orange-600',
      student: 'bg-gray-600',
    };
    return colors[role] || 'bg-gray-600';
  };

  return (
    <SidebarLayout
      userRole={role}
      userName={user.full_name}
      userEmail={user.email}
      activeView={activeView}
      onViewChange={setActiveView}
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <Shield className="h-4 w-4 text-red-600" />
              Admin
            </CardDescription>
            <CardTitle className="text-2xl">{roleStats.admin}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <Shield className="h-4 w-4 text-blue-600" />
              Editor
            </CardDescription>
            <CardTitle className="text-2xl">{roleStats.editor}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <Shield className="h-4 w-4 text-green-600" />
              Teacher
            </CardDescription>
            <CardTitle className="text-2xl">{roleStats.teacher}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <Shield className="h-4 w-4 text-purple-600" />
              Pastor
            </CardDescription>
            <CardTitle className="text-2xl">{roleStats.pastor}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <Shield className="h-4 w-4 text-orange-600" />
              Developer
            </CardDescription>
            <CardTitle className="text-2xl">{roleStats.developer}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <Users className="h-4 w-4 text-gray-600" />
              Student
            </CardDescription>
            <CardTitle className="text-2xl">{roleStats.student}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by role" />
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
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users ({filteredUsers.length})</CardTitle>
          <CardDescription>
            Manage user accounts, roles, and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredUsers.map((user) => (
              <Card key={user.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold">{user.full_name}</h3>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-3">
                        <Badge className={getRoleBadgeColor(user.role)}>
                          {user.role.toUpperCase()}
                        </Badge>
                        {user.is_blocked ? (
                          <Badge variant="destructive">
                            <UserX className="h-3 w-3 mr-1" />
                            Blocked
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <UserCheck className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Joined</p>
                          <p className="font-medium">{user.created_at}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Last Login</p>
                          <p className="font-medium">{user.last_login}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Status</p>
                          <p className="font-medium">{user.is_active ? 'Active' : 'Inactive'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Role
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit User Role</DialogTitle>
                            <DialogDescription>
                              Change the role for {user.full_name}
                            </DialogDescription>
                          </DialogHeader>
                          <EditRoleForm user={user} />
                        </DialogContent>
                      </Dialog>

                      {user.is_blocked ? (
                        <Button variant="outline" size="sm" className="bg-green-50 hover:bg-green-100">
                          <UserCheck className="h-4 w-4 mr-2" />
                          Unblock
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" className="bg-red-50 hover:bg-red-100">
                          <UserX className="h-4 w-4 mr-2" />
                          Block
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-bold text-lg mb-2">No users found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </SidebarLayout>
  );
}

function EditRoleForm({ user }: { user: any }) {
  const [selectedRole, setSelectedRole] = useState(user.role);

  return (
    <form className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Current role: <span className="font-bold capitalize">{user.role}</span>
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Select New Role</label>
        <Select value={selectedRole} onValueChange={setSelectedRole}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin - Full system access</SelectItem>
            <SelectItem value="editor">Editor - Content management</SelectItem>
            <SelectItem value="teacher">Teacher - Course creation</SelectItem>
            <SelectItem value="pastor">Pastor - Spiritual oversight</SelectItem>
            <SelectItem value="developer">Developer - Technical access</SelectItem>
            <SelectItem value="student">Student - Course access</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-muted p-4 rounded-lg">
        <h4 className="font-medium mb-2">Role Permissions:</h4>
        <ul className="text-sm space-y-1 text-muted-foreground">
          {selectedRole === 'admin' && (
            <>
              <li>✓ Full system access</li>
              <li>✓ User management</li>
              <li>✓ All content features</li>
            </>
          )}
          {selectedRole === 'editor' && (
            <>
              <li>✓ Create and manage posts</li>
              <li>✓ Manage podcasts</li>
              <li>✓ Create promotions</li>
            </>
          )}
          {selectedRole === 'teacher' && (
            <>
              <li>✓ Create courses</li>
              <li>✓ Manage chapters and lessons</li>
              <li>✓ View student progress</li>
            </>
          )}
          {selectedRole === 'pastor' && (
            <>
              <li>✓ Content oversight</li>
              <li>✓ View all content</li>
              <li>✓ Spiritual leadership features</li>
            </>
          )}
          {selectedRole === 'developer' && (
            <>
              <li>✓ Technical system access</li>
              <li>✓ API access</li>
              <li>✓ System configuration</li>
            </>
          )}
          {selectedRole === 'student' && (
            <>
              <li>✓ Access courses</li>
              <li>✓ Track progress</li>
              <li>✓ View content</li>
            </>
          )}
        </ul>
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline">Cancel</Button>
        <Button type="submit">Update Role</Button>
      </div>
    </form>
  );
}