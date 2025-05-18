import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { TipoSitio } from "@/types/tipoSitio";

export async function getTiposSitio(): Promise<TipoSitio[]> {
  const response = await axiosInstance.get("/tipo-sitios");
  return response.data;
}

export function useGetTiposSitio() {
  return useQuery({
    queryKey: ["tiposSitio"],
    queryFn: getTiposSitio
  });
}
