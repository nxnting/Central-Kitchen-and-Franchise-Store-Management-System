import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { adminUserFranchisesApi } from '@/api/admin/userFranchises.api';
import { adminFranchisesApi } from '@/api/admin/franchises.api';
import type { AdminUser } from '@/types/admin/user.types';
import type { AdminFranchise, FranchiseType } from '@/types/admin/franchise.types';

const normalizeAssignedIds = (data: unknown): number[] => {
  if (!data) return [];
  if (Array.isArray(data)) {
    // case 1: number[]
    if (data.every((x) => typeof x === 'number')) return data as number[];

    // case 2: object[]
    const ids: number[] = [];
    for (const item of data as any[]) {
      const v =
        item?.franchiseId ??
        item?.franchise_id ??
        item?.franchise?.franchiseId ??
        item?.id;
      if (typeof v === 'number') ids.push(v);
    }
    return ids;
  }
  return [];
};

const roleAllowedTypes = (roleName?: string): FranchiseType[] => {
  const r = (roleName || '').toLowerCase();

  if (r === 'storestaff') return ['STORE'];
  if (r === 'kitchenstaff') return ['CENTRAL_KITCHEN'];
  if (r === 'manager') return ['STORE', 'CENTRAL_KITCHEN'];
  if (r === 'supplycoordinator') return ['STORE', 'CENTRAL_KITCHEN'];

  if (r === 'admin') return [];
  return ['STORE', 'CENTRAL_KITCHEN'];
};

const diffIds = (before: number[], after: number[]) => {
  const beforeSet = new Set(before);
  const afterSet = new Set(after);

  const toAdd: number[] = [];
  const toRemove: number[] = [];

  for (const id of afterSet) if (!beforeSet.has(id)) toAdd.push(id);
  for (const id of beforeSet) if (!afterSet.has(id)) toRemove.push(id);

  return { toAdd, toRemove };
};

export const useUserFranchises = (user: AdminUser | null, open: boolean) => {
  const queryClient = useQueryClient();
  const userId = user?.userId;

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [initialIds, setInitialIds] = useState<number[]>([]);

  const allowedTypes = useMemo(() => roleAllowedTypes(user?.roleName), [user?.roleName]);

  // 1) Fetch franchises list
  const franchisesQuery = useQuery({
    queryKey: ['admin-franchises'],
    queryFn: () => adminFranchisesApi.list(),
    enabled: open,
  });

  // 2) Fetch assigned by user
  const assignedQuery = useQuery({
    queryKey: ['admin-user-franchises', userId],
    queryFn: async () => {
      if (!userId) return [];
      const data = await adminUserFranchisesApi.listByUser(userId);
      return normalizeAssignedIds(data);
    },
    enabled: open && !!userId,
  });

  // 3) Sync selected when modal opens
  useEffect(() => {
    if (!open) return;
    if (!assignedQuery.isSuccess) return;

    const ids = assignedQuery.data || [];
    setInitialIds(ids);
    setSelectedIds(ids);
  }, [open, assignedQuery.isSuccess, assignedQuery.data]);

  // 4) filtered list for UI (optional)
  const filteredFranchises = useMemo(() => {
    const list = (franchisesQuery.data || []) as AdminFranchise[];
    if (allowedTypes.length === 0) return list; // admin -> vẫn show (UI disable)
    return list.filter((f) => allowedTypes.includes(f.type));
  }, [franchisesQuery.data, allowedTypes]);

  // helper
  const getFranchiseId = (f: AdminFranchise) => f.franchiseId;

  const isAllowedFranchise = (f: AdminFranchise) => {
    if (allowedTypes.length === 0) return false; // admin -> disable hết
    return allowedTypes.includes(f.type);
  };

  // 5) Submit diff
  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error('Missing userId');

      if ((user?.roleName || '').toLowerCase() === 'admin') {
        throw new Error('Admin không cần gán cửa hàng / bếp');
      }

      if (selectedIds.length === 0) {
        throw new Error('Vui lòng chọn ít nhất 1 cửa hàng hoặc bếp');
      }

      const allFranchises = (franchisesQuery.data || []) as AdminFranchise[];
      const picked = allFranchises.filter((f) => selectedIds.includes(f.franchiseId));

      if (allowedTypes.length > 0) {
        const invalid = picked.find((f) => !allowedTypes.includes(f.type));
        if (invalid) throw new Error('Bạn đã chọn franchise không hợp lệ với vai trò của user');
      }

      const { toAdd, toRemove } = diffIds(initialIds, selectedIds);

      const addPromises = toAdd.map((franchiseId) =>
        adminUserFranchisesApi.assign({ userId, franchiseId })
      );
      const removePromises = toRemove.map((franchiseId) =>
        adminUserFranchisesApi.remove(userId, franchiseId)
      );

      const results = await Promise.allSettled([...addPromises, ...removePromises]);
      const rejected = results.filter((r) => r.status === 'rejected') as PromiseRejectedResult[];

      if (rejected.length > 0) {
        throw new Error('Có lỗi khi cập nhật gán cửa hàng/bếp. Vui lòng thử lại.');
      }

      return { toAdd, toRemove };
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-user-franchises', userId] });
    },
  });

  const loading = franchisesQuery.isLoading || assignedQuery.isLoading;
  const submitting = submitMutation.isPending;

  return {
    franchises: (franchisesQuery.data || []) as AdminFranchise[],
    filteredFranchises,
    selectedIds,
    setSelectedIds,
    initialIds,

    allowedTypes,
    getFranchiseId,
    isAllowedFranchise,

    loading,
    submitting,

    refetch: async () => {
      await Promise.all([franchisesQuery.refetch(), assignedQuery.refetch()]);
    },
    submit: async () => submitMutation.mutateAsync(),

    error: (franchisesQuery.error || assignedQuery.error || submitMutation.error) as unknown,
  };
};

export default useUserFranchises;
