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

// In production on Hostinger, static asset requests for uploads must go through the /api route 
// to ensure Hostinger's reverse proxy routes the requests to the Node backend instead of 404ing.
export const API_STATIC_BASE = 
  window.location.hostname === 'localhost' || 
  window.location.hostname === '127.0.0.1' || 
  window.location.hostname.startsWith('192.168.') || 
  window.location.hostname.startsWith('10.') || 
  window.location.hostname.startsWith('172.')
    ? API_BASE_URL.replace('/api', '')
    : '';
