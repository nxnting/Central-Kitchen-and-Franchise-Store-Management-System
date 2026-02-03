// Store Catalog Types

export type CatalogStatus = 'ACTIVE' | 'INACTIVE';
export type ProductType = 'FINISHED' | 'SEMI_FINISHED';

export interface StoreCatalog {
    franchiseId: number;
    franchiseName: string;
    productId: number;
    productName: string;
    sku: string;
    unit: string;
    productType: ProductType;
    price: number;
    status: CatalogStatus;
    createdAt: string;
    updatedAt: string;
}

export interface AssignProductData {
    franchiseId: number;
    productId: number;
    price: number;
}

export interface UpdatePriceData {
    price: number;
}

export interface UpdateStatusData {
    status: CatalogStatus;
    reason?: string;
}

export interface StoreCatalogListParams {
    franchiseId: number;
    status?: CatalogStatus | 'ALL';
    productType?: ProductType;
    q?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    pageSize?: number;
    sortBy?: 'productName' | 'sku' | 'price' | 'status' | 'createdAt' | 'updatedAt' | 'productId';
    sortDir?: 'asc' | 'desc';
}

// Paginated response from backend
export interface StoreCatalogPaginatedData {
    items: StoreCatalog[];
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}

// Full API response wrapper
export interface ApiResponse<T> {
    success: boolean;
    message: string | null;
    errorCode: string | null;
    data: T;
    errors: string[] | null;
    fieldErrors: Record<string, string[]> | null;
}

// API list response
export type StoreCatalogListResponse = ApiResponse<StoreCatalogPaginatedData>;

// Single catalog item response
export type StoreCatalogResponse = ApiResponse<StoreCatalog>;
