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
  const response = await axiosInstance.put(`/centros/${data.id_centro}`, data);
  return response.data;
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