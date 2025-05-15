import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Ficha } from "@/types/ficha";

// Modificando para permitir id_ficha opcional
export interface NuevaFicha {
  id_ficha?: number; // Opcional para creación, el backend podría generarlo
  estado: boolean;
  fecha_creacion: string;
  fecha_modificacion: string;
  usuario_id: number;
  programa_id: number | null;
}

export async function postFicha(data: NuevaFicha): Promise<Ficha> {
  try {
    console.log('Enviando datos a /fichas:', data);
    // Verificar que el token JWT esté presente en los headers
    const token = localStorage.getItem('token');
    console.log('Token JWT disponible:', !!token);
    
    // Asegurar que axiosInstance tenga el token en los headers
    if (token) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await axiosInstance.post("/fichas", data);
    console.log('Respuesta exitosa del servidor:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error detallado al crear ficha:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    });
    throw error;
  }
}

export function usePostFicha() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postFicha,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fichas"] });
    },
  });
} 