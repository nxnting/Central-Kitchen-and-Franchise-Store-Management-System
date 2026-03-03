// BOM Types

import { ApiResponse } from './product';

export type BomStatus = 'DRAFT' | 'ACTIVE' | 'INACTIVE';

export interface BomItem {
    ingredientId: number;
    ingredientName: string;
    ingredientUnit: string;
    quantity: number;
}

export interface Bom {
    id: number;
    productId: number;
    version: number;
    status: BomStatus;
    createdAt: string;
    updatedAt: string;
    items: BomItem[];
}

export interface BomListParams {
    productId?: number;
    status?: BomStatus | 'ALL';
    page?: number;
    pageSize?: number;
    sortBy?: 'id' | 'productId' | 'version' | 'status' | 'createdAt' | 'updatedAt';
    sortDir?: 'asc' | 'desc';
}

export interface BomPaginatedData {
    items: Bom[];
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}

export type BomListResponse = ApiResponse<BomPaginatedData>;

export type BomSingleResponse = ApiResponse<Bom>;

export interface BomItemRequest {
    ingredientId: number;
    quantity: number;
}

export interface CreateBomRequest {
    productId: number;
    items: BomItemRequest[];
}

export interface UpdateBomRequest {
    items: BomItemRequest[];
}

export interface ChangeBomStatusRequest {
    status: BomStatus;
}
