const ACCESS_TOKEN_KEY = 'arcfit_access_token';
const REFRESH_TOKEN_KEY = 'arcfit_refresh_token';
const TOKEN_EXPIRY_KEY = 'arcfit_token_expiry';

export const setTokens = (accessToken: string, refreshToken: string, expiresIn: number): void => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  
  // Calculate expiry time in milliseconds since epoch
  const expiryTime = Date.now() + expiresIn * 1000;
  localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
};

export const getAccessToken = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const getTokenExpiry = (): number | null => {
  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
  return expiry ? parseInt(expiry, 10) : null;
};

export const clearTokens = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
};

export const isTokenExpired = (): boolean => {
  const expiry = getTokenExpiry();
  
  if (!expiry) {
    return true;
  }
  
  // Add a buffer of 30 seconds to trigger refresh before actual expiration
  return Date.now() > expiry - 30000;
};

export const updateAccessToken = (accessToken: string, expiresIn: number): void => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  
  const expiryTime = Date.now() + expiresIn * 1000;
  localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
};