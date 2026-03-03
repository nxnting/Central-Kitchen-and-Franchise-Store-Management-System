import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getBoms,
    getBomById,
    createBom,
    updateBom,
    changeBomStatus
} from '@/api/manager/bomApi';
import type {
    BomListParams,
    CreateBomRequest,
    UpdateBomRequest,
    ChangeBomStatusRequest
} from '@/types/bom';

const BOMS_KEY = 'boms';

export const useBoms = (params?: BomListParams) => {
    return useQuery({
        queryKey: [BOMS_KEY, params],
        queryFn: () => getBoms(params),
    });
};

export const useBom = (id: number) => {
    return useQuery({
        queryKey: [BOMS_KEY, id],
        queryFn: () => getBomById(id),
        enabled: !!id,
    });
};

export const useCreateBom = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateBomRequest) => createBom(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [BOMS_KEY] });
        },
    });
};

export const useUpdateBom = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateBomRequest }) => updateBom(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [BOMS_KEY] });
            queryClient.invalidateQueries({ queryKey: [BOMS_KEY, variables.id] });
        },
    });
};

export const useChangeBomStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: ChangeBomStatusRequest }) => changeBomStatus(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [BOMS_KEY] });
            queryClient.invalidateQueries({ queryKey: [BOMS_KEY, variables.id] });
        },
    });
};
