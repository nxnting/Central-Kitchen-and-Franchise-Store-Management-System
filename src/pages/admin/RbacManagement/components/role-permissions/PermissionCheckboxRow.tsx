// src/pages/admin/RbacManagement/components/role-permissions/PermissionCheckboxRow.tsx
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import type { AdminPermission } from "@/types/admin/permission.types";

type Props = {
  permission: AdminPermission;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

const PermissionCheckboxRow: React.FC<Props> = ({ permission, checked, onChange }) => {
  return (
    <label className="flex items-start gap-3 px-2 py-2 rounded-lg hover:bg-muted/20 cursor-pointer">
      <Checkbox checked={checked} onCheckedChange={(v) => onChange(!!v)} />
      <div className="flex-1">
        <div className="text-sm font-medium">
          {permission.code}
          {permission.name ? (
            <span className="text-muted-foreground font-normal"> — {permission.name}</span>
          ) : null}
        </div>
        <div className="text-xs text-muted-foreground">{permission.description}</div>
      </div>
    </label>
  );
};

export default PermissionCheckboxRow;