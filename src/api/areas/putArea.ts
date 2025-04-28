import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Area } from "@/types/area";

export interface AreaUpdate {
  id_area: number;
  nombre_area?: string;
  sede_id?: number | null;
  // otros campos opcionales si es necesario
}

export async function putArea(data: AreaUpdate): Promise<Area> {
  const response = await axiosInstance.put(`/areas/${data.id_area}`, data);
  return response.data;
}

export function usePutArea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putArea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["areas"] });
    },
  });
} 