import adminApi from '../adminApi';
import type { AdminUser, CreateUserPayload, UpdateUserPayload } from '@/types/admin/user.types';

export const adminUsersApi = {
  list: async () => (await adminApi.get<AdminUser[]>('/admin/users')).data,
  detail: async (id: number) => (await adminApi.get<AdminUser>(`/admin/users/${id}`)).data,
  create: async (payload: CreateUserPayload) =>
    (await adminApi.post<AdminUser>('/admin/users', payload)).data,
  update: async (id: number, payload: UpdateUserPayload) =>
    (await adminApi.put(`/admin/users/${id}`, payload)).data,
  remove: async (id: number) =>
    (await adminApi.delete(`/admin/users/${id}`)).data,
};
