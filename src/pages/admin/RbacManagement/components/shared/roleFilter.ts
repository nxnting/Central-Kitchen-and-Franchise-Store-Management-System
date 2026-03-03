// src/pages/admin/RbacManagement/components/shared/roleFilter.ts
import type { AdminRole } from "@/types/admin/role.types";

export const filterRolesByKeyword = (roles: AdminRole[], keyword: string) => {
  const term = keyword.trim().toLowerCase();
  if (!term) return roles;

  return roles.filter((r) => (r.name ?? "").toLowerCase().includes(term));
};