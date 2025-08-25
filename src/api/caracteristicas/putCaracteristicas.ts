import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Caracteristica } from "@/types";

export async function putCaracteristicas(data: Partial<Caracteristica> & { id: number }): Promise<Caracteristica> {
    const response = await axiosInstance.put(`/caracteristicas/${data.id}`, data);
    return response.data;
}

export function usePutCaracteristicas() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putCaracteristicas,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["caracteristica"] });
    },
  });
}
