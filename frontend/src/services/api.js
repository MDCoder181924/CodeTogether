import axios from 'axios';

/**
 * Dynamically resolves the API Base URL.
 * Supports explicit environment variables, local development, and production deployment.
 */
export const getApiBaseUrl = () => {
  if (import.meta?.env?.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
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
    return import.meta.env.VITE_SOCKET_URL;
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

export default api;