import { QueryClient } from '@tanstack/react-query';

// Tạo QueryClient với cấu hình mặc định
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            
            staleTime: 5 * 60 * 1000,
            
            gcTime: 10 * 60 * 1000,
         
            retry: 1,

            refetchOnWindowFocus: false,

            refetchOnReconnect: false,
        },
        mutations: {
        
            retry: 0,
        },
    },
});

export default queryClient;
