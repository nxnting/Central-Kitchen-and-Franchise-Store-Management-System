export interface AdminRole {
  roleId: number;
  name: string;
}

export interface CreateRolePayload {
  name: string;
}

export interface UpdateRolePayload {
  name: string;
}
