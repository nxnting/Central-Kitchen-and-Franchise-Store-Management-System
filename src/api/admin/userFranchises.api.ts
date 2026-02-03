import adminApi from '../adminApi';

export interface UserFranchisePayload {
  userId: number;
  franchiseId: number;
}

export const adminUserFranchisesApi = {
  listByUser: async (userId: number) =>
    (await adminApi.get<number[]>(`/admin/user-franchises/${userId}`)).data,

  assign: async (payload: UserFranchisePayload) =>
    (await adminApi.post('/admin/user-franchises', payload)).data,

  remove: async (userId: number, franchiseId: number) =>
    (await adminApi.delete('/admin/user-franchises', {
      params: { userId, franchiseId },
    })).data,
};
