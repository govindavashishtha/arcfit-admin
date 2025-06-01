import React, { createContext, useEffect, useState } from 'react';
import { User, LoginCredentials } from '../types/auth';
import { login, getCurrentUser, refreshToken, logout as apiLogout } from '../api/authApi';
import { 
  setTokens, 
  getAccessToken, 
  clearTokens, 
  isTokenExpired, 
  updateAccessToken,
  getRefreshToken
} from '../utils/tokenStorage';

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
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  // Function to handle user login
  const handleLogin = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await login(credentials);
      
      if (response.success && response.data) {
        const { access_token, refresh_token, expires_in, ...userData } = response.data;
        
        // Store tokens in localStorage
        setTokens(access_token, refresh_token, expires_in);
        
        // Set user data in state
        setUser(userData as unknown as User);
        setIsAuthenticated(true);
        
        // Set up token refresh interval
        startRefreshTokenInterval();
        
        return true;
      } else {
        setError('Login failed. Please check your credentials.');
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(`Login failed: ${errorMessage}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle user logout
  const handleLogout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Call the logout API
      if (getAccessToken() && getRefreshToken()) {
        await apiLogout();
      }
      
      // Clear the refresh token interval
      if (refreshInterval) {
        clearInterval(refreshInterval);
        setRefreshInterval(null);
      }
      
      // Clear user data and tokens
      setUser(null);
      setIsAuthenticated(false);
      clearTokens();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
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
      
      // Get a new access token
      const response = await refreshToken();
      
      if (response.success && response.data) {
        const { access_token, expires_in } = response.data;
        
        // Update the access token
        updateAccessToken(access_token, expires_in);
        
        return true;
      } else {
        await handleLogout();
        return false;
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      await handleLogout();
      return false;
    }
  };
  
  // Function to fetch the current user
  const fetchCurrentUser = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // If token is expired, try to refresh
      if (isTokenExpired()) {
        const refreshed = await handleRefreshToken();
        if (!refreshed) {
          return false;
        }
      }
      
      // Get the current user
      const response = await getCurrentUser();
      
      if (response.success && response.data) {
        setUser(response.data);
        setIsAuthenticated(true);
        return true;
      } else {
        await handleLogout();
        return false;
      }
    } catch (error) {
      console.error('Fetch user error:', error);
      await handleLogout();
      return false;
    } finally {
      setIsLoading(false);
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
  
  // Load user data on initial mount
  useEffect(() => {
    const initializeAuth = async () => {
      // Check if we have an access token
      if (getAccessToken()) {
        // Try to fetch the current user
        const success = await fetchCurrentUser();
        
        if (success) {
          startRefreshTokenInterval();
        }
      } else {
        setIsLoading(false);
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
    user,
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