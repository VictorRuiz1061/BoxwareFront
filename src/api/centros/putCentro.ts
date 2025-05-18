import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Centro } from "@/types/centro";

export interface CentroUpdate {
  id_centro: number;
  nombre_centro?: string;
  estado?: boolean;
  fecha_modificacion?: string;
  municipio_id?: number;
  codigo_centro?: string;
  // otros campos opcionales si es necesario
}

export async function putCentro(data: CentroUpdate): Promise<Centro> {
  try {
    console.log(`Intentando PUT a /centros/${data.id_centro}`, data);
    const response = await axiosInstance.put(`/centros/${data.id_centro}`, data);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      // Si falla con 404, intentar con PATCH en lugar de PUT
      console.log(`Intentando PATCH a /centros/${data.id_centro}`, data);
      const response = await axiosInstance.patch(`/centros/${data.id_centro}`, data);
      return response.data;
    }
    throw error;
  }
}

export function usePutCentro() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putCentro,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["centros"] });
    },
  });
} 