import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { TipoSitio } from "@/types/tipoSitio";

export async function putTipoSitio(data: Partial<TipoSitio> & { id: number }): Promise<TipoSitio> {
  const response = await axiosInstance.put(`/tipo-sitios/${data.id}`, data);
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
