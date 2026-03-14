import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { adminUserFranchisesApi } from "@/api/admin/userFranchises.api";
import { adminFranchisesApi } from "@/api/admin/franchises.api";
import type { AdminUser } from "@/types/admin/user.types";
import type {
  AdminFranchise,
  FranchiseType,
  WorkAssignmentType,
} from "@/types/admin/franchise.types";

const mapFranchiseTypeToAssignmentType = (
  type: FranchiseType,
): WorkAssignmentType => {
  return type === "CENTRAL_KITCHEN" ? "CENTRAL_KITCHEN" : "FRANCHISE";
};

const mapAssignmentToSelectedFranchiseId = (
  data: {
    assignmentType: WorkAssignmentType;
    franchiseId: number | null;
    centralKitchenId: number | null;
  } | null | undefined,
): number | null => {
  if (!data) return null;
  if (data.assignmentType === "CENTRAL_KITCHEN") return data.centralKitchenId;
  return data.franchiseId;
};

const roleAllowedTypes = (roleName?: string): FranchiseType[] => {
  const r = (roleName || "").toLowerCase();

  if (r === "admin" || r === "manager") return [];
  if (r === "storestaff") return ["STORE"];
  if (r === "kitchenstaff") return ["CENTRAL_KITCHEN"];
  if (r === "supplycoordinator") return ["CENTRAL_KITCHEN"];

  return [];
};

export const useUserFranchises = (user: AdminUser | null, open: boolean) => {
  const queryClient = useQueryClient();
  const userId = user?.userId;
  const normalizedRole = (user?.roleName || "").toLowerCase();
  const isGlobalRole =
    normalizedRole === "admin" || normalizedRole === "manager";

  const [selectedFranchiseId, setSelectedFranchiseId] = useState<number | null>(
    null,
  );
  const [initialFranchiseId, setInitialFranchiseId] = useState<number | null>(
    null,
  );

  const allowedTypes = useMemo(
    () => roleAllowedTypes(user?.roleName),
    [user?.roleName],
  );

  const franchisesQuery = useQuery({
    queryKey: ["admin-franchises"],
    queryFn: () => adminFranchisesApi.list(),
    enabled: open,
  });

  const assignedQuery = useQuery({
    queryKey: ["admin-user-work-assignment", userId],
    queryFn: async () => {
      if (!userId) return null;
      return await adminUserFranchisesApi.getByUser(userId);
    },
    enabled: open && !!userId,
    retry: false,
  });

  useEffect(() => {
    if (!open) return;

    if (assignedQuery.isSuccess) {
      const selectedId = mapAssignmentToSelectedFranchiseId(assignedQuery.data);
      setInitialFranchiseId(selectedId);
      setSelectedFranchiseId(selectedId);
      return;
    }

    if (assignedQuery.isError) {
      setInitialFranchiseId(null);
      setSelectedFranchiseId(null);
    }
  }, [
    open,
    assignedQuery.isSuccess,
    assignedQuery.isError,
    assignedQuery.data,
  ]);

  const filteredFranchises = useMemo(() => {
    const list = (franchisesQuery.data || []) as AdminFranchise[];
    if (allowedTypes.length === 0) return [];
    return list.filter((f) => allowedTypes.includes(f.type));
  }, [franchisesQuery.data, allowedTypes]);

  const getFranchiseId = (f: AdminFranchise) => f.franchiseId;

  const isAllowedFranchise = (f: AdminFranchise) => {
    if (allowedTypes.length === 0) return false;
    return allowedTypes.includes(f.type);
  };

  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error("Missing userId");

      if (isGlobalRole) {
        throw new Error("Role này không cần gán cửa hàng / bếp");
      }

      if (!selectedFranchiseId) {
        throw new Error("Vui lòng chọn nơi làm việc hợp lệ");
      }

      const allFranchises = (franchisesQuery.data || []) as AdminFranchise[];
      const picked = allFranchises.find(
        (f) => f.franchiseId === selectedFranchiseId,
      );

      if (!picked) {
        throw new Error("Không tìm thấy nơi làm việc đã chọn");
      }

      if (!isAllowedFranchise(picked)) {
        throw new Error(
          "Bạn đã chọn nơi làm việc không hợp lệ với vai trò của user",
        );
      }

      if (initialFranchiseId && initialFranchiseId !== selectedFranchiseId) {
        await adminUserFranchisesApi.remove(userId);
      }

      const assignmentType = mapFranchiseTypeToAssignmentType(picked.type);

      await adminUserFranchisesApi.assign({
        userId,
        assignmentType,
        franchiseId: assignmentType === "FRANCHISE" ? picked.franchiseId : null,
        centralKitchenId:
          assignmentType === "CENTRAL_KITCHEN" ? picked.franchiseId : null,
      });

      return { selectedFranchiseId };
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["admin-user-work-assignment", userId],
      });
      await queryClient.invalidateQueries({
        queryKey: ["admin-franchises"],
      });
    },
  });

  const removeMutation = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error("Missing userId");
      await adminUserFranchisesApi.remove(userId);
    },
    onSuccess: async () => {
      setInitialFranchiseId(null);
      setSelectedFranchiseId(null);

      await queryClient.invalidateQueries({
        queryKey: ["admin-user-work-assignment", userId],
      });
    },
  });

  const loading = franchisesQuery.isLoading || assignedQuery.isLoading;
  const submitting = submitMutation.isPending;
  const removing = removeMutation.isPending;

  return {
    franchises: (franchisesQuery.data || []) as AdminFranchise[],
    filteredFranchises,

    selectedFranchiseId,
    setSelectedFranchiseId,
    initialFranchiseId,

    allowedTypes,
    getFranchiseId,
    isAllowedFranchise,

    loading,
    submitting,
    removing,

    refetch: async () => {
      await Promise.all([franchisesQuery.refetch(), assignedQuery.refetch()]);
    },

    submit: async () => submitMutation.mutateAsync(),
    removeAssignment: async () => removeMutation.mutateAsync(),

    currentAssignment: assignedQuery.data ?? null,

    error: (franchisesQuery.error ||
      assignedQuery.error ||
      submitMutation.error ||
      removeMutation.error) as unknown,
  };
};

export default useUserFranchises;