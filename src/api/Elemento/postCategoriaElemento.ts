import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { CategoriaElemento } from "@/types/Elemento";

export async function postCategoriaElemento(data: CategoriaElemento): Promise<CategoriaElemento> {
  const response = await axiosInstance.post<CategoriaElemento>("/categoria-elementos/",data);
  return response.data;
}

export function usePostCategoriaElemento() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postCategoriaElemento,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categoriasElementos"] });
    },
  });
}
 