import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockUsers, UserAccount } from '@/data/mockData';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  UserCheck,
  UserX,
  Shield,
  Mail,
  Phone
} from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleLabel = (role: string) => {
    const roles: Record<string, string> = {
      franchise_store: 'Nhân viên cửa hàng',
      central_kitchen: 'Nhân viên bếp',
      supply_coordinator: 'Điều phối cung ứng',
      manager: 'Quản lý vận hành',
      admin: 'Quản trị viên',
    };
    return roles[role] || role;
  };

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      franchise_store: 'bg-info/10 text-info',
      central_kitchen: 'bg-warning/10 text-warning',
      supply_coordinator: 'bg-primary/10 text-primary',
      manager: 'bg-success/10 text-success',
      admin: 'bg-destructive/10 text-destructive',
    };
    return colors[role] || 'bg-muted text-muted-foreground';
  };

  const handleToggleStatus = (id: string) => {
    setUsers(prev => prev.map(u => 
      u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
    ));
    toast.success('Đã cập nhật trạng thái người dùng');
  };

  const handleDelete = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    toast.success('Đã xóa người dùng');
  };

  const handleSave = () => {
    toast.success(selectedUser ? 'Đã cập nhật người dùng' : 'Đã thêm người dùng mới');
    setIsDialogOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Quản lý Người dùng" 
        subtitle="Quản lý tài khoản và quyền truy cập hệ thống"
        action={
          <Button onClick={() => { setSelectedUser(null); setIsDialogOpen(true); }}>
            <Plus size={16} className="mr-2" />
            Thêm người dùng
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-card border rounded-xl p-4">
          <p className="text-2xl font-bold">{users.length}</p>
          <p className="text-sm text-muted-foreground">Tổng người dùng</p>
        </div>
        <div className="bg-card border rounded-xl p-4">
          <p className="text-2xl font-bold text-success">{users.filter(u => u.status === 'active').length}</p>
          <p className="text-sm text-muted-foreground">Đang hoạt động</p>
        </div>
        <div className="bg-card border rounded-xl p-4">
          <p className="text-2xl font-bold text-muted-foreground">{users.filter(u => u.status === 'inactive').length}</p>
          <p className="text-sm text-muted-foreground">Đã khóa</p>
        </div>
        <div className="bg-card border rounded-xl p-4">
          <p className="text-2xl font-bold text-primary">{users.filter(u => u.role === 'admin').length}</p>
          <p className="text-sm text-muted-foreground">Quản trị viên</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Tìm kiếm người dùng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/30">
              <th className="text-left p-4 font-medium">Người dùng</th>
              <th className="text-left p-4 font-medium">Vai trò</th>
              <th className="text-left p-4 font-medium">Liên hệ</th>
              <th className="text-left p-4 font-medium">Đơn vị</th>
              <th className="text-center p-4 font-medium">Trạng thái</th>
              <th className="text-center p-4 font-medium">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id} className="border-b last:border-0 hover:bg-muted/20">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-semibold">
                        {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">@{user.username}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                    <Shield size={12} />
                    {getRoleLabel(user.role)}
                  </span>
                </td>
                <td className="p-4">
                  <div className="text-sm">
                    <p className="flex items-center gap-1">
                      <Mail size={12} className="text-muted-foreground" />
                      {user.email}
                    </p>
                    {user.phone && (
                      <p className="flex items-center gap-1 text-muted-foreground">
                        <Phone size={12} />
                        {user.phone}
                      </p>
                    )}
                  </div>
                </td>
                <td className="p-4 text-sm text-muted-foreground">{user.location || '-'}</td>
                <td className="p-4 text-center">
                  {user.status === 'active' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                      <UserCheck size={12} />
                      Hoạt động
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                      <UserX size={12} />
                      Đã khóa
                    </span>
                  )}
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => { setSelectedUser(user); setIsDialogOpen(true); }}>
                      <Edit size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleToggleStatus(user.id)}
                    >
                      {user.status === 'active' ? <UserX size={16} /> : <UserCheck size={16} />}
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(user.id)}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Họ và tên</Label>
              <Input defaultValue={selectedUser?.name || ''} placeholder="Nguyễn Văn A" />
            </div>
            <div>
              <Label>Tên đăng nhập</Label>
              <Input defaultValue={selectedUser?.username || ''} placeholder="nguyenvana" />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" defaultValue={selectedUser?.email || ''} placeholder="email@example.com" />
            </div>
            <div>
              <Label>Số điện thoại</Label>
              <Input defaultValue={selectedUser?.phone || ''} placeholder="0901234567" />
            </div>
            <div>
              <Label>Vai trò</Label>
              <Select defaultValue={selectedUser?.role || 'franchise_store'}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="franchise_store">Nhân viên cửa hàng</SelectItem>
                  <SelectItem value="central_kitchen">Nhân viên bếp</SelectItem>
                  <SelectItem value="supply_coordinator">Điều phối cung ứng</SelectItem>
                  <SelectItem value="manager">Quản lý vận hành</SelectItem>
                  <SelectItem value="admin">Quản trị viên</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Đơn vị làm việc</Label>
              <Input defaultValue={selectedUser?.location || ''} placeholder="Cửa hàng Q1" />
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>
                Hủy
              </Button>
              <Button className="flex-1" onClick={handleSave}>
                {selectedUser ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
