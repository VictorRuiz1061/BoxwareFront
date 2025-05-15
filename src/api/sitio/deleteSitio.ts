import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";

export async function deleteSitio(id: number): Promise<void> {
  await axiosInstance.delete(`/sitios/${id}`);
}

export function useDeleteSitio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSitio,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sitios"] });
    },
  });
}
