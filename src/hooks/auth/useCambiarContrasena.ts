import { useState } from 'react';
import { cambiarContrasena as cambiarContrasenaAPI } from '@/api/auth/cambiarContraseña';
import { ChangePasswordData } from '@/types/auth';

/**
 * Hook personalizado para gestionar el cambio de contraseña
 * @returns Funciones y estado para el cambio de contraseña
 */
export const useCambiarContrasena = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  /**
   * Cambia la contraseña del usuario autenticado
   * @param data Datos para el cambio de contraseña
   * @returns Promesa con el resultado de la operación
   */
  const cambiarContrasena = async (data: ChangePasswordData): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // Validar que las contraseñas coincidan
      if (data.nuevaContrasena !== data.confirmarContrasena) {
        throw new Error('La nueva contraseña y la confirmación no coinciden');
      }

      const response = await cambiarContrasenaAPI(data);
      setSuccess(response.message);
      return true;
    } catch (error: any) {
      setError(error.message || 'Error al cambiar la contraseña');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    cambiarContrasena,
    loading,
    error,
    success,
    clearError: () => setError(null),
    clearSuccess: () => setSuccess(null)
  };
};
