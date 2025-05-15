import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";

export async function deleteTipoSitio(id: number): Promise<void> {
  await axiosInstance.delete(`/tipo-sitios/${id}`);
}

export function useDeleteTipoSitio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTipoSitio,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tiposSitio"] });
    },
  });
}
