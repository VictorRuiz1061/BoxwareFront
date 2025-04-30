import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { CategoriaElemento } from "@/types/categoriaElemento";

export async function getTipoMaterial(): Promise<CategoriaElemento[]> {
  const response = await axiosInstance.get("/tipoMgetTipoMaterial");
  return response.data;
}

export function useGetTipoMaterial() {
  return useQuery<CategoriaElemento[]>({
    queryKey: ["tipoMgetTipoMaterial"],
    queryFn: getTipoMaterial,
  });
}
