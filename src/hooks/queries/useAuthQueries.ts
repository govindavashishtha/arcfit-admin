import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { LoginCredentials, User } from '../../types/auth';
import { login, getCurrentUser, refreshToken, logout as apiLogout } from '../../api/authApi';
import { 
  setTokens, 
  clearTokens, 
  updateAccessToken,
  getAccessToken,
  getRefreshToken 
} from '../../utils/tokenStorage';

// Query Keys
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
  login: () => [...authKeys.all, 'login'] as const,
};

// Login Mutation
export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      try {
        const response = await login(credentials);
        if (!response.success || !response.data) {
          throw new Error('Login failed. Please check your credentials.');
        }
        return response.data;
      } catch (error: any) {
        // Check if it's an Axios error with 403 status
        if (error?.response?.status === 403) {
          throw new Error('Login failed. Please check your email and password, or contact support if the issue persists.');
        }
        // For other errors, throw the original error message or a generic one
        throw new Error(error?.message || 'Login failed. Please try again.');
      }
    },
    onSuccess: (data) => {
      const { access_token, refresh_token, expires_in, ...userData } = data;
      
      // Store tokens
      setTokens(access_token, refresh_token, expires_in);
      
      // Set user data in cache
      queryClient.setQueryData(authKeys.user(), userData);
      
      // Invalidate and refetch user query
      queryClient.invalidateQueries({ queryKey: authKeys.user() });
    },
    onError: (error) => {
      console.error('Login error:', error);
      clearTokens();
      queryClient.removeQueries({ queryKey: authKeys.user() });
    },
  });
};

// Current User Query
export const useCurrentUserQuery = () => {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: async () => {
      const response = await getCurrentUser();
      if (!response.success || !response.data) {
        throw new Error('Failed to fetch user data');
      }
      return response.data;
    },
    enabled: !!getAccessToken(), // Only run if we have a token
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on auth errors
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

// Refresh Token Mutation
export const useRefreshTokenMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const response = await refreshToken();
      if (!response.success || !response.data) {
        throw new Error('Token refresh failed');
      }
      return response.data;
    },
    onSuccess: (data) => {
      const { access_token, expires_in } = data;
      updateAccessToken(access_token, expires_in);
    },
    onError: (error) => {
      console.error('Token refresh error:', error);
      clearTokens();
      queryClient.removeQueries({ queryKey: authKeys.user() });
      queryClient.clear();
    },
  });
};

// Logout Mutation
export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      if (getAccessToken() && getRefreshToken()) {
        await apiLogout();
      }
    },
    onSettled: () => {
      // Always clear tokens and cache on logout
      clearTokens();
      queryClient.clear();
    },
  });
};