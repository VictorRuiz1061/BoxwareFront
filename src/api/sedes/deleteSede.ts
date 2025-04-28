import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";

export async function deleteSede(id_sede: number): Promise<void> {
  await axiosInstance.delete(`/sedes/${id_sede}`);
}

export function useDeleteSede() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSede,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sedes"] });
    },
  });
} 