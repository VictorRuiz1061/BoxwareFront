import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { TipoSitio } from "@/types/tipoSitio";

export async function putTipoSitio(params: { id: number; data: Partial<TipoSitio> }): Promise<TipoSitio> {
  const { id, data } = params;
  const response = await axiosInstance.put<TipoSitio>(`/tipo-sitios/${id}`, data);
  return response.data;
}

export function usePutTipoSitio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putTipoSitio,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tiposSitio"] });
    },
  });
}
