import { get, post, put, patch } from '../api';
import type {
    Bom,
    BomListParams,
    BomListResponse,
    BomSingleResponse,
    CreateBomRequest,
    UpdateBomRequest,
    ChangeBomStatusRequest
} from '@/types/bom';

const ENDPOINT = '/boms';

/**
 * GET /api/boms
 * List/search boms with filters, pagination, sorting
 */
export const getBoms = async (params?: BomListParams): Promise<BomListResponse> => {
    const queryParams = new URLSearchParams();

    if (params?.productId) queryParams.append('productId', params.productId.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortDir) queryParams.append('sortDir', params.sortDir);

    const query = queryParams.toString();
    return get<BomListResponse>(`${ENDPOINT}${query ? `?${query}` : ''}`);
};

/**
 * GET /api/boms/{id}
 * Get single bom by ID
 */
export const getBomById = async (id: number): Promise<BomSingleResponse> => {
    return get<BomSingleResponse>(`${ENDPOINT}/${id}`);
};

/**
 * POST /api/boms
 * Create new bom
 */
export const createBom = async (data: CreateBomRequest): Promise<BomSingleResponse> => {
    return post<BomSingleResponse>(ENDPOINT, data);
};

/**
 * PUT /api/boms/{id}
 * Update bom items
 */
export const updateBom = async (id: number, data: UpdateBomRequest): Promise<BomSingleResponse> => {
    return put<BomSingleResponse>(`${ENDPOINT}/${id}`, data);
};

/**
 * PATCH /api/boms/{id}/status
 * Change bom status (DRAFT -> ACTIVE -> INACTIVE etc)
 */
export const changeBomStatus = async (id: number, data: ChangeBomStatusRequest): Promise<BomSingleResponse> => {
    return patch<BomSingleResponse>(`${ENDPOINT}/${id}/status`, data);
};
