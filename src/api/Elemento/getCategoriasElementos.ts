import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { CategoriaElemento } from "@/types/Elemento";
import { extractArrayData } from "@/utils/responseHandler";

export async function getCategoriasElementos(): Promise<CategoriaElemento[]> {
  const response = await axiosInstance.get("/categoria-elementos");
  return extractArrayData<CategoriaElemento>(response);
}

export function useGetCategoriasElementos() {
  return useQuery({
    queryKey: ["categoriasElementos"],
    queryFn: getCategoriasElementos
  });
}
