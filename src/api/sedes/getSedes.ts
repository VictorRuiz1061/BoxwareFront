import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Sede } from "@/types/sede";

export async function getSedes(): Promise<Sede[]> {
  const response = await axiosInstance.get("/sedes");
  return response.data;
}

export function useGetSedes() {
  return useQuery<Sede[]>({
    queryKey: ["sedes"],
    queryFn: getSedes,
  });
} 