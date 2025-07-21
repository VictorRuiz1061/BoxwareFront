/**
 * Utilidad para manejar la carga de imágenes
 * Envía las imágenes al backend para que las guarde en la carpeta public
 */

import { uploadImage } from '@/api';

export interface ImageUploadResult {
  success: boolean;
  imagePath?: string;
  error?: string;
}

/**
 * Función para enviar una imagen al backend para que la guarde
 * @param file - El archivo de imagen a enviar
 * @returns Promise con el resultado de la operación
 */
export const saveImageToAssets = async (file: File): Promise<ImageUploadResult> => {
  try {
    // Validar que sea un archivo de imagen
    if (!file.type.startsWith('image/')) {
      return {
        success: false,
        error: 'El archivo debe ser una imagen válida'
      };
    }

    // Validar el tamaño del archivo (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        success: false,
        error: 'El archivo es demasiado grande. Máximo 5MB permitido.'
      };
    }

    // Usar la nueva API de carga de imágenes
    const result = await uploadImage(file);
    
    if (result.success && result.imageUrl) {
      return {
        success: true,
        imagePath: result.imageUrl
      };
    } else {
      return {
        success: false,
        error: result.message || 'Error al procesar la imagen en el servidor'
      };
    }
  } catch (error) {
    console.error('Error al enviar la imagen:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido al enviar la imagen'
    };
  }
};

/**
 * Función para validar una imagen antes de subirla
 * @param file - El archivo a validar
 * @returns Promise con el resultado de la validación
 */
export const validateImage = async (file: File): Promise<{ valid: boolean; error?: string }> => {
  // Validar tipo de archivo
  if (!file.type.startsWith('image/')) {
    return {
      valid: false,
      error: 'El archivo debe ser una imagen válida'
    };
  }

  // Validar tamaño (máximo 5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'El archivo es demasiado grande. Máximo 5MB permitido.'
    };
  }

  // Validar dimensiones de la imagen
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      
      // Validar dimensiones mínimas y máximas
      const minWidth = 100;
      const minHeight = 100;
      const maxWidth = 2048;
      const maxHeight = 2048;

      if (img.width < minWidth || img.height < minHeight) {
        resolve({
          valid: false,
          error: `La imagen debe tener al menos ${minWidth}x${minHeight} píxeles`
        });
      } else if (img.width > maxWidth || img.height > maxHeight) {
        resolve({
          valid: false,
          error: `La imagen no debe exceder ${maxWidth}x${maxHeight} píxeles`
        });
      } else {
        resolve({ valid: true });
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({
        valid: false,
        error: 'No se pudo cargar la imagen para validación'
      });
    };

    img.src = url;
  });
};

/**
 * Función para crear una vista previa de la imagen
 * @param file - El archivo de imagen
 * @returns Promise con la URL de la vista previa
 */
export const createImagePreview = (file: File): string => {
  return URL.createObjectURL(file);
};

/**
 * Función para limpiar la URL de vista previa
 * @param url - La URL a limpiar
 */
export const revokeImagePreview = (url: string): void => {
  URL.revokeObjectURL(url);
}; 