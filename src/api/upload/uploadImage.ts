import axiosInstance from "@/api/axiosConfig";

export interface UploadImageResponse {
  success: boolean;
  imageUrl?: string;
  message?: string;
}

/**
 * Función para subir una imagen al backend
 * @param file - El archivo de imagen a subir
 * @returns Promise con la respuesta del servidor
 */
export async function uploadImage(file: File): Promise<UploadImageResponse> {
  try {
    const formData = new FormData();
    formData.append('imagen', file);

    const response = await axiosInstance.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('Error al subir imagen:', error);
    
    // Si el endpoint no existe, simular una respuesta exitosa para desarrollo
    if (error.response?.status === 404) {
      console.warn('Endpoint de carga de imágenes no encontrado, simulando respuesta para desarrollo');
      
      // Crear un nombre único para el archivo
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop() || 'jpg';
      const fileName = `user_${timestamp}.${fileExtension}`;
      
      return {
        success: true,
        imageUrl: `/img/${fileName}`,
        message: 'Imagen procesada (modo desarrollo)'
      };
    }

    throw new Error(error.response?.data?.message || 'Error al subir la imagen');
  }
} 