// src/pages/admin/RbacManagement/components/roles/RoleListItem.tsx
import React from "react";
import { Shield } from "lucide-react";
import type { AdminRole } from "@/types/admin/role.types";

type Props = {
  role: AdminRole;
  active: boolean;
  onClick: () => void;
};

const RoleListItem: React.FC<Props> = ({ role, active, onClick }) => {
  const roleId = (role as any)?.roleId ?? (role as any)?.id;

  return (
    <button
      className={[
        "w-full text-left px-4 py-3 border-b last:border-0",
        "hover:bg-muted/20",
        active ? "bg-primary/5" : "",
      ].join(" ")}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
          <Shield size={14} />
          {role.name}
        </span>
        <span className="text-xs text-muted-foreground">ID: {roleId}</span>
      </div>
    </button>
  );
};

export default RoleListItem;