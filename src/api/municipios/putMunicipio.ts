import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Municipio } from "@/types/municipio";

export interface MunicipioUpdate {
  id_municipio: number;
  // otros campos opcionales si es necesario
}

export async function putMunicipio(id: number, data: Omit<Municipio, 'id_municipio'>): Promise<Municipio> {
  const response = await axiosInstance.put(`/municipios/actualizar/${id}`, data);
  return response.data;
}

export function usePutMunicipio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id_municipio, ...data }: Municipio & { id_municipio: number }) => putMunicipio(id_municipio, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["municipios"] });
    },
  });
} 