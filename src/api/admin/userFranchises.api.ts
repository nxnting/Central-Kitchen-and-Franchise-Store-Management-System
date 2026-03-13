import adminApi from '../adminApi';
import type {
  WorkAssignmentType,
  UserWorkAssignment,
  AssignedUserItem,
} from '@/types/admin/franchise.types';

export interface UserWorkAssignmentPayload {
  userId: number;
  assignmentType: WorkAssignmentType;
  franchiseId?: number | null;
  centralKitchenId?: number | null;
}

export interface ListUsersByAssignmentParams {
  assignmentType: WorkAssignmentType;
  franchiseId?: number;
  centralKitchenId?: number;
}

export const adminUserFranchisesApi = {
  getByUser: async (userId: number) =>
    (await adminApi.get<UserWorkAssignment>(`/admin/user-work-assignments/${userId}`)).data,

  listUsersByAssignment: async (params: ListUsersByAssignmentParams) =>
    (await adminApi.get<AssignedUserItem[]>('/admin/user-work-assignments/users', { params })).data,

  assign: async (payload: UserWorkAssignmentPayload) =>
    (await adminApi.post<string>('/admin/user-work-assignments', payload)).data,

  remove: async (userId: number) =>
    (await adminApi.delete<string>(`/admin/user-work-assignments/${userId}`)).data,
};