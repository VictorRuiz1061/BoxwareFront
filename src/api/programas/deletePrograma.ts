import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";

export async function deletePrograma(id_programa: number): Promise<void> {
  await axiosInstance.delete(`/programa/${id_programa}`);
}

export function useDeletePrograma() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePrograma,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programas"] });
    },
  });
} 