import axiosInstance from '../axiosConfig';
import { ChangePasswordData, ChangePasswordResponse } from '@/types/auth';

export const cambiarContrasena = async (data: ChangePasswordData): Promise<ChangePasswordResponse> => {
  try {
    // Validar que las contraseñas coincidan antes de enviar al servidor
    if (data.nuevaContrasena !== data.confirmarContrasena) {
      throw new Error('La nueva contraseña y la confirmación no coinciden');
    }

    // Validar longitud de la contraseña
    if (data.nuevaContrasena.length < 6 || data.nuevaContrasena.length > 50) {
      throw new Error('La nueva contraseña debe tener entre 6 y 50 caracteres');
    }

    // Validar complejidad de la contraseña
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(data.nuevaContrasena)) {
      throw new Error(
        'La nueva contraseña debe contener al menos una letra mayúscula, una minúscula y un número'
      );
    }

    // Hacer la petición al backend
    const response = await axiosInstance.post<{ data: ChangePasswordResponse }>('/cambiar-contrasena', data);
    
    // Retornar el mensaje de éxito
    return response.data.data;
  } catch (error: any) {
    // Si es un error de Axios, extraer el mensaje de error del backend
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Error al cambiar la contraseña');
    }
    // Si es un error local (validaciones del frontend)
    throw error;
  }
};
