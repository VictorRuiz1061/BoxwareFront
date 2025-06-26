import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Ficha } from "@/types/ficha";

export async function putFicha(data: Partial<Ficha> & { id: number }): Promise<Ficha> {
  const response = await axiosInstance.put(`/fichas/${data.id}`, data);
  return response.data;
}

export function usePutFicha() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putFicha,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fichas"] });
    },
  });
}
