import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { CategoriaElemento } from "@/types/categoriaElemento";

export async function deleteCategoriaElemento(id_categoria: number): Promise<CategoriaElemento> {
  const response = await axiosInstance.delete<CategoriaElemento>(
    `/categoria-elementos/${id_categoria}`
  );
  return response.data;
}

export function useDeleteCategoriaElemento() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCategoriaElemento,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categoriasElementos"] });
    },
  });
}
