import axios from 'axios';
import { LoginCredentials, ApiResponse, LoginResponse, RefreshTokenResponse, User } from '../types/auth';
import { getAccessToken, getRefreshToken } from '../utils/tokenStorage';

// Base URL for the API
const BASE_URL = 'https://arcfit-services-dev.arcfit.co.in'; // Replace with your actual API base URL

// Create an axios instance with default configuration
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include authentication token
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const login = async (credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> => {
  const response = await api.post<ApiResponse<LoginResponse>>('/api/auth/admin/login', credentials);
  return response.data;
};

export const getCurrentUser = async (): Promise<ApiResponse<User>> => {
  const response = await api.get<ApiResponse<User>>('/api/auth/me');
  return response.data;
};

export const refreshToken = async (): Promise<ApiResponse<RefreshTokenResponse>> => {
  const refresh_token = getRefreshToken();
  const response = await api.post<ApiResponse<RefreshTokenResponse>>('/api/auth/refresh', { refresh_token });
  return response.data;
};

export const logout = async (): Promise<void> => {
  const refresh_token = getRefreshToken();
  await api.post('/api/auth/logout', { refresh_token });
};

export default api;