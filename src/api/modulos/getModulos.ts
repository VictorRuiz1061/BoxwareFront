import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Modulo } from "@/types/modulo";
import { extractArrayData } from "@/utils/responseHandler";

export async function getModulos(): Promise<Modulo[]> {
  const response = await axiosInstance.get("/modulos");
  return extractArrayData<Modulo>(response, 'getModulos');
}

export function useGetModulos() {
  return useQuery<Modulo[]>({
    queryKey: ["modulos"],
    queryFn: getModulos,
  });
} 
