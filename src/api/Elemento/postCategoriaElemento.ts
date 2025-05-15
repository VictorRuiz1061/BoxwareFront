import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { CategoriaElemento } from "@/types/categoriaElemento";

export async function postCategoriaElemento(
  categoria: Omit<CategoriaElemento, "id_categoria-elemento">
): Promise<CategoriaElemento> {
  const response = await axiosInstance.post<CategoriaElemento>(
    "/categoria-elementos/",
    categoria
  );
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
