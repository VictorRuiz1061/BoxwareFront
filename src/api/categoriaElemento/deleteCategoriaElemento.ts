import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";

export async function deletecategoriaElemento(id: number): Promise<void> {
  await axiosInstance.delete(`/categoriaElementos/${id}`);
}

export function useDeletecategoriaElemento() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletecategoriaElemento,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categoriaElementos"] });
    },
    onError: (error) => {
      console.error("Error al eliminar categoriaElemento:", error);
    },
  });
}
