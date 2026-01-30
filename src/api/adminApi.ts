import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

const ADMIN_BASE_URL = 'https://centralkitchenandfranchisestoremanagemen.onrender.com';

const adminApi: AxiosInstance = axios.create({
  baseURL: ADMIN_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

adminApi.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default adminApi;
