import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { TipoSitio } from "@/types/tipoSitio";

export async function postTipoSitio(data: TipoSitio): Promise<TipoSitio> {
  const response = await axiosInstance.post('/tipo-sitios', data);
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
