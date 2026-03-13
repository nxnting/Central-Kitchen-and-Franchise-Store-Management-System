import api from "../adminApi";
import type {
  AdminFranchise,
  CreateFranchisePayload,
  UpdateFranchisePayload,
} from "@/types/admin/franchise.types";

export const adminFranchisesApi = {
  list: async () =>
    (await api.get<{ data: AdminFranchise[] }>("/admin/franchises")).data.data,

  detail: async (id: number) =>
    (await api.get<{ data: AdminFranchise }>(`/admin/franchises/${id}`)).data
      .data,

  create: async (payload: CreateFranchisePayload) =>
    (await api.post<{ data: AdminFranchise }>("/admin/franchises", payload)).data
      .data,

  update: async (id: number, payload: UpdateFranchisePayload) => {
    await api.put(`/admin/franchises/${id}`, payload);
  },

  remove: async (id: number) => {
    await api.delete(`/admin/franchises/${id}`);
  },
};