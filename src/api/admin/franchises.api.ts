import api from '../api';
import type {
  AdminFranchise,
  CreateFranchisePayload,
  UpdateFranchisePayload,
} from '@/types/admin/franchise.types';

export const adminFranchisesApi = {
  list: async () => (await api.get<AdminFranchise[]>('/admin/franchises')).data,

  detail: async (id: number) =>
    (await api.get<AdminFranchise>(`/admin/franchises/${id}`)).data,

  create: async (payload: CreateFranchisePayload) =>
    (await api.post<AdminFranchise>('/admin/franchises', payload)).data,

  update: async (id: number, payload: UpdateFranchisePayload) =>
    (await api.put(`/admin/franchises/${id}`, payload)).data,

  remove: async (id: number) =>
    (await api.delete(`/admin/franchises/${id}`)).data,
};
