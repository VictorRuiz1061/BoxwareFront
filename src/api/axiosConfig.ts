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
    return localToken;
  }
  
  // Fallback to cookie if not in localStorage
  return getTokenFromCookie();
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
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API request error:', error.response?.status, error.message);
    if (error.response?.status === 401) {
      console.warn('Unauthorized access - token may be invalid or expired');
      // Could redirect to login page here if needed
    }
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getTokenFromCookie();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Eliminar la cookie del token
      const removeTokenCookie = () => {
        document.cookie = 'token=; path=/; max-age=0; samesite=strict';
        document.cookie = 'token=; max-age=0; samesite=strict';
      };
      removeTokenCookie();
      // Redirigir al usuario a la página de inicio de sesión
      window.location.href = '/iniciosesion';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
