export interface AdminPermission {
  permissionId: number;
  code: string;
  name?: string; // swagger có field name
  groupName?: string;
  description: string;
}

export interface CreatePermissionPayload {
  code: string;
  name?: string;
  groupName?: string;
  description: string;
}

export interface UpdatePermissionPayload {
  // code: string;
  name?: string;
  groupName?: string;
  description: string;
}
