export type SupplierStatus = 'ACTIVE' | 'INACTIVE';

export interface Supplier {
    id: number;
    name: string;
    contactInfo: string | null;
    status: SupplierStatus;
}

export interface SupplierListParams {
    q?: string;
    status?: string;
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
}

export interface SupplierListResponse {
    success: boolean;
    data: {
        items: Supplier[];
        page: number;
        pageSize: number;
        totalItems: number;
        totalPages: number;
    };
}

export interface SupplierFormData {
    name: string;
    contactInfo?: string;
}

export interface ChangeSupplierStatusData {
    status: SupplierStatus;
    reason?: string;
}
