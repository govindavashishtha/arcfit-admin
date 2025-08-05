// Environment configuration
export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://arcfit-services-prod.arcfit.co.in',
  environment: import.meta.env.VITE_APP_ENV || 'development',
  isDevelopment: import.meta.env.VITE_APP_ENV === 'development',
  isProduction: import.meta.env.VITE_APP_ENV === 'production',
};

// Log current environment (only in development)
if (config.isDevelopment) {
  console.log('🚀 Running in development mode');
  console.log('📡 API Base URL:', config.apiBaseUrl);
}