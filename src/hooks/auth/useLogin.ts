import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi, LoginRequest, LoginData, AuthResponse } from '@/api';

// Map role từ API sang UserRole của app
const mapApiRoleToUserRole = (role: string): string => {
    const roleMap: Record<string, string> = {
        'Admin': 'admin',
        'FranchiseStore': 'franchise_store',
        'CentralKitchen': 'central_kitchen',
        'SupplyCoordinator': 'supply_coordinator',
        'Manager': 'manager',
    };
    return roleMap[role] || 'admin';
};

// Lấy dashboard path dựa trên role
const getRoleDashboardPath = (role: string): string => {
    const paths: Record<string, string> = {
        franchise_store: '/store',
        central_kitchen: '/kitchen',
        supply_coordinator: '/coordinator',
        manager: '/manager',
        admin: '/admin',
    };
    return paths[role] || '/admin';
};

interface UseLoginOptions {
    onSuccess?: (data: AuthResponse<LoginData>) => void;
    onError?: (error: Error) => void;
    redirectOnSuccess?: boolean;
}

export const useLogin = (options: UseLoginOptions = {}) => {
    const { onSuccess, onError, redirectOnSuccess = true } = options;
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: (credentials: LoginRequest) => authApi.login(credentials),
        onSuccess: (response) => {
            console.log('Login response:', response);

            if (response.success && response.data) {
                console.log('Login thành công!', response.data);
                console.log('Role từ API:', response.data.role);

                // Gọi callback nếu có
                onSuccess?.(response);

                // Redirect đến dashboard tương ứng với role
                if (redirectOnSuccess) {
                    const userRole = mapApiRoleToUserRole(response.data.role);
                    const dashboardPath = getRoleDashboardPath(userRole);
                    console.log('Mapped role:', userRole);
                    console.log('Redirecting to:', dashboardPath);
                    navigate(dashboardPath, { replace: true });
                }
            } else {
                console.log('Login thất bại:', response.message);
            }
        },
        onError: (error: Error) => {
            onError?.(error);
        },
    });

    const login = (usernameOrEmail: string, password: string) => {
        mutation.mutate({ usernameOrEmail, password });
    };

    return {
        login,
        isLoading: mutation.isPending,
        isError: mutation.isError,
        isSuccess: mutation.isSuccess,
        error: mutation.error,
        data: mutation.data,
        reset: mutation.reset,
    };
};

export default useLogin;
