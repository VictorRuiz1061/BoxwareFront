import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";

export async function deleteFicha(id_ficha: number): Promise<void> {
  await axiosInstance.delete(`/fichas/${id_ficha}`);
}

export function useDeleteFicha() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteFicha,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fichas"] });
    },
  });
} 