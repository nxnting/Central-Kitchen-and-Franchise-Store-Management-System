// src/pages/admin/RbacManagement/components/role-permissions/PermissionGroupList.tsx
import React from "react";
import type { AdminPermission } from "@/types/admin/permission.types";
import PermissionGroupSection from "./PermissionGroupSection";

type Props = {
  grouped: Array<[string, AdminPermission[]]>;
  localSet: Set<number>;
  onToggle: (id: number, checked: boolean) => void;
};

const PermissionGroupList: React.FC<Props> = ({ grouped, localSet, onToggle }) => {
  return (
    <div className="max-h-[520px] overflow-auto">
      {grouped.map(([groupName, items]) => (
        <PermissionGroupSection
          key={groupName}
          groupName={groupName}
          items={items}
          localSet={localSet}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
};

export default PermissionGroupList;