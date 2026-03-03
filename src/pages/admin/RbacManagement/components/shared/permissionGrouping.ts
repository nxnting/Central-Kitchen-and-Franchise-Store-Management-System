// src/pages/admin/RbacManagement/components/shared/permissionGrouping.ts
import type { AdminPermission } from "@/types/admin/permission.types";

export const groupPermissions = (permissions: AdminPermission[]) => {
  const map = new Map<string, AdminPermission[]>();

  for (const p of permissions) {
    const key = (p.groupName || "Khác").trim() || "Khác";
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(p);
  }

  // sort permission theo code trong mỗi group
  for (const [k, arr] of map.entries()) {
    map.set(k, [...arr].sort((a, b) => (a.code || "").localeCompare(b.code || "")));
  }

  return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
};