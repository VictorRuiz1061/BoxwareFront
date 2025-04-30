import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { TipoMaterial } from "@/types/tipoMaterial";

export async function postTipoMateriales(data: TipoMaterial): Promise<TipoMaterial> {
  const response = await axiosInstance.post("/tipoMateriales", data);
  return response.data;
}

export function usePostTipoMateriales() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postTipoMateriales,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tipoMateriales"] });
    },
    onError: (error) => {
      console.error("Error al crear TipoMateriales:", error);
    },
  });
}
