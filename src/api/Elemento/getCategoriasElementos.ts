import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { CategoriaElemento } from "@/types/categoriaElemento";

export async function getCategoriasElementos(): Promise<CategoriaElemento[]> {
  const response = await axiosInstance.get<CategoriaElemento[]>("/categoria-elementos");
  return response.data;
}

export function useGetCategoriasElementos() {
  return useQuery({
    queryKey: ["categoriasElementos"],
    queryFn: getCategoriasElementos
  });
}
