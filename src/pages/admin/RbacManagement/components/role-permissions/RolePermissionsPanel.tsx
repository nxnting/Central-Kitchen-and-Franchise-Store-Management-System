// src/pages/admin/RbacManagement/components/role-permissions/RolePermissionsPanel.tsx
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { AdminRole } from "@/types/admin/role.types";

import useRolePermissions from "@/hooks/admin/useRolePermissions";
import { filterPermissionsByKeyword } from "../shared/permissionFilter";
import { groupPermissions } from "../shared/permissionGrouping";

import RolePermissionSearch from "./RolePermissionSearch";
import PermissionGroupList from "./PermissionGroupList";

type Props = {
  role: AdminRole | null;
};

const RolePermissionsPanel: React.FC<Props> = ({ role }) => {
  const roleId = (role as any)?.roleId ?? (role as any)?.id ?? null;

  const { loading, permissions, assignedIds, save } = useRolePermissions({
    roleId,
    enabled: !!roleId,
  });

  const [keyword, setKeyword] = useState("");
  const [localIds, setLocalIds] = useState<number[]>(assignedIds);

  useEffect(() => {
    setLocalIds(assignedIds);
  }, [assignedIds]);

  const filtered = useMemo(
    () => filterPermissionsByKeyword(permissions, keyword),
    [permissions, keyword],
  );

  const grouped = useMemo(() => groupPermissions(filtered), [filtered]);

  const localSet = useMemo(() => new Set(localIds), [localIds]);

  const toggle = (id: number, checked: boolean) => {
    setLocalIds((prev) => {
      const set = new Set(prev);
      if (checked) set.add(id);
      else set.delete(id);
      return Array.from(set);
    });
  };

  const canSave =
    !!roleId &&
    (localIds.length !== assignedIds.length ||
      localIds.some((id) => !assignedIds.includes(id)));

  if (!roleId) {
    return (
      <div className="text-sm text-muted-foreground">
        Chọn một vai trò ở bên trái để xem/gán quyền.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <RolePermissionSearch
        value={keyword}
        onChange={setKeyword}
        loading={loading}
        canSave={canSave}
        onSave={async () => {
          if (!canSave) {
            toast.message("Không có thay đổi để lưu");
            return;
          }
          await save(localIds);
        }}
      />

      <div className="border rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-4 text-sm text-muted-foreground">Đang tải...</div>
        ) : permissions.length === 0 ? (
          <div className="p-4 text-sm text-muted-foreground">
            Chưa có quyền nào trong hệ thống.
          </div>
        ) : (
          <PermissionGroupList
            grouped={grouped}
            localSet={localSet}
            onToggle={toggle}
          />
        )}
      </div>
    </div>
  );
};

export default RolePermissionsPanel;