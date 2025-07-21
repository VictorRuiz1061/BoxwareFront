import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { TipoMaterial } from "@/types/tipoMaterial";

export async function putTipoMaterial(data: Partial<TipoMaterial> & { id: number }): Promise<TipoMaterial> {
  const response = await axiosInstance.put<TipoMaterial>(`/tipo-materiales/${data.id}`, data);
  return response.data;
}

export function usePutTipoMaterial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putTipoMaterial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tipoMateriales"] });
    },
  });
}
