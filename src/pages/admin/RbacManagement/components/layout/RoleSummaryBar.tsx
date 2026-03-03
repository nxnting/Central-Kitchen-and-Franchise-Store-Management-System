// src/pages/admin/RbacManagement/components/layout/RoleSummaryBar.tsx
import React from "react";
import type { AdminRole } from "@/types/admin/role.types";
import type { TabKey } from "../../index";
import RbacTabs from "./RbacTabs";

type Props = {
  role: AdminRole | null;
  tab: TabKey;
  onChangeTab: (tab: TabKey) => void;
};

const RoleSummaryBar: React.FC<Props> = ({ role, tab, onChangeTab }) => {
  const roleId = (role as any)?.roleId ?? (role as any)?.id ?? null;

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
      <div className="text-sm font-medium">
        {role ? (
          <>
            Vai trò:{" "}
            <span className="font-semibold text-primary">{role.name}</span>
            <span className="text-muted-foreground ml-2">(ID: {roleId})</span>
          </>
        ) : (
          <span className="text-muted-foreground">Chọn 1 vai trò để thao tác</span>
        )}
      </div>

      <RbacTabs tab={tab} onChange={onChangeTab} />
    </div>
  );
};

export default RoleSummaryBar;