import axiosInstance from "@/api/axiosConfig";

/**
 * Configuración para las imágenes en el frontend
 */

// URL base del servidor backend
export const API_BASE_URL = axiosInstance.defaults.baseURL || 'http://localhost:3000';

// URLs base para acceder a las imágenes (ahora el backend envía URLs completas)
export const IMAGE_BASE_URLS = {
  MATERIALES: `${API_BASE_URL}/img`,
  USUARIOS: `${API_BASE_URL}/img_usuarios`,
};

// Configuración de validación de imágenes
export const IMAGE_VALIDATION = {
  MAX_SIZE: 50 * 1024 * 1024, // 50MB
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  MAX_WIDTH: 1920,
  QUALITY: 0.8,
};

// Configuración de compresión de imágenes
export const IMAGE_COMPRESSION = {
  ENABLED: true,
  MAX_WIDTH: 1920,
  QUALITY: 0.8,
}; 