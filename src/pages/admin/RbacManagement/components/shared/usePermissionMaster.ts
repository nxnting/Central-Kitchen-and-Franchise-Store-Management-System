// src/pages/admin/RbacManagement/components/shared/usePermissionMaster.ts
import { useCallback, useEffect, useState } from "react";

import type {
  AdminPermission,
  CreatePermissionPayload,
  UpdatePermissionPayload,
} from "@/types/admin/permission.types";

import { adminPermissionsApi } from "@/api/admin/permissions.api";

export const usePermissionMaster = () => {
  const [permissions, setPermissions] = useState<AdminPermission[]>([]);
  const [loading, setLoading] = useState(false);

  const reload = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminPermissionsApi.list();
      setPermissions(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const createPermission = useCallback(async (payload: CreatePermissionPayload) => {
    const created = await adminPermissionsApi.create(payload);
    // reload để đồng bộ (an toàn)
    await reload();
    return created;
  }, [reload]);

  const updatePermission = useCallback(async (id: number, payload: UpdatePermissionPayload) => {
    const updated = await adminPermissionsApi.update(id, payload);
    await reload();
    return updated;
  }, [reload]);

  const deletePermission = useCallback(async (id: number) => {
    const ok = await adminPermissionsApi.remove(id);
    await reload();
    return ok;
  }, [reload]);

  return {
    permissions,
    loading,
    reload,
    createPermission,
    updatePermission,
    deletePermission,
  };
};