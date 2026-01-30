import { post } from './api';

// Types cho Auth API
export interface LoginRequest {
    usernameOrEmail: string;
    password: string;
}

export interface LoginData {
    accessToken: string;
    tokenType: string;
    expiresInSeconds: number;
    userId: number;
    username: string;
    role: string;
}

export interface AuthResponse<T = unknown> {
    success: boolean;
    message: string | null;
    data: T;
    errors: string[] | null;
}

// Auth API functions
export const authApi = {
    /**
     * Đăng nhập
     * @param credentials - Thông tin đăng nhập (usernameOrEmail, password)
     * @returns Promise<AuthResponse<LoginData>>
     */
    login: async (credentials: LoginRequest): Promise<AuthResponse<LoginData>> => {
        const response = await post<AuthResponse<LoginData>>('/auth/login', credentials);

        // Lưu token vào localStorage nếu đăng nhập thành công
        if (response.success && response.data?.accessToken) {
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('userId', String(response.data.userId));
            localStorage.setItem('username', response.data.username);
            localStorage.setItem('userRole', response.data.role);

            // Dispatch custom event để AuthContext cập nhật state
            window.dispatchEvent(new Event('auth-login'));
        }

        return response;
    },

    /**
     * Đăng xuất
     */
    logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        localStorage.removeItem('userRole');
        window.location.href = '/login';
    },

    /**
     * Kiểm tra đã đăng nhập chưa
     */
    isAuthenticated: (): boolean => {
        return !!localStorage.getItem('accessToken');
    },

    /**
     * Lấy thông tin user hiện tại từ localStorage
     */
    getCurrentUser: () => {
        return {
            userId: localStorage.getItem('userId'),
            username: localStorage.getItem('username'),
            role: localStorage.getItem('userRole'),
        };
    },

    /**
     * Lấy access token
     */
    getAccessToken: (): string | null => {
        return localStorage.getItem('accessToken');
    },
};

export default authApi;
