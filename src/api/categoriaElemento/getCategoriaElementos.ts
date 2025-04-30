import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { CategoriaElemento } from "@/types/categoriaElemento";

export async function getCategoriaElemento(): Promise<CategoriaElemento[]> {
  const response = await axiosInstance.get("/CategoriaElementos");
  return response.data;
}

export function useGetCategoriaElemento() {
  return useQuery<CategoriaElemento[]>({
    queryKey: ["CategoriaElemento"],
    queryFn: getCategoriaElemento,
  });
}