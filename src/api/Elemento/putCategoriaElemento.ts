import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { CategoriaElemento } from "@/types/categoriaElemento";

export async function putCategoriaElemento(data: Partial<CategoriaElemento> & { id: number }): Promise<CategoriaElemento> {
  const response = await axiosInstance.put(`/categoria-elementos/${data.id}`, data);
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
