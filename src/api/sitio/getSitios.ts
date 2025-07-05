import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Sitio } from "@/types/sitio";
import { extractArrayData } from "@/utils/responseHandler";

export async function getSitios(): Promise<Sitio[]> {
  const response = await axiosInstance.get("/sitios");
  return extractArrayData<Sitio>(response, 'getSitios');
}

export function useGetSitios() {
  return useQuery({
    queryKey: ["sitios"],
    queryFn: getSitios
  });
}
