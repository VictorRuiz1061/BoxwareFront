import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { CategoriaElemento } from "@/types/Elemento";
import { extractArrayData } from "@/utils/responseHandler";

export async function getCategoriasElementos(): Promise<CategoriaElemento[]> {
  console.log("Fetching categoriasElementos...");
  const response = await axiosInstance.get("/categoria-elementos");
  const data = extractArrayData<CategoriaElemento>(response);
  console.log("Received categoriasElementos data:", data);
  return data;
}

export function useGetCategoriasElementos() {
  return useQuery({
    queryKey: ["categoriasElementos"],
    queryFn: getCategoriasElementos
  });
}
