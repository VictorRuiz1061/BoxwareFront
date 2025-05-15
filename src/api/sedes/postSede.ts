import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Sede } from "@/types/sede";

export interface NuevaSede {
  // Para creación, id_sede puede ser opcional ya que el backend podría generarlo automáticamente
  id_sede?: number;
  nombre_sede: string;
  direccion_sede: string;
  fecha_creacion: string;
  fecha_modificacion: string;
  centro_id: number;
  estado: boolean;
}

export async function postSede(data: NuevaSede): Promise<Sede> {
  try {
    console.log('Datos enviados al servidor:', data);
    const response = await axiosInstance.post("/sedes", data);
    console.log('Respuesta del servidor:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error detallado:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    });
    throw error;
  }
}

export function usePostSede() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postSede,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sedes"] });
    },
  });
} 