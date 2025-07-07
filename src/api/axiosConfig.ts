import axios from 'axios';

const TOKEN_KEY = 'token';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/',
  // Removemos el Content-Type por defecto para que axios lo maneje automáticamente
});

const getCookie = (key: string): string | null => {
  const match = document.cookie.match(new RegExp(`(^| )${key}=([^;]+)`));
  return match ? match[2] : null;
};

const clearCookie = (key: string) => {
  document.cookie = `${key}=; path=/; max-age=0; samesite=strict`;
};

// Agregar interceptor para loguear todas las peticiones
axiosInstance.interceptors.request.use((config) => {
  console.log('🚀 Petición saliente:', {
    url: config.url,
    method: config.method,
    data: config.data,
    headers: config.headers
  });
  
  const token = getCookie(TOKEN_KEY);
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  
  // Solo establecer Content-Type como application/json si no es FormData
  if (!(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }
  
  return config;
}, error => {
  console.error('❌ Error en petición:', error);
  return Promise.reject(error);
});

axiosInstance.interceptors.response.use(
  res => {
    console.log('✅ Respuesta recibida:', {
      url: res.config.url,
      status: res.status,
      data: res.data
    });
    return res;
  },
  err => {
    console.error('❌ Error en respuesta:', {
      url: err.config?.url,
      status: err.response?.status,
      data: err.response?.data,
      message: err.message
    });
    
    if (err.response?.status === 401) {
      clearCookie(TOKEN_KEY);
      window.location.href = '/iniciosesion';
    }
    return Promise.reject(err);
  }
);

export default axiosInstance;
