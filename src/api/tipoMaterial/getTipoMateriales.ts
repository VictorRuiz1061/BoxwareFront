import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { TipoMaterial } from "@/types/tipoMaterial";
import { extractArrayData } from "@/utils/responseHandler";

export async function getTipoMateriales(): Promise<TipoMaterial[]> {
  console.log("Fetching tipoMateriales...");
  const response = await axiosInstance.get("/tipo-materiales");
  const data = extractArrayData<TipoMaterial>(response);
  console.log("Received tipoMateriales data:", data);
  return data;
}

export function useGetTipoMateriales() {
  return useQuery({
    queryKey: ["tipoMateriales"],
    queryFn: getTipoMateriales
  });
}
