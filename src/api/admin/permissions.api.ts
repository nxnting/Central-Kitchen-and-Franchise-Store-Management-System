import adminApi from "../adminApi";
import type {
  AdminPermission,
  CreatePermissionPayload,
  UpdatePermissionPayload,
} from "@/types/admin/permission.types";

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string | null;
  errorCode?: string | null;
  errors?: any;
  fieldErrors?: any;
  time?: string;
};

type PermissionListPayload = {
  items: AdminPermission[];
};

export const adminPermissionsApi = {
  list: async () => {
    const res = await adminApi.get<ApiResponse<PermissionListPayload>>(
      "/admin/permissions",
    );
    return res.data.data.items; // ✅ unwrap
  },

  detail: async (id: number) => {
    const res = await adminApi.get<ApiResponse<AdminPermission>>(
      `/admin/permissions/${id}`,
    );
    return res.data.data;
  },

  create: async (payload: CreatePermissionPayload) => {
    const res = await adminApi.post<ApiResponse<AdminPermission>>(
      "/admin/permissions",
      payload,
    );
    return res.data.data;
  },

  update: async (id: number, payload: UpdatePermissionPayload) => {
    const res = await adminApi.put<ApiResponse<AdminPermission>>(
      `/admin/permissions/${id}`,
      payload,
    );
    return res.data.data;
  },

  remove: async (id: number) => {
    const res = await adminApi.delete<ApiResponse<boolean>>(
      `/admin/permissions/${id}`,
    );
    return res.data.data;
  },
};