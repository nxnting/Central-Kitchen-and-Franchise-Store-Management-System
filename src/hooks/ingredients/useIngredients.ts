// Ingredient React Query Hooks

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getIngredients,
    getIngredientById,
    createIngredient,
    updateIngredient,
    deleteIngredient
} from '@/api/manager/ingredientApi';
import type { IngredientFormData, IngredientListParams } from '@/types/ingredient';
import { toast } from 'sonner';

const INGREDIENTS_KEY = 'ingredients';

// Hook to get list of ingredients
export const useIngredients = (params?: IngredientListParams) => {
    return useQuery({
        queryKey: [INGREDIENTS_KEY, params],
        queryFn: () => getIngredients(params),
    });
};

// Hook to get single ingredient
export const useIngredient = (id: string) => {
    return useQuery({
        queryKey: [INGREDIENTS_KEY, id],
        queryFn: () => getIngredientById(id),
        enabled: !!id,
    });
};

// Hook to create ingredient
export const useCreateIngredient = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: IngredientFormData) => createIngredient(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [INGREDIENTS_KEY] });
            toast.success('Đã thêm nguyên liệu mới');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Không thể thêm nguyên liệu');
        },
    });
};

// Hook to update ingredient
export const useUpdateIngredient = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string | number; data: IngredientFormData }) =>
            updateIngredient(String(id), data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [INGREDIENTS_KEY] });
            toast.success('Đã cập nhật nguyên liệu');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Không thể cập nhật nguyên liệu');
        },
    });
};

// Hook to toggle ingredient status
export const useToggleIngredientStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string | number) => deleteIngredient(String(id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [INGREDIENTS_KEY] });
            toast.success('Đã cập nhật trạng thái nguyên liệu');
        },
        onError: (error: Error & { response?: { status?: number } }) => {
            if (error.response?.status === 409) {
                toast.error('Không thể thay đổi trạng thái. Nguyên liệu đang được sử dụng trong workflow khác.');
            } else {
                toast.error(error.message || 'Không thể thay đổi trạng thái');
            }
        },
    });
};
