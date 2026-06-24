// Central frontend configuration for API endpoints
const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // If we are running locally in development mode
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5000/api';
  }
  // In production, default to relative path "/api" (standard for reverse proxy setups)
  return '/api';
};

export const API_BASE_URL = getApiUrl();
export const API_STATIC_BASE = API_BASE_URL.replace('/api', '');
