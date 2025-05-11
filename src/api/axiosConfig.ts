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

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/',
  headers: {
    'Content-Type': 'application/json',
  },
});

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
