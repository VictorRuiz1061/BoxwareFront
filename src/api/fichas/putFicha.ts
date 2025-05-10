import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Ficha } from "@/types/ficha";

export interface FichaUpdate {
  id_ficha: number;
  // otros campos opcionales si es necesario
}

export async function putFicha(id: number, data: Partial<Ficha>): Promise<Ficha> {
  const response = await axiosInstance.put(`/fichas/${id}`, data);
  return response.data;
}

export function usePutFicha() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id_ficha, ...data }: Ficha & { id_ficha: number }) => putFicha(id_ficha, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fichas"] });
    },
  });
} 