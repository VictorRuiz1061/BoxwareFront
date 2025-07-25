import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { TipoSitio } from "@/types/tipoSitio";
import { extractArrayData } from "@/utils/responseHandler";

export async function getTiposSitio(): Promise<TipoSitio[]> {
  const response = await axiosInstance.get("/tipo-sitios");
  return extractArrayData<TipoSitio>(response);
}

export function useGetTiposSitio() {
  return useQuery({
    queryKey: ["tiposSitio"],
    queryFn: getTiposSitio
  });
}
