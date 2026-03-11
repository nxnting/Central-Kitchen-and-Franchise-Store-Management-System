import { get, post, put, patch, del } from '../api';
import type {
    Supplier,
    SupplierListParams,
    SupplierListResponse,
    SupplierFormData,
    ChangeSupplierStatusData
} from '@/types/supplier';

const ENDPOINT = '/suppliers';

/**
 * GET /api/suppliers
 */
export const getSuppliers = async (params?: SupplierListParams): Promise<SupplierListResponse> => {
    const queryParams = new URLSearchParams();

    if (params?.q) queryParams.append('q', params.q);
    if (params?.status && params.status !== 'all') queryParams.append('status', params.status);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortDir) queryParams.append('sortDir', params.sortDir);

    const query = queryParams.toString();
    return get<SupplierListResponse>(`${ENDPOINT}${query ? `?${query}` : ''}`);
};

/**
 * GET /api/suppliers/{id}
 */
export const getSupplierById = async (id: number): Promise<{ success: boolean; data: Supplier }> => {
    return get<{ success: boolean; data: Supplier }>(`${ENDPOINT}/${id}`);
};

/**
 * POST /api/suppliers
 */
export const createSupplier = async (data: SupplierFormData): Promise<{ success: boolean; data: Supplier }> => {
    return post<{ success: boolean; data: Supplier }>(ENDPOINT, data);
};

/**
 * PUT /api/suppliers/{id}
 */
export const updateSupplier = async (id: number, data: SupplierFormData): Promise<{ success: boolean; data: Supplier }> => {
    return put<{ success: boolean; data: Supplier }>(`${ENDPOINT}/${id}`, data);
};

/**
 * PATCH /api/suppliers/{id}/status
 */
export const changeSupplierStatus = async (id: number, data: ChangeSupplierStatusData): Promise<{ success: boolean; data: Supplier }> => {
    return patch<{ success: boolean; data: Supplier }>(`${ENDPOINT}/${id}/status`, data);
};

/**
 * DELETE /api/suppliers/{id}
 */
export const deleteSupplier = async (id: number): Promise<void> => {
    return del<void>(`${ENDPOINT}/${id}`);
};
