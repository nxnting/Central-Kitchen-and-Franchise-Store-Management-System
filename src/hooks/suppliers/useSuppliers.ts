import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getSuppliers,
    getSupplierById,
    createSupplier,
    updateSupplier,
    changeSupplierStatus,
    deleteSupplier
} from '@/api/manager/supplierApi';
import type {
    SupplierFormData,
    SupplierListParams,
    ChangeSupplierStatusData
} from '@/types/supplier';
import { toast } from 'sonner';

const SUPPLIERS_KEY = 'suppliers';

export const useSuppliers = (params?: SupplierListParams) => {
    return useQuery({
        queryKey: [SUPPLIERS_KEY, params],
        queryFn: () => getSuppliers(params),
    });
};

export const useSupplier = (id: number) => {
    return useQuery({
        queryKey: [SUPPLIERS_KEY, id],
        queryFn: () => getSupplierById(id),
        enabled: !!id,
    });
};

export const useCreateSupplier = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: SupplierFormData) => createSupplier(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [SUPPLIERS_KEY] });
            toast.success('Đã thêm nhà cung cấp mới');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Không thể thêm nhà cung cấp');
        },
    });
};

export const useUpdateSupplier = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: SupplierFormData }) =>
            updateSupplier(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [SUPPLIERS_KEY] });
            toast.success('Đã cập nhật nhà cung cấp');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Không thể cập nhật nhà cung cấp');
        },
    });
};

export const useChangeSupplierStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: ChangeSupplierStatusData }) => changeSupplierStatus(id, data),
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: [SUPPLIERS_KEY] });
            const statusText = response.data.status === 'ACTIVE' ? 'kích hoạt' : 'ngưng hoạt động';
            toast.success(`Đã ${statusText} nhà cung cấp`);
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Không thể thay đổi trạng thái');
        },
    });
};

export const useDeleteSupplier = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => deleteSupplier(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [SUPPLIERS_KEY] });
            toast.success('Đã vô hiệu hóa nhà cung cấp');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Không thể vô hiệu hóa nhà cung cấp');
        },
    });
};
