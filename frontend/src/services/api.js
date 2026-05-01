import axios from 'axios';

export const getBaseApiUrl = () => {
  const { hostname, protocol } = window.location;
  
  // Si estamos en localhost, podemos usar el env var o el default
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return import.meta.env.VITE_API_URL || 'http://localhost:3000';
  }

  // En producción, si hay VITE_API_URL explícito, usarlo
  const envApiUrl = import.meta.env.VITE_API_URL;
  if (envApiUrl && !envApiUrl.includes('localhost')) {
    return envApiUrl;
  }
  
  // En producción sin VITE_API_URL: usar ruta relativa /api
  // Traefik redireccionará internamente al backend
  console.log('Using relative API URL: /api');
  return '/api';
};

export const getBaseWsUrl = () => {
  const { hostname, protocol } = window.location;
  const wsProtocol = protocol === 'https:' ? 'wss:' : 'ws:';
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return import.meta.env.VITE_WS_URL || `${wsProtocol}//localhost:3000`;
  }

  const envWsUrl = import.meta.env.VITE_WS_URL;
  if (envWsUrl && !envWsUrl.includes('localhost')) {
    return envWsUrl;
  }
  
  // En producción sin VITE_WS_URL: usar ruta relativa /api/socket.io/
  // Traefik redireccionará internamente al backend
  const currentUrl = new URL(window.location);
  const wsUrl = `${wsProtocol}//${currentUrl.host}/api/socket.io/`;
  console.log('Using relative WS URL:', wsUrl);
  return wsUrl;
};

const API_URL = getBaseApiUrl();

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor para añadir el token y el tenant_id
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Resolver tenantId desde el host o localStorage
  const host = window.location.hostname;
  const parts = host.split('.');
  
  let tenantId = localStorage.getItem('tenantId');
  
  if (parts.length > 4) {
    const potentialTenant = parts[0];
    if (potentialTenant !== 'www' && potentialTenant !== 'rms' && potentialTenant !== 'api') {
      tenantId = potentialTenant;
    }
  }

  if (tenantId && tenantId !== 'www' && tenantId !== 'rms' && tenantId !== 'api') {
    config.headers['x-tenant-id'] = tenantId;
  }

  return config;
});

export default api;
