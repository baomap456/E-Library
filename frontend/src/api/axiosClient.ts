import axios from 'axios';
import { getStoredToken } from './session';

const rawApiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '/api').trim();
const apiBaseUrl = rawApiBaseUrl.endsWith('/api')
    ? rawApiBaseUrl
    : `${rawApiBaseUrl.replace(/\/+$/, '')}/api`;

const axiosClient = axios.create({
    baseURL: apiBaseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosClient.interceptors.request.use(
    (config) => {
        const token = getStoredToken();

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosClient.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosClient;
