// Central frontend configuration for API endpoints
const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  const host = window.location.hostname;
  
  // Check if we are running locally (localhost, loopback, or local private network IPs)
  const isLocal = 
    host === 'localhost' || 
    host === '127.0.0.1' || 
    host.startsWith('192.168.') || 
    host.startsWith('10.') || 
    host.startsWith('172.');

  if (isLocal) {
    return `${window.location.protocol}//${host}:5000/api`;
  }
  
  // In production, default to relative path "/api" (standard for reverse proxy setups)
  return '/api';
};

export const API_BASE_URL = getApiUrl();
export const API_STATIC_BASE = API_BASE_URL.replace('/api', '');
