// src/pages/admin/RbacManagement/components/layout/RbacTabs.tsx
import React from "react";
import type { TabKey } from "../../index";

type Props = {
  tab: TabKey;
  onChange: (tab: TabKey) => void;
};

const RbacTabs: React.FC<Props> = ({ tab, onChange }) => {
  return (
    <div className="flex gap-2">
      <button
        className={[
          "px-3 py-1.5 rounded-lg text-sm border",
          tab === "rolePermissions"
            ? "bg-primary text-primary-foreground border-primary"
            : "bg-background hover:bg-muted/40",
        ].join(" ")}
        onClick={() => onChange("rolePermissions")}
      >
        Quyền của vai trò
      </button>

      <button
        className={[
          "px-3 py-1.5 rounded-lg text-sm border",
          tab === "permissionsMaster"
            ? "bg-primary text-primary-foreground border-primary"
            : "bg-background hover:bg-muted/40",
        ].join(" ")}
        onClick={() => onChange("permissionsMaster")}
      >
        Danh sách quyền
      </button>
    </div>
  );
};

export default RbacTabs;