import { get, post, put, patch } from '../api';
import type {
    Recipe,
    RecipeListParams,
    RecipeListResponse,
    RecipeSingleResponse,
    CreateRecipeRequest,
    UpdateRecipeRequest,
    ChangeRecipeStatusRequest
} from '@/types/recipe';

const ENDPOINT = '/recipes';

/**
 * GET /api/recipes
 * List/search recipes with filters, pagination, sorting
 */
export const getRecipes = async (params?: RecipeListParams): Promise<RecipeListResponse> => {
    const queryParams = new URLSearchParams();

    if (params?.productId) queryParams.append('productId', params.productId.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortDir) queryParams.append('sortDir', params.sortDir);

    const query = queryParams.toString();
    return get<RecipeListResponse>(`${ENDPOINT}${query ? `?${query}` : ''}`);
};

/**
 * GET /api/recipes/{id}
 * Get single recipe by ID
 */
export const getRecipeById = async (id: number): Promise<RecipeSingleResponse> => {
    return get<RecipeSingleResponse>(`${ENDPOINT}/${id}`);
};

/**
 * POST /api/recipes
 * Create new recipe
 */
export const createRecipe = async (data: CreateRecipeRequest): Promise<RecipeSingleResponse> => {
    return post<RecipeSingleResponse>(ENDPOINT, data);
};

/**
 * PUT /api/recipes/{id}
 * Update recipe instructions
 */
export const updateRecipe = async (id: number, data: UpdateRecipeRequest): Promise<RecipeSingleResponse> => {
    return put<RecipeSingleResponse>(`${ENDPOINT}/${id}`, data);
};

/**
 * PATCH /api/recipes/{id}/status
 * Change recipe status (DRAFT -> ACTIVE -> INACTIVE etc)
 */
export const changeRecipeStatus = async (id: number, data: ChangeRecipeStatusRequest): Promise<RecipeSingleResponse> => {
    return patch<RecipeSingleResponse>(`${ENDPOINT}/${id}/status`, data);
};
