import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";

export async function deleteCentro(id_centro: number): Promise<void> {
  await axiosInstance.delete(`/centros/${id_centro}`);
}

export function useDeleteCentro() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCentro,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["centros"] });
    },
  });
} 