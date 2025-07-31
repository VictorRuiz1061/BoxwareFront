import axios from 'axios';
const TOKEN_KEY = 'token';

// Leer la base URL desde el .env y asegurar que no termine con "/"
const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/+$/, '');

const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Función para obtener cookies
const getCookie = (key: string): string | null => {
  const match = document.cookie.match(new RegExp(`(^| )${key}=([^;]+)`));
  return match ? match[2] : null;
};

// Función para borrar cookies
const clearCookie = (key: string) => {
  document.cookie = `${key}=; path=/; max-age=0; samesite=strict`;
};

// Interceptor para adjuntar token y headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getCookie(TOKEN_KEY);

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // Solo establecer Content-Type si no es FormData
    if (config.data && !(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de respuesta para manejar errores globales
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearCookie(TOKEN_KEY);
      window.location.href = '/iniciosesion'; // Redirigir al login si hay error 401
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
