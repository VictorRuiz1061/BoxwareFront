import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { TipoMaterial } from "@/types/tipoMaterial";

export async function postTipoMaterial(data: TipoMaterial): Promise<TipoMaterial> {
  const response = await axiosInstance.post<TipoMaterial>('/tipo-materiales', data);
  return response.data;
}

export function usePostTipoMaterial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postTipoMaterial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tipoMateriales"] });
    },
  });
}
