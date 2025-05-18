import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Sitio } from "@/types/sitio";

export async function getSitios(): Promise<Sitio[]> {
  const response = await axiosInstance.get("/sitios");
  return response.data;
}

export function useGetSitios() {
  return useQuery({
    queryKey: ["sitios"],
    queryFn: getSitios
  });
}
