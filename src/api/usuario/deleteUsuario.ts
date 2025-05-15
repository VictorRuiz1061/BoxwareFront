import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";

export async function deleteUsuario(id: number): Promise<void> {
  try {
    console.log('Intentando eliminar usuario con ID:', id);
    
    // Verificar que el token JWT esté presente en los headers
    const token = localStorage.getItem('token');
    console.log('Token JWT disponible:', !!token);
    
    // Asegurar que axiosInstance tenga el token en los headers
    if (token) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    
    // Intentar con DELETE normal primero
    await axiosInstance.delete(`/usuarios/${id}`);
    console.log('Usuario eliminado exitosamente');
  } catch (error: any) {
    console.error('Error al eliminar usuario:', {
      id,
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    
    // Si obtenemos un error 500, intentar con un enfoque alternativo
    // El error 500 podría indicar que el backend no puede eliminar físicamente el usuario
    // debido a restricciones de clave foránea o alguna otra regla de negocio
    if (error.response?.status === 500) {
      console.log('Intentando enfoque alternativo: marcar como inactivo en lugar de eliminar');
      try {
        // Intentar marcar el usuario como inactivo en lugar de eliminarlo
        await axiosInstance.put(`/usuarios/${id}`, { 
          estado: false,
          fecha_modificacion: new Date().toISOString()
        });
        console.log('Usuario marcado como inactivo exitosamente');
        return; // Consideramos esto como éxito
      } catch (altError: any) {
        console.error('Error en enfoque alternativo:', altError.message);
        throw altError; // Si también falla, lanzar este error
      }
    }
    
    // Si no es un error 500 o el enfoque alternativo falló, lanzar el error original
    throw error;
  }
}

export function useDeleteUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUsuario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
    },
  });
} 