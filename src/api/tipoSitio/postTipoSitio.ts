import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { TipoSitio } from "@/types/tipoSitio";

export async function postTipoSitio(tipoSitio: Omit<TipoSitio, 'id_tipo_sitio'>): Promise<TipoSitio> {
  const response = await axiosInstance.post<TipoSitio>('/tipo-sitios', tipoSitio);
  return response.data;
}

export function usePostTipoSitio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postTipoSitio,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tiposSitio"] });
    },
  });
}
