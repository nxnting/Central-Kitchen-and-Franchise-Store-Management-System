import adminApi from '../adminApi';
import type {
  AdminPermission,
  CreatePermissionPayload,
  UpdatePermissionPayload,
} from '@/types/admin/permission.types';

export const adminPermissionsApi = {
  list: async () => (await adminApi.get<AdminPermission[]>('/admin/permissions')).data,

  detail: async (id: number) =>
    (await adminApi.get<AdminPermission>(`/admin/permissions/${id}`)).data,

  create: async (payload: CreatePermissionPayload) =>
    (await adminApi.post<AdminPermission>('/admin/permissions', payload)).data,

  update: async (id: number, payload: UpdatePermissionPayload) =>
    (await adminApi.put<AdminPermission>(`/admin/permissions/${id}`, payload)).data,

  remove: async (id: number) =>
    (await adminApi.delete<void>(`/admin/permissions/${id}`)).data,
};
