import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Ficha } from "@/types/ficha";

export async function getFichas(): Promise<Ficha[]> {
    const response = await axiosInstance.get("/fichas");
    return response.data;
}

export function useGetFichas() {
  return useQuery<Ficha[]>({
    queryKey: ["fichas"],
    queryFn: getFichas,
  });
} 
