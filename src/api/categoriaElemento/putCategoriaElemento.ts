import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { CategoriaElemento } from "@/types/categoriaElemento";

export interface CategoriaElementos {
  id_categoria_elemento: number;
  codigo_unpsc: string;
  nombre_categoria: string;
  fecha_creacion: string;
  fecha_modificacion: string;
}

export async function putCategoriaElementos(data: CategoriaElemento): Promise<CategoriaElemento> {
  const response = await axiosInstance.put(`/CategoriaElementos/${data.id_categoria_elemento}`, data);
  return response.data;
}

export function usePutCategoriaElementos() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putCategoriaElementos,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["CategoriaElementos"] });
    },
    onError: (error) => {
      console.error("Error al actualizar CategoriaElementos:", error);
    },
  });
}
