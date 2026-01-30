import React, { useEffect, useMemo, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import { UsersToolbar, UsersTable, UserUpsertModal } from './components';

import { adminUsersApi } from '@/api/admin/users.api';
import type { AdminUser, CreateUserPayload, UpdateUserPayload } from '@/types/admin/user.types';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await adminUsersApi.list();
      setUsers(data);
    } catch (e) {
      console.error(e);
      toast.error('Không tải được danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return users;

    return users.filter((u) =>
      u.username.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      u.roleName.toLowerCase().includes(term)
    );
  }, [users, searchTerm]);

  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.status === 'ACTIVE').length;
    const inactive = users.filter((u) => u.status === 'INACTIVE').length;
    const admins = users.filter((u) => u.roleName?.toLowerCase() === 'admin').length;
    return { total, active, inactive, admins };
  }, [users]);

  const handleOpenCreate = () => {
    setSelectedUser(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (user: AdminUser) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const handleCreate = async (payload: CreateUserPayload) => {
    try {
      await adminUsersApi.create(payload);
      toast.success('Đã thêm người dùng mới');
      setIsDialogOpen(false);
      setSelectedUser(null);
      await loadUsers();
    } catch (e) {
      console.error(e);
      toast.error('Tạo người dùng thất bại');
    }
  };

  const handleUpdate = async (id: number, payload: UpdateUserPayload) => {
    try {
      await adminUsersApi.update(id, payload);
      toast.success('Đã cập nhật người dùng');
      setIsDialogOpen(false);
      setSelectedUser(null);
      await loadUsers();
    } catch (e) {
      console.error(e);
      toast.error('Cập nhật thất bại');
    }
  };

  const handleToggleStatus = async (user: AdminUser) => {
    const nextStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

    // Swagger PUT chỉ nhận roleId + status
    await handleUpdate(user.userId, {
      roleId: user.roleId,
      status: nextStatus,
    });
  };

  const handleDelete = async (id: number) => {
    try {
      await adminUsersApi.remove(id);
      toast.success('Đã xóa người dùng');
      await loadUsers();
    } catch (e) {
      console.error(e);
      toast.error('Xóa thất bại');
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Quản lý Người dùng"
        subtitle="Quản lý tài khoản và quyền truy cập hệ thống"
        action={{
          label: 'Thêm người dùng',
          icon: Plus,
          onClick: handleOpenCreate,
        }}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-card border rounded-xl p-4">
          <p className="text-2xl font-bold">{stats.total}</p>
          <p className="text-sm text-muted-foreground">Tổng người dùng</p>
        </div>
        <div className="bg-card border rounded-xl p-4">
          <p className="text-2xl font-bold text-success">{stats.active}</p>
          <p className="text-sm text-muted-foreground">Đang hoạt động</p>
        </div>
        <div className="bg-card border rounded-xl p-4">
          <p className="text-2xl font-bold text-muted-foreground">{stats.inactive}</p>
          <p className="text-sm text-muted-foreground">Đã khóa</p>
        </div>
        <div className="bg-card border rounded-xl p-4">
          <p className="text-2xl font-bold text-primary">{stats.admins}</p>
          <p className="text-sm text-muted-foreground">Quản trị viên</p>
        </div>
      </div>

      {/* Toolbar */}
      <UsersToolbar
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        onRefresh={loadUsers}
        loading={loading}
      />

      {/* Table */}
      <UsersTable
        users={filteredUsers}
        loading={loading}
        onEdit={handleOpenEdit}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDelete}
      />

      {/* Modal */}
      <UserUpsertModal
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedUser={selectedUser}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
      />
    </div>
  );
};

export default UserManagement;
