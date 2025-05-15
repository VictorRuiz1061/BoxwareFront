import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { TipoMaterial } from "@/types/tipoMaterial";

export async function postTipoMaterial(tipoMaterial: Omit<TipoMaterial, 'id_tipo_material'>): Promise<TipoMaterial> {
  const response = await axiosInstance.post<TipoMaterial>('/tipo-materiales', tipoMaterial);
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
