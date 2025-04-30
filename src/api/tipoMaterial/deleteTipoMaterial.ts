import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";

export async function deletetipoMaterial(id: number): Promise<void> {
  await axiosInstance.delete(`/tipoMateriales/${id}`);
}

export function useDeleteTipoMaterial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletetipoMaterial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tipoMateriales"] });
    },
  });
}
