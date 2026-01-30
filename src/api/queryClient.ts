import { QueryClient } from '@tanstack/react-query';

// Tạo QueryClient với cấu hình mặc định
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Thời gian cache data (5 phút)
            staleTime: 5 * 60 * 1000,
            // Thời gian giữ data trong cache khi không sử dụng (10 phút)
            gcTime: 10 * 60 * 1000,
            // Số lần retry khi request thất bại
            retry: 1,
            // Không refetch khi focus window
            refetchOnWindowFocus: false,
            // Không refetch khi reconnect
            refetchOnReconnect: false,
        },
        mutations: {
            // Số lần retry cho mutations
            retry: 0,
        },
    },
});

export default queryClient;
