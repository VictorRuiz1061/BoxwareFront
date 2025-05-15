import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { CategoriaElemento } from "@/types/categoriaElemento";

export async function putCategoriaElemento(params: { 
  id_categoria: number; 
  data: Partial<CategoriaElemento> 
}): Promise<CategoriaElemento> {
  const { id_categoria, data } = params;
  const response = await axiosInstance.put<CategoriaElemento>(
    `/categoria-elementos/${id_categoria}`,
    data
  );
  return response.data;
}

export function usePutCategoriaElemento() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putCategoriaElemento,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categoriasElementos"] });
    },
  });
}
