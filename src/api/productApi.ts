// Product API
// Endpoints: /api/products

import { get } from './api';
import type {
    ProductListParams,
    ProductListResponse,
    ProductResponse
} from '@/types/product';

const ENDPOINT = '/products';

/**
 * GET /api/products
 * List/search products with filters, pagination, sorting
 */
export const getProducts = async (params?: ProductListParams): Promise<ProductListResponse> => {
    const queryParams = new URLSearchParams();

    if (params?.status) queryParams.append('status', params.status);
    if (params?.productType) queryParams.append('productType', params.productType);
    if (params?.q) queryParams.append('q', params.q);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortDir) queryParams.append('sortDir', params.sortDir);

    const query = queryParams.toString();
    return get<ProductListResponse>(`${ENDPOINT}${query ? `?${query}` : ''}`);
};

/**
 * GET /api/products/{id}
 * Get single product by ID
 */
export const getProductById = async (id: number): Promise<ProductResponse> => {
    return get<ProductResponse>(`${ENDPOINT}/${id}`);
};
