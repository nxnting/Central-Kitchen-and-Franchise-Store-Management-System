// Product React Query Hooks

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProducts, getProductById, createProduct, updateProduct, toggleProductStatus } from '@/api/productApi';
import type { ProductListParams } from '@/types/product';
import { toast } from 'sonner';

const PRODUCTS_KEY = 'products';

// Hook to get list of products
export const useProducts = (params?: ProductListParams) => {
    return useQuery({
        queryKey: [PRODUCTS_KEY, params],
        queryFn: () => getProducts(params),
    });
};

// Hook to get single product
export const useProduct = (id: number) => {
    return useQuery({
        queryKey: [PRODUCTS_KEY, id],
        queryFn: () => getProductById(id),
        enabled: !!id,
    });
};

export const useCreateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { name: string; sku: string; unit: string; productType: string }) => createProduct(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [PRODUCTS_KEY] });
            toast.success('Đã thêm sản phẩm mới');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Không thể thêm sản phẩm');
        },
    });
};

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: { name: string; sku: string; unit: string; productType: string } }) =>
            updateProduct(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [PRODUCTS_KEY] });
            toast.success('Đã cập nhật sản phẩm');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Không thể cập nhật sản phẩm');
        },
    });
};

export const useToggleProductStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }: { id: number; status: string }) => toggleProductStatus(id, status),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [PRODUCTS_KEY] });
            const statusText = variables.status === 'ACTIVE' ? 'kích hoạt' : 'ngưng hoạt động';
            toast.success(`Đã ${statusText} sản phẩm`);
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Không thể thay đổi trạng thái');
        },
    });
};
