// src/pages/admin/RbacManagement/index.tsx
import React, { useMemo, useState } from "react";

import RbacHeader from "./components/layout/RbacHeader";
import RbacShell from "./components/layout/RbacShell";
import RoleSummaryBar from "./components/layout/RoleSummaryBar";

import RolesPanel from "./components/roles/RolesPanel";
import RolePermissionsPanel from "./components/role-permissions/RolePermissionsPanel";
import PermissionsMasterPanel from "./components/permissions-master/PermissionsMasterPanel";

import { useRbacRoles } from "./components/shared/useRbacRoles";
import { filterRolesByKeyword } from "./components/shared/roleFilter";

export type TabKey = "rolePermissions" | "permissionsMaster";

const RbacManagement: React.FC = () => {
  const [tab, setTab] = useState<TabKey>("rolePermissions");

  const {
    roles,
    loadingRoles,
    searchRole,
    setSearchRole,
    selectedRole,
    setSelectedRole,
    reloadRoles,
  } = useRbacRoles();

  const filteredRoles = useMemo(
    () => filterRolesByKeyword(roles, searchRole),
    [roles, searchRole],
  );

  return (
    <div className="animate-fade-in">
      <RbacHeader />

      <RbacShell
        left={
          <RolesPanel
            roles={filteredRoles}
            loading={loadingRoles}
            searchTerm={searchRole}
            onSearchTermChange={setSearchRole}
            selectedRoleId={(selectedRole as any)?.roleId ?? null}
            onSelectRole={(role) => {
              setSelectedRole(role);
              setTab("rolePermissions");
            }}
            onRefresh={reloadRoles}
          />
        }
        right={
          <div className="bg-card border rounded-xl overflow-hidden">
            <RoleSummaryBar
              role={selectedRole}
              tab={tab}
              onChangeTab={setTab}
            />

            <div className="p-4">
              {tab === "rolePermissions" ? (
                <RolePermissionsPanel role={selectedRole} />
              ) : (
                <PermissionsMasterPanel />
              )}
            </div>
          </div>
        }
      />
    </div>
  );
};

export default RbacManagement;