import React, { useEffect, useMemo, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import { RolesTable, RolesToolbar, RoleUpsertModal } from './components';
import { adminRolesApi } from '@/api/admin/roles.api';
import type { AdminRole, CreateRolePayload, UpdateRolePayload } from '@/types/admin/role.types';

const RoleManagement: React.FC = () => {
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<AdminRole | null>(null);
  const [open, setOpen] = useState(false);

  const loadRoles = async () => {
    try {
      setLoading(true);
      const data = await adminRolesApi.list();
      setRoles(data);
    } catch (e) {
      console.error(e);
      toast.error('Không tải được danh sách vai trò');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const filteredRoles = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return roles;
    return roles.filter((r) => r.name.toLowerCase().includes(term));
  }, [roles, searchTerm]);

  const handleOpenCreate = () => {
    setSelectedRole(null);
    setOpen(true);
  };

  const handleOpenEdit = (role: AdminRole) => {
    setSelectedRole(role);
    setOpen(true);
  };

  const handleCreate = async (payload: CreateRolePayload) => {
    try {
      await adminRolesApi.create(payload);
      toast.success('Đã thêm vai trò');
      setOpen(false);
      setSelectedRole(null);
      await loadRoles();
    } catch (e) {
      console.error(e);
      toast.error('Tạo vai trò thất bại');
    }
  };

  const handleUpdate = async (id: number, payload: UpdateRolePayload) => {
    try {
      await adminRolesApi.update(id, payload);
      toast.success('Đã cập nhật vai trò');
      setOpen(false);
      setSelectedRole(null);
      await loadRoles();
    } catch (e) {
      console.error(e);
      toast.error('Cập nhật vai trò thất bại');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await adminRolesApi.remove(id);
      toast.success('Đã xóa vai trò');
      await loadRoles();
    } catch (e) {
      console.error(e);
      toast.error('Xóa vai trò thất bại');
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Quản lý Vai trò"
        subtitle="Quản lý các vai trò hệ thống"
        action={{ label: 'Thêm vai trò', icon: Plus, onClick: handleOpenCreate }}
      />

      <RolesToolbar
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        onRefresh={loadRoles}
        loading={loading}
      />

      <RolesTable
        roles={filteredRoles}
        loading={loading}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      <RoleUpsertModal
        open={open}
        onOpenChange={setOpen}
        selectedRole={selectedRole}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
      />
    </div>
  );
};

export default RoleManagement;
