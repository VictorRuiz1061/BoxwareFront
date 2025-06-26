import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Sede } from "@/types/sede";
import { extractArrayData } from "@/utils/responseHandler";

export async function getSedes(): Promise<Sede[]> {
  const response = await axiosInstance.get("/sedes");
  return extractArrayData<Sede>(response, 'getSedes');
}

export function useGetSedes() {
  return useQuery<Sede[]>({
    queryKey: ["sedes"],
    queryFn: getSedes,
  });
} 