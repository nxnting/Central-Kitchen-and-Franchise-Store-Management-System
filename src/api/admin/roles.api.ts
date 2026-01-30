import adminApi from '../adminApi';
import type { AdminRole, CreateRolePayload, UpdateRolePayload } from '@/types/admin/role.types';

export const adminRolesApi = {
  list: async () => (await adminApi.get<AdminRole[]>('/admin/roles')).data,

  detail: async (id: number) =>
    (await adminApi.get<AdminRole>(`/admin/roles/${id}`)).data,

  create: async (payload: CreateRolePayload) =>
    (await adminApi.post<AdminRole>('/admin/roles', payload)).data,

  update: async (id: number, payload: UpdateRolePayload) =>
    (await adminApi.put(`/admin/roles/${id}`, payload)).data,

  remove: async (id: number) =>
    (await adminApi.delete(`/admin/roles/${id}`)).data,
};
