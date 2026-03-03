import adminApi from '../adminApi';
import type {
  AdminRole,
  CreateRolePayload,
  UpdateRolePayload,
} from '@/types/admin/role.types';

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string | null;
  errorCode?: string | null;
  errors?: any;
  fieldErrors?: any;
  time?: string;
};

type RoleListPayload = {
  items: AdminRole[];
};

export const adminRolesApi = {
  list: async () => {
    const res = await adminApi.get<ApiResponse<RoleListPayload>>('/admin/roles');
    return res.data.data.items;
  },

  detail: async (id: number) => {
    const res = await adminApi.get<ApiResponse<AdminRole>>(`/admin/roles/${id}`);
    return res.data.data;
  },

  create: async (payload: CreateRolePayload) => {
    const res = await adminApi.post<ApiResponse<AdminRole>>('/admin/roles', payload);
    return res.data.data;
  },

  update: async (id: number, payload: UpdateRolePayload) => {
    const res = await adminApi.put<ApiResponse<AdminRole>>(`/admin/roles/${id}`, payload);
    return res.data.data;
  },

  remove: async (id: number) => {
    const res = await adminApi.delete<ApiResponse<boolean>>(`/admin/roles/${id}`);
    return res.data.data;
  },
};