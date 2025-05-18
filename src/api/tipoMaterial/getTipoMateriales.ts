import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { TipoMaterial } from "@/types/tipoMaterial";

export async function getTipoMateriales(): Promise<TipoMaterial[]> {
  const response = await axiosInstance.get("/tipo-materiales");
  return response.data;
}

export function useGetTipoMateriales() {
  return useQuery({
    queryKey: ["tipoMateriales"],
    queryFn: getTipoMateriales
  });
}
