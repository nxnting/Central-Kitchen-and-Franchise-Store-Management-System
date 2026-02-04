// Product React Query Hooks

import { useQuery } from '@tanstack/react-query';
import { getProducts, getProductById } from '@/api/productApi';
import type { ProductListParams } from '@/types/product';

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
