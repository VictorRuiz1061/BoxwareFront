import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Municipio } from "@/types/municipio";

export interface MunicipioUpdate {
  id_municipio: number;
  nombre_municipio?: string;
  estado?: boolean;
  fecha_creacion?: string;
  fecha_modificacion?: string;
}

export async function putMunicipio(id: number, data: Partial<Omit<Municipio, 'id_municipio'>>): Promise<Municipio> {
  try {
    const response = await axiosInstance.put(`/municipios/${id}`, data);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      const response = await axiosInstance.patch(`/municipios/${id}`, data);
      return response.data;
    }
    throw error;
  }
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