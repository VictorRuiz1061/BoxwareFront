import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Inventario } from "@/types";

export async function putInventario(data: Partial<Inventario> & { id: number }): Promise<Inventario> {
  const response = await axiosInstance.put(`/inventario/${data.id}`, data);
  return response.data;
}

export function usePutInventario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putInventario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventario"] });
    },
  });
}
