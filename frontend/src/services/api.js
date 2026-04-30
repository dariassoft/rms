import axios from 'axios';

export const getBaseApiUrl = () => {
  const { hostname, protocol } = window.location;
  
  // Si estamos en localhost, podemos usar el env var o el default
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return import.meta.env.VITE_API_URL || 'http://localhost:3000';
  }

  // En producción, preferimos la resolución dinámica para soportar subdominios
  // o usamos VITE_API_URL si está definido y NO es localhost
  const envApiUrl = import.meta.env.VITE_API_URL;
  if (envApiUrl && !envApiUrl.includes('localhost')) {
    return envApiUrl;
  }
  
  // Resolución dinámica
  const parts = hostname.split('.');
  let baseDomain;
  
  if (parts.length >= 4) {
    // Caso: [tenant].rms.dariassoft.com.ar (5 partes) -> rms.dariassoft.com.ar
    // Caso: rms.dariassoft.com.ar (4 partes) -> rms.dariassoft.com.ar
    baseDomain = parts.slice(-4).join('.');
  } else if (parts.length === 3) {
    // Caso: rms.com.ar -> rms.com.ar
    baseDomain = hostname;
  } else {
    // Fallback
    baseDomain = parts.length > 2 ? parts.slice(-3).join('.') : hostname;
  }
  
  const apiUrl = hostname.includes('localhost') || hostname.includes('127.0.0.1')
    ? `${protocol}//api.${baseDomain}`
    : `https://api.${baseDomain}`;
  
  console.log('Resolved API URL:', apiUrl);
  return apiUrl;
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
  
  const parts = hostname.split('.');
  let baseDomain;
  
  if (parts.length >= 4) {
    baseDomain = parts.slice(-4).join('.');
  } else if (parts.length === 3) {
    baseDomain = hostname;
  } else {
    baseDomain = parts.length > 2 ? parts.slice(-3).join('.') : hostname;
  }
  
  const wsUrl = hostname.includes('localhost') || hostname.includes('127.0.0.1')
    ? `${wsProtocol}//api.${baseDomain}`
    : `wss://api.${baseDomain}`;
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
