// src/pages/admin/RbacManagement/components/shared/useRbacRoles.ts
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import type { AdminRole } from "@/types/admin/role.types";
import { adminRolesApi } from "@/api/admin/roles.api";

export const useRbacRoles = () => {
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [searchRole, setSearchRole] = useState("");
  const [selectedRole, setSelectedRole] = useState<AdminRole | null>(null);

  const reloadRoles = useCallback(async () => {
    try {
      setLoadingRoles(true);
      const data = await adminRolesApi.list();
      setRoles(data);

      if (!selectedRole && data?.length) setSelectedRole(data[0]);
    } catch (e) {
      console.error(e);
      toast.error("Không tải được danh sách vai trò");
    } finally {
      setLoadingRoles(false);
    }
  }, [selectedRole]);

  useEffect(() => {
    reloadRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    roles,
    loadingRoles,
    searchRole,
    setSearchRole,
    selectedRole,
    setSelectedRole,
    reloadRoles,
  };
};