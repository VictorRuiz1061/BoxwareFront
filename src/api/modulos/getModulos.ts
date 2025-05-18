import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Modulo } from "@/types/modulo";

export async function getModulos(): Promise<Modulo[]> {
  const response = await axiosInstance.get("/modulos");
  return response.data;
}

export function useGetModulos() {
  return useQuery<Modulo[]>({
    queryKey: ["modulos"],
    queryFn: getModulos,
  });
} 
