import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";

export async function deleteTipoMaterial(id: number): Promise<void> {
  await axiosInstance.delete(`/tipo-materiales/${id}`);
}

export function useDeleteTipoMaterial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTipoMaterial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tipoMateriales"] });
    },
  });
}
