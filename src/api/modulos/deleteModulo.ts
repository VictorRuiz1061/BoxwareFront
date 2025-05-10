import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";

export async function deleteModulo(id: number): Promise<void> {
  await axiosInstance.delete(`/modulos/${id}`);
}

export function useDeleteModulo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteModulo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modulos"] });
    },
  });
} 