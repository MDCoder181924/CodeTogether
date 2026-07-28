import axios from 'axios';

/**
 * Dynamically resolves the API Base URL.
 * Supports explicit environment variables, local development, and production deployment.
 */
export const getApiBaseUrl = () => {
  if (import.meta?.env?.VITE_API_URL) {
    let url = import.meta.env.VITE_API_URL.replace(/\/$/, '');
    return url.endsWith('/api') ? url : `${url}/api`;
  }
  
  const isLocal = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  if (isLocal) {
    return 'http://localhost:3000/api';
  }
  
  return `${window.location.origin}/api`;
};

/**
 * Dynamically resolves the Socket Server URL.
 * Supports explicit environment variables, local development, and production deployment.
 */
export const getSocketUrl = () => {
  if (import.meta?.env?.VITE_SOCKET_URL) {
    return import.meta.env.VITE_SOCKET_URL.replace(/\/$/, '');
  }

  if (import.meta?.env?.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/$/, '').replace(/\/api$/, '');
  }

  const isLocal = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  if (isLocal) {
    return 'http://localhost:3000';
  }

  return window.location.origin;
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
});

// Intercept requests to attach Authorization header (ensures auth works even if 3rd-party cookies are blocked)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export default api;