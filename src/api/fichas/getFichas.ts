import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Ficha } from "@/types/ficha";
import { extractArrayData } from "@/utils/responseHandler";

export async function getFichas(): Promise<Ficha[]> {
    const response = await axiosInstance.get("/fichas");
    return extractArrayData<Ficha>(response, 'getFichas');
}

export function useGetFichas() {
  return useQuery<Ficha[]>({
    queryKey: ["fichas"],
    queryFn: getFichas,
  });
} 
