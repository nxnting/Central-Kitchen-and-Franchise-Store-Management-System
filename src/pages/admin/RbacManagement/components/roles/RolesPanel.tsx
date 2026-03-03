// src/pages/admin/RbacManagement/components/roles/RolesPanel.tsx
import React from "react";
import type { AdminRole } from "@/types/admin/role.types";
import RolesSearchBar from "./RolesSearchBar";
import RolesList from "./RolesList";

type Props = {
  roles: AdminRole[];
  loading?: boolean;
  searchTerm: string;
  onSearchTermChange: (v: string) => void;
  selectedRoleId: number | null;
  onSelectRole: (role: AdminRole) => void;
  onRefresh: () => void | Promise<void>;
};

const RolesPanel: React.FC<Props> = ({
  roles,
  loading,
  searchTerm,
  onSearchTermChange,
  selectedRoleId,
  onSelectRole,
  onRefresh,
}) => {
  return (
    <div className="space-y-3">
      <RolesSearchBar
        value={searchTerm}
        onChange={onSearchTermChange}
        onRefresh={onRefresh}
        loading={loading}
      />

      <RolesList
        roles={roles}
        loading={loading}
        selectedRoleId={selectedRoleId}
        onSelectRole={onSelectRole}
      />
    </div>
  );
};

export default RolesPanel;