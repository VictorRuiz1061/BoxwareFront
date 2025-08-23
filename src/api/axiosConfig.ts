import axios from 'axios';
const TOKEN_KEY = 'token';

// Leer la base URL desde el .env y asegurar que no termine con "/"
const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/+$/, '');

const axiosInstance = axios.create({
  baseURL: API_URL,
});

// ==== Cookie helpers (exportados) ====
export type CookieOptions = {
  path?: string;
  maxAge?: number; // seconds
  sameSite?: 'strict' | 'lax' | 'none';
  secure?: boolean;
};

const defaultCookieOptions: Required<CookieOptions> = {
  path: '/',
  maxAge: 60 * 60 * 24 * 30,
  sameSite: 'strict',
  secure: false,
};

export const setCookie = (key: string, value: string, options: CookieOptions = {}) => {
  const opts = { ...defaultCookieOptions, ...options };
  const parts = [
    `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    `path=${opts.path}`,
    `max-age=${opts.maxAge}`,
    `samesite=${opts.sameSite}`,
  ];
  if (opts.secure) parts.push('secure');
  document.cookie = parts.join('; ');
};

export const getCookie = (key: string): string | null => {
  const name = encodeURIComponent(key) + '=';
  const cookies = document.cookie ? document.cookie.split('; ') : [];
  for (const c of cookies) {
    if (c.startsWith(name)) {
      return decodeURIComponent(c.substring(name.length));
    }
  }
  return null;
};

export const deleteCookie = (key: string, path: string = '/') => {
  document.cookie = `${encodeURIComponent(key)}=; path=${path}; max-age=0; samesite=strict`;
};

export const setJsonCookie = (key: string, obj: unknown, options?: CookieOptions) => {
  setCookie(key, JSON.stringify(obj), options);
};

export const getJsonCookie = <T = unknown>(key: string): T | null => {
  const val = getCookie(key);
  if (!val) return null;
  try {
    return JSON.parse(val) as T;
  } catch {
    return null;
  }
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
      deleteCookie(TOKEN_KEY);
      window.location.href = '/iniciosesion'; // Redirigir al login si hay error 401
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
