import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { TipoMaterial } from "@/types/tipoMaterial";
import { extractArrayData } from "@/utils/responseHandler";

export async function getTipoMateriales(): Promise<TipoMaterial[]> {
  const response = await axiosInstance.get("/tipo-materiales");
  return extractArrayData<TipoMaterial>(response);
}

export function useGetTipoMateriales() {
  return useQuery({
    queryKey: ["tipoMateriales"],
    queryFn: getTipoMateriales
  });
}
