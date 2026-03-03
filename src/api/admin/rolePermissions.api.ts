import adminApi from "../adminApi";

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string | null;
  errorCode?: string | null;
};

export interface RolePermissionPayload {
  roleId: number;
  permissionId: number;
}

export const adminRolePermissionsApi = {
  listByRole: async (roleId: number) => {
    const res = await adminApi.get<ApiResponse<{ items: number[] }>>(
      `/admin/roles/${roleId}/permissions`,
    );
    return res.data.data.items;
  },

  // ✅ giữ payload như hook đang dùng
  assign: async (payload: RolePermissionPayload) => {
    const res = await adminApi.post<ApiResponse<boolean>>(
      `/admin/roles/${payload.roleId}/permissions`,
      { permissionId: payload.permissionId },
    );
    return res.data.data;
  },

  remove: async (roleId: number, permissionId: number) => {
    const res = await adminApi.delete<ApiResponse<boolean>>(
      `/admin/roles/${roleId}/permissions/${permissionId}`,
    );
    return res.data.data;
  },
};