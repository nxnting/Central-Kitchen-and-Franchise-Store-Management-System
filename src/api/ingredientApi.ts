// Ingredient Master API
// Endpoints: /api/ingredients

import { get, post, put, patch, del } from './api';
import type {
    Ingredient,
    IngredientFormData,
    IngredientListParams,
    IngredientListResponse
} from '@/types/ingredient';

const ENDPOINT = '/ingredients';

/**
 * GET /api/ingredients
 * Get list of ingredients with search, sort, pagination
 */
export const getIngredients = async (params?: IngredientListParams): Promise<IngredientListResponse> => {
    const queryParams = new URLSearchParams();

    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());

    const query = queryParams.toString();
    return get<IngredientListResponse>(`${ENDPOINT}${query ? `?${query}` : ''}`);
};

/**
 * GET /api/ingredients/{id}
 * Get single ingredient by ID
 */
export const getIngredientById = async (id: string): Promise<Ingredient> => {
    return get<Ingredient>(`${ENDPOINT}/${id}`);
};

/**
 * POST /api/ingredients
 * Create new ingredient
 */
export const createIngredient = async (data: IngredientFormData): Promise<Ingredient> => {
    return post<Ingredient>(ENDPOINT, data);
};

/**
 * PUT /api/ingredients/{id}
 * Update ingredient
 */
export const updateIngredient = async (id: string, data: IngredientFormData): Promise<Ingredient> => {
    return put<Ingredient>(`${ENDPOINT}/${id}`, data);
};

/**
 * DELETE /api/ingredients/{id}
 * Soft delete ingredient (sets status to INACTIVE)
 * Note: No hard delete - only deactivate
 */
export const deleteIngredient = async (id: string): Promise<void> => {
    return del<void>(`${ENDPOINT}/${id}`);
};

/**
 * PATCH /api/ingredients/{id}/status
 * Toggle ingredient status (ACTIVE <-> INACTIVE)
 */
export const toggleIngredientStatus = async (id: string): Promise<Ingredient> => {
    return patch<Ingredient>(`${ENDPOINT}/${id}/status`);
};
