// src/pages/admin/RbacManagement/components/permissions-master/PermissionsMasterPanel.tsx
import React, { useMemo, useState } from "react";
import { toast } from "sonner";

import type { AdminPermission } from "@/types/admin/permission.types";
import type { CreatePermissionPayload, UpdatePermissionPayload } from "@/types/admin/permission.types";

import PermissionsToolbar from "./PermissionsToolbar";
import PermissionsTable from "./PermissionsTable";
import PermissionUpsertModal from "./PermissionUpsertModal";

import { usePermissionMaster } from "../shared/usePermissionMaster";
import { filterPermissionsByKeyword } from "../shared/permissionFilter";

const PermissionsMasterPanel: React.FC = () => {
  const {
    permissions,
    loading,
    reload,
    createPermission,
    updatePermission,
    deletePermission,
  } = usePermissionMaster();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPermission, setSelectedPermission] = useState<AdminPermission | null>(null);
  const [open, setOpen] = useState(false);

  const filteredPermissions = useMemo(
    () => filterPermissionsByKeyword(permissions, searchTerm),
    [permissions, searchTerm],
  );

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
      await createPermission(payload);
      toast.success("Đã thêm quyền");
      setOpen(false);
      setSelectedPermission(null);
    } catch {
      toast.error("Tạo quyền thất bại");
    }
  };

  const handleUpdate = async (id: number, payload: UpdatePermissionPayload) => {
    try {
      await updatePermission(id, payload);
      toast.success("Đã cập nhật quyền");
      setOpen(false);
      setSelectedPermission(null);
    } catch {
      toast.error("Cập nhật quyền thất bại");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePermission(id);
      toast.success("Đã xóa quyền");
    } catch {
      toast.error("Xóa quyền thất bại");
    }
  };

  return (
    <div>
      <div className="mb-3">
        <div className="text-xl font-semibold">Quản lý Quyền</div>
        <div className="text-sm text-muted-foreground">
          Quản lý danh sách permission của hệ thống
        </div>
      </div>

      <PermissionsToolbar
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        onRefresh={reload}
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

export default PermissionsMasterPanel;