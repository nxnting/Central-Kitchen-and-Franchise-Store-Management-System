// src/pages/admin/RbacManagement/components/shared/permissionFilter.ts
import type { AdminPermission } from "@/types/admin/permission.types";

export const filterPermissionsByKeyword = (permissions: AdminPermission[], keyword: string) => {
  const term = keyword.trim().toLowerCase();
  if (!term) return permissions;

  return permissions.filter((p) => {
    const text = `${p.code} ${p.name ?? ""} ${p.groupName ?? ""} ${p.description ?? ""}`.toLowerCase();
    return text.includes(term);
  });
};