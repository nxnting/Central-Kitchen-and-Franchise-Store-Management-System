// src/pages/admin/RbacManagement/components/roles/RolesList.tsx
import React from "react";
import type { AdminRole } from "@/types/admin/role.types";
import PanelCard from "../layout/PanelCard";
import RoleListItem from "./RoleListItem";

type Props = {
  roles: AdminRole[];
  loading?: boolean;
  selectedRoleId: number | null;
  onSelectRole: (role: AdminRole) => void;
};

const RolesList: React.FC<Props> = ({ roles, loading, selectedRoleId, onSelectRole }) => {
  return (
    <PanelCard className="overflow-hidden">
      <div className="px-4 py-3 border-b bg-muted/30">
        <div className="text-sm font-medium">Vai trò</div>
      </div>

      <div className="max-h-[520px] overflow-auto">
        {loading ? (
          <div className="p-4 text-sm text-muted-foreground">Đang tải...</div>
        ) : roles.length === 0 ? (
          <div className="p-4 text-sm text-muted-foreground">Không có vai trò phù hợp.</div>
        ) : (
          roles.map((r) => (
            <RoleListItem
              key={(r as any).roleId ?? (r as any).id}
              role={r}
              active={selectedRoleId === ((r as any).roleId ?? (r as any).id)}
              onClick={() => onSelectRole(r)}
            />
          ))
        )}
      </div>
    </PanelCard>
  );
};

export default RolesList;