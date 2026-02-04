import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';


const BASE_URL = 'https://centralkitchenandfranchisestoremanagemen.onrender.com/api';

const api: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error: AxiosError) => {
        if (error.response) {
            const { status } = error.response;

            switch (status) {
                case 401:
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    window.location.href = '/login';
                    break;
                case 403:
                    console.error('Bạn không có quyền truy cập tài nguyên này');
                    break;
                case 404:
                    console.error('Không tìm thấy tài nguyên');
                    break;
                case 500:
                    console.error('Lỗi máy chủ');
                    break;
                default:
                    break;
            }
        } else if (error.request) {
            console.error('Không thể kết nối đến máy chủ');
        }

        return Promise.reject(error);
    }
);

export interface ApiResponse<T = unknown> {
    data: T;
    message?: string;
    success: boolean;
}

/** GET request */
export const get = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.get<T>(url, config);
    return response.data;
};

/** POST request */
export const post = async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.post<T>(url, data, config);
    return response.data;
};

/** PUT request */
export const put = async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.put<T>(url, data, config);
    return response.data;
};

/** PATCH request */
export const patch = async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.patch<T>(url, data, config);
    return response.data;
};

/** DELETE request */
export const del = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.delete<T>(url, config);
    return response.data;
};

/** Upload file request */
export const uploadFile = async <T>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.post<T>(url, formData, {
        ...config,
        headers: {
            ...config?.headers,
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export default api;
