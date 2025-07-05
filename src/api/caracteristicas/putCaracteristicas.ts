import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Caracteristica } from "@/types";

export async function putCaracteristica(data: Partial<Caracteristica> & { id: number }): Promise<Caracteristica> {
    const response = await axiosInstance.put(`/caracteristicas/${data.id}`, data);
    // Handle nested data structure: response.data.data contains the actual caracteristica
    return response.data.data?.data || response.data.data || response.data;
}

export function usePutCaracteristica() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putCaracteristica,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["caracteristicas"] });
    },
  });
}
