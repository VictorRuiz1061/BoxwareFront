/**
 * Utilidades para el manejo de imágenes en el frontend
 */

/**
 * Valida si una imagen es válida
 * @param file Archivo a validar
 * @returns Objeto con validación y mensaje de error
 */
export const validateImage = async (file: File): Promise<{ valid: boolean; error?: string }> => {
  // Validar tipo de archivo
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Formato de archivo no permitido. Solo se permiten: JPG, PNG, GIF, WebP'
    };
  }

  // Validar tamaño (50MB máximo)
  const maxSize = 50 * 1024 * 1024; // 50MB en bytes
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'El archivo es demasiado grande. Tamaño máximo: 50MB'
    };
  }

  return { valid: true };
};

/**
 * Crea una URL de vista previa para una imagen
 * @param file Archivo de imagen
 * @returns URL de vista previa
 */
export const createImagePreview = (file: File): string => {
  return URL.createObjectURL(file);
};

/**
 * Revoca una URL de vista previa para liberar memoria
 * @param url URL de vista previa a revocar
 */
export const revokeImagePreview = (url: string): void => {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
};

/**
 * Convierte una imagen a base64
 * @param file Archivo de imagen
 * @returns Promise con el string base64
 */
export const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

/**
 * Comprime una imagen antes de enviarla
 * @param file Archivo de imagen
 * @param maxWidth Ancho máximo (por defecto 1920)
 * @param quality Calidad de compresión (0-1, por defecto 0.8)
 * @returns Promise con el archivo comprimido
 */
export const compressImage = (
  file: File, 
  maxWidth: number = 1920, 
  quality: number = 0.8
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calcular nuevas dimensiones manteniendo la proporción
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      const newWidth = img.width * ratio;
      const newHeight = img.height * ratio;

      canvas.width = newWidth;
      canvas.height = newHeight;

      // Dibujar imagen redimensionada
      ctx?.drawImage(img, 0, 0, newWidth, newHeight);

      // Convertir a blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            reject(new Error('Error al comprimir la imagen'));
          }
        },
        file.type,
        quality
      );
    };

    img.onerror = () => reject(new Error('Error al cargar la imagen'));
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Obtiene la URL completa de una imagen
 * @param imagePath Ruta de la imagen
 * @param baseUrl URL base del servidor (opcional, solo si imagePath es relativo)
 * @returns URL completa de la imagen
 */
export const getImageUrl = (imagePath: string, baseUrl: string = ''): string => {
  if (!imagePath) return '/assets/default.jpg';
  
  // Si ya es una URL completa (http/https), devolverla tal como está
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Si es una ruta relativa que empieza con /, agregar la base URL
  if (imagePath.startsWith('/')) {
    return `${baseUrl}${imagePath}`;
  }
  
  // Si es una ruta relativa sin /, agregar la base URL y /
  return `${baseUrl}/${imagePath}`;
}; 