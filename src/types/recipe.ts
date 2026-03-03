// Recipe Types

import { ApiResponse } from './product';

export type RecipeStatus = 'DRAFT' | 'ACTIVE' | 'INACTIVE';

export interface Recipe {
    id: number;
    productId: number;
    version: number;
    status: RecipeStatus;
    instructions: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface RecipeListParams {
    productId?: number;
    status?: RecipeStatus | 'ALL';
    page?: number;
    pageSize?: number;
    sortBy?: 'id' | 'productId' | 'version' | 'status' | 'createdAt' | 'updatedAt';
    sortDir?: 'asc' | 'desc';
}

export interface RecipePaginatedData {
    items: Recipe[];
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}

export type RecipeListResponse = ApiResponse<RecipePaginatedData>;

export type RecipeSingleResponse = ApiResponse<Recipe>;

export interface CreateRecipeRequest {
    productId: number;
    instructions?: string;
}

export interface UpdateRecipeRequest {
    instructions?: string;
}

export interface ChangeRecipeStatusRequest {
    status: RecipeStatus;
}
