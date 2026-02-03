import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import type { AdminPermission } from "@/types/admin/permission.types";

import { adminRolePermissionsApi } from "@/api/admin/rolePermissions.api";
import { adminPermissionsApi } from "@/api/admin/permissions.api";

type Options = {
  roleId?: number | null;
  enabled?: boolean; // khi mở modal mới load
};

export const useRolePermissions = ({ roleId, enabled = true }: Options) => {
  const [loading, setLoading] = useState(false);

  const [permissions, setPermissions] = useState<AdminPermission[]>([]);
  const [assignedIds, setAssignedIds] = useState<number[]>([]);

  const assignedSet = useMemo(() => new Set(assignedIds), [assignedIds]);

  const load = useCallback(async () => {
    if (!enabled) return;
    if (!roleId) return;

    try {
      setLoading(true);

      const [allPermissions, rolePermissionIds] = await Promise.all([
        adminPermissionsApi.list(),
        adminRolePermissionsApi.listByRole(roleId),
      ]);

      setPermissions(allPermissions);
      setAssignedIds(rolePermissionIds ?? []);
    } catch (e) {
      console.error(e);
      toast.error("Không tải được danh sách quyền");
    } finally {
      setLoading(false);
    }
  }, [enabled, roleId]);

  useEffect(() => {
    load();
  }, [load]);

  const assign = useCallback(
    async (permissionId: number) => {
      if (!roleId) return;
      try {
        await adminRolePermissionsApi.assign({ roleId, permissionId });
        setAssignedIds((prev) =>
          prev.includes(permissionId) ? prev : [...prev, permissionId],
        );
      } catch (e) {
        console.error(e);
        toast.error("Gán quyền thất bại");
      }
    },
    [roleId],
  );

  const remove = useCallback(
    async (permissionId: number) => {
      if (!roleId) return;
      try {
        await adminRolePermissionsApi.remove(roleId, permissionId);
        setAssignedIds((prev) => prev.filter((id) => id !== permissionId));
      } catch (e) {
        console.error(e);
        toast.error("Gỡ quyền thất bại");
      }
    },
    [roleId],
  );

  /**
   * Update theo diff: user tick/untick xong bấm "Lưu"
   */
  const save = useCallback(
    async (nextIds: number[]) => {
      if (!roleId) return;

      const nextSet = new Set(nextIds);
      const toAdd = nextIds.filter((id) => !assignedSet.has(id));
      const toRemove = assignedIds.filter((id) => !nextSet.has(id));

      if (toAdd.length === 0 && toRemove.length === 0) return;

      try {
        setLoading(true);

        // chạy song song cho nhanh
        await Promise.all([
          ...toAdd.map((permissionId) =>
            adminRolePermissionsApi.assign({ roleId, permissionId }),
          ),
          ...toRemove.map((permissionId) =>
            adminRolePermissionsApi.remove(roleId, permissionId),
          ),
        ]);

        setAssignedIds(nextIds);
        toast.success("Đã cập nhật quyền cho vai trò");
      } catch (e) {
        console.error(e);
        toast.error("Cập nhật quyền thất bại");
      } finally {
        setLoading(false);
      }
    },
    [roleId, assignedIds, assignedSet],
  );

  return {
    loading,
    permissions,
    assignedIds,
    assignedSet,
    reload: load,
    assign,
    remove,
    save,
  };
};

export default useRolePermissions;
