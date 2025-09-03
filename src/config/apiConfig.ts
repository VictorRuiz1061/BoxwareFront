/**
 * Configuración de la API
 */

// URL base de la API
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// URLs para recursos estáticos
export const STATIC_URLS = {
  // URL base para imágenes de materiales
  MATERIAL_IMAGES: `${API_URL}/img`,
  
  // URL base para imágenes de usuarios
  USER_IMAGES: `${API_URL}/img_usuarios`,
  
  // URL para imagen por defecto (local)
  DEFAULT_IMAGE: 'assets/default.jpg'
};
