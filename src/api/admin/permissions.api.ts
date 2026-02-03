import adminApi from '../adminApi';
import type {
  AdminPermission,
  CreatePermissionPayload,
  UpdatePermissionPayload,
} from '@/types/admin/permission.types';

export const adminPermissionsApi = {
  list: async () => (await adminApi.get<AdminPermission[]>('/api/admin/permissions')).data,

  detail: async (id: number) =>
    (await adminApi.get<AdminPermission>(`/api/admin/permissions/${id}`)).data,

  create: async (payload: CreatePermissionPayload) =>
    (await adminApi.post<AdminPermission>('/api/admin/permissions', payload)).data,

  update: async (id: number, payload: UpdatePermissionPayload) =>
    (await adminApi.put(`/api/admin/permissions/${id}`, payload)).data,

  remove: async (id: number) =>
    (await adminApi.delete(`/api/admin/permissions/${id}`)).data,
};
