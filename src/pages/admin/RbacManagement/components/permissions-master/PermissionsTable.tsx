// src/pages/admin/RbacManagement/components/permissions-master/PermissionsTable.tsx
import React from "react";
import type { AdminPermission } from "@/types/admin/permission.types";
import PermissionRow from "./PermissionRow";

type Props = {
  permissions: AdminPermission[];
  loading?: boolean;
  onEdit: (p: AdminPermission) => void;
  onDelete: (id: number) => void | Promise<void>;
};

const PermissionsTable: React.FC<Props> = ({ permissions, loading, onEdit, onDelete }) => {
  return (
    <div className="bg-card border rounded-xl overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/30">
            <th className="text-left p-4 font-medium">Permission</th>
            <th className="text-left p-4 font-medium">Nhóm</th>
            <th className="text-left p-4 font-medium">Mô tả</th>
            <th className="text-center p-4 font-medium">Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={4} className="p-6 text-center text-sm text-muted-foreground">
                Đang tải dữ liệu...
              </td>
            </tr>
          ) : permissions.length === 0 ? (
            <tr>
              <td colSpan={4} className="p-6 text-center text-sm text-muted-foreground">
                Không có quyền phù hợp.
              </td>
            </tr>
          ) : (
            permissions.map((p) => (
              <PermissionRow key={p.permissionId} permission={p} onEdit={onEdit} onDelete={onDelete} />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PermissionsTable;