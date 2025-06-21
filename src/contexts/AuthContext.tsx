import React, { createContext, useEffect, useState } from 'react';
import { User, LoginCredentials } from '../types/auth';
import { 
  getAccessToken, 
  clearTokens, 
  isTokenExpired,
  getRefreshToken
} from '../utils/tokenStorage';
import { 
  useLoginMutation, 
  useCurrentUserQuery, 
  useRefreshTokenMutation, 
  useLogoutMutation 
} from '../hooks/queries/useAuthQueries';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUserSession: () => Promise<boolean>;
}

const defaultContext: AuthContextType = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  login: async () => false,
  logout: async () => {},
  refreshUserSession: async () => false,
};

export const AuthContext = createContext<AuthContextType>(defaultContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  // TanStack Query hooks
  const loginMutation = useLoginMutation();
  const logoutMutation = useLogoutMutation();
  const refreshTokenMutation = useRefreshTokenMutation();
  const { 
    data: user, 
    isLoading: isUserLoading, 
    error: userError,
    refetch: refetchUser 
  } = useCurrentUserQuery();

  const isAuthenticated = !!user && !!getAccessToken();
  const isLoading = isUserLoading || loginMutation.isPending || logoutMutation.isPending;
  const error = loginMutation.error?.message || userError?.message || null;

  // Function to handle user login
  const handleLogin = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      await loginMutation.mutateAsync(credentials);
      startRefreshTokenInterval();
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  // Function to handle user logout
  const handleLogout = async (): Promise<void> => {
    try {
      // Clear the refresh token interval
      if (refreshInterval) {
        clearInterval(refreshInterval);
        setRefreshInterval(null);
      }
      
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  // Function to refresh the user's access token
  const handleRefreshToken = async (): Promise<boolean> => {
    try {
      // Check if we have a refresh token
      if (!getRefreshToken()) {
        await handleLogout();
        return false;
      }
      
      await refreshTokenMutation.mutateAsync();
      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      await handleLogout();
      return false;
    }
  };
  
  // Function to start the token refresh interval
  const startRefreshTokenInterval = () => {
    // Clear any existing interval
    if (refreshInterval) {
      clearInterval(refreshInterval);
    }
    
    // Check and refresh token every minute
    const interval = setInterval(async () => {
      if (isTokenExpired()) {
        await handleRefreshToken();
      }
    }, 60000); // 1 minute
    
    setRefreshInterval(interval);
  };
  
  // Initialize auth on mount
  useEffect(() => {
    const initializeAuth = () => {
      // Check if we have an access token
      if (getAccessToken()) {
        // If token is expired, try to refresh
        if (isTokenExpired()) {
          handleRefreshToken();
        } else {
          // Start refresh interval if we have a valid token
          startRefreshTokenInterval();
        }
      }
    };
    
    initializeAuth();
    
    // Clean up on unmount
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, []);
  
  // Create the context value
  const contextValue: AuthContextType = {
    user: user || null,
    isAuthenticated,
    isLoading,
    error,
    login: handleLogin,
    logout: handleLogout,
    refreshUserSession: handleRefreshToken,
  };
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};