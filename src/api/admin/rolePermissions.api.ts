import adminApi from "../adminApi";

export interface RolePermissionPayload {
  roleId: number;
  permissionId: number;
}

export const adminRolePermissionsApi = {
  listByRole: async (roleId: number) =>
    (await adminApi.get<number[]>(`/api/admin/role-permissions/${roleId}`)).data,

  assign: async (payload: RolePermissionPayload) =>
    (await adminApi.post("/api/admin/role-permissions", payload)).data,

  remove: async (roleId: number, permissionId: number) =>
    (await adminApi.delete("/api/admin/role-permissions", {
      params: { roleId, permissionId },
    })).data,
};
