// src/pages/admin/RbacManagement/components/role-permissions/PermissionGroupSection.tsx
import React from "react";
import type { AdminPermission } from "@/types/admin/permission.types";
import PermissionCheckboxRow from "./PermissionCheckboxRow";

type Props = {
  groupName: string;
  items: AdminPermission[];
  localSet: Set<number>;
  onToggle: (id: number, checked: boolean) => void;
};

const PermissionGroupSection: React.FC<Props> = ({ groupName, items, localSet, onToggle }) => {
  return (
    <div className="border-b last:border-0">
      <div className="px-4 py-2 bg-muted/30 text-sm font-medium">{groupName}</div>

      <div className="p-2">
        {items.map((p) => (
          <PermissionCheckboxRow
            key={p.permissionId}
            permission={p}
            checked={localSet.has(p.permissionId)}
            onChange={(v) => onToggle(p.permissionId, v)}
          />
        ))}
      </div>
    </div>
  );
};

export default PermissionGroupSection;