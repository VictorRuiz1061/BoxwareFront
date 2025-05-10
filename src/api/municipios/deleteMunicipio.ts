import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";

export async function deleteMunicipio(id_municipio: number): Promise<void> {
  await axiosInstance.delete(`/municipios/${id_municipio}`);
}

export function useDeleteMunicipio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMunicipio,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["municipios"] });
    },
  });
} 