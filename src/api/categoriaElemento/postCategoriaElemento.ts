import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { CategoriaElemento } from "@/types/categoriaElemento";

export async function postCategoriaElemento(data: CategoriaElemento): Promise<CategoriaElemento> {
  const response = await axiosInstance.post("/CategoriaElementos", data);
  return response.data;
}

export function usePostCategoriaElemento() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postCategoriaElemento,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["CategoriaElementos"] });
    },
    onError: (error) => {
      console.error("Error al crear sitio:", error);
    },
  });
}
