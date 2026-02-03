import React, { useEffect, useMemo, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { toast } from 'sonner';

import { PermissionsTable, PermissionsToolbar, PermissionUpsertModal } from './components';

import { adminPermissionsApi } from '@/api/admin/permissions.api';
import type {
  AdminPermission,
  CreatePermissionPayload,
  UpdatePermissionPayload,
} from '@/types/admin/permission.types';

const PermissionManagement: React.FC = () => {
  const [permissions, setPermissions] = useState<AdminPermission[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPermission, setSelectedPermission] = useState<AdminPermission | null>(null);
  const [open, setOpen] = useState(false);

  const loadPermissions = async () => {
    try {
      setLoading(true);
      const data = await adminPermissionsApi.list();
      setPermissions(data);
    } catch (e) {
      console.error(e);
      toast.error('Không tải được danh sách quyền');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPermissions();
  }, []);

  const filteredPermissions = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return permissions;

    return permissions.filter((p) => {
      const code = (p.code ?? '').toLowerCase();
      const desc = (p.description ?? '').toLowerCase();
      const group = (p.groupName ?? '').toLowerCase();
      const name = (p.name ?? '').toLowerCase();
      return code.includes(term) || desc.includes(term) || group.includes(term) || name.includes(term);
    });
  }, [permissions, searchTerm]);

  const handleOpenCreate = () => {
    setSelectedPermission(null);
    setOpen(true);
  };

  const handleOpenEdit = (p: AdminPermission) => {
    setSelectedPermission(p);
    setOpen(true);
  };

  const handleCreate = async (payload: CreatePermissionPayload) => {
    try {
      await adminPermissionsApi.create(payload);
      toast.success('Đã thêm quyền');
      setOpen(false);
      setSelectedPermission(null);
      await loadPermissions();
    } catch (e) {
      console.error(e);
      toast.error('Tạo quyền thất bại');
    }
  };

  const handleUpdate = async (id: number, payload: UpdatePermissionPayload) => {
    try {
      await adminPermissionsApi.update(id, payload);
      toast.success('Đã cập nhật quyền');
      setOpen(false);
      setSelectedPermission(null);
      await loadPermissions();
    } catch (e) {
      console.error(e);
      toast.error('Cập nhật quyền thất bại');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await adminPermissionsApi.remove(id);
      toast.success('Đã xóa quyền');
      await loadPermissions();
    } catch (e) {
      console.error(e);
      toast.error('Xóa quyền thất bại');
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Quản lý Quyền"
        subtitle="Quản lý danh sách permission của hệ thống"
      />

      <PermissionsToolbar
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        onRefresh={loadPermissions}
        onCreate={handleOpenCreate}
        loading={loading}
      />

      <PermissionsTable
        permissions={filteredPermissions}
        loading={loading}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      <PermissionUpsertModal
        open={open}
        onOpenChange={setOpen}
        selectedPermission={selectedPermission}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
      />
    </div>
  );
};

export default PermissionManagement;
