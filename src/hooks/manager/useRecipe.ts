import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getRecipes,
    getRecipeById,
    createRecipe,
    updateRecipe,
    changeRecipeStatus
} from '@/api/manager/recipeApi';
import type {
    RecipeListParams,
    CreateRecipeRequest,
    UpdateRecipeRequest,
    ChangeRecipeStatusRequest
} from '@/types/recipe';

const RECIPES_KEY = 'recipes';

export const useRecipes = (params?: RecipeListParams) => {
    return useQuery({
        queryKey: [RECIPES_KEY, params],
        queryFn: () => getRecipes(params),
    });
};

export const useRecipe = (id: number) => {
    return useQuery({
        queryKey: [RECIPES_KEY, id],
        queryFn: () => getRecipeById(id),
        enabled: !!id,
    });
};

export const useCreateRecipe = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateRecipeRequest) => createRecipe(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [RECIPES_KEY] });
        },
    });
};

export const useUpdateRecipe = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateRecipeRequest }) => updateRecipe(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [RECIPES_KEY] });
            queryClient.invalidateQueries({ queryKey: [RECIPES_KEY, variables.id] });
        },
    });
};

export const useChangeRecipeStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: ChangeRecipeStatusRequest }) => changeRecipeStatus(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [RECIPES_KEY] });
            queryClient.invalidateQueries({ queryKey: [RECIPES_KEY, variables.id] });
        },
    });
};
