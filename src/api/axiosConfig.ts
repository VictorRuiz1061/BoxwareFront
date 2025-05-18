import axios from 'axios';

export function getTokenFromCookie() {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; token=`);
  if (parts.length === 2) {
    const result = parts.pop()?.split(';').shift();
    console.log('[getTokenFromCookie] Token leído de las cookie');
    return result || null;
  }
  console.log('[getTokenFromCookie] No se encontró token en cookie');
  return null;
}

export function getToken() {
  // Try to get token from localStorage first (as mentioned in the memory)
  const localToken = localStorage.getItem('token');
  if (localToken) {
    console.log('[getToken] Token encontrado en localStorage');
    return localToken;
  }
  
  // Fallback to cookie if not in localStorage
  const cookieToken = getTokenFromCookie();
  if (cookieToken) {
    console.log('[getToken] Token encontrado en cookie');
    return cookieToken;
  }
  
  console.log('[getToken] No se encontró token en ninguna fuente');
  return null;
}

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the JWT token in all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('[axios] Token agregado a los headers:', config.url);
    } else {
      console.warn('[axios] No hay token disponible para:', config.url);
    }
    
    // Log the request payload for debugging
    if (config.data) {
      console.log('[axios] Request payload:', config.data);
    }
    
    return config;
  },
  (error) => {
    console.error('[axios] Error en interceptor de request:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('[axios] Respuesta exitosa:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('[axios] Error en respuesta:', error.response?.status, error.message);
    
    if (error.response?.data) {
      console.error('[axios] Detalles del error:', error.response.data);
    }
    
    if (error.response?.status === 401) {
      console.warn('[axios] Unauthorized access - token may be invalid or expired');
      // Eliminar token de localStorage
      localStorage.removeItem('token');
      
      // Eliminar token de cookie
      document.cookie = 'token=; path=/; max-age=0; samesite=strict';
      document.cookie = 'token=; max-age=0; samesite=strict';
      
      // Redirigir al usuario a la página de inicio de sesión
      window.location.href = '/iniciosesion';
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
