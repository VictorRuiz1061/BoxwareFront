import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Inventario } from "@/types";
import { extractArrayData } from "@/utils/responseHandler";

export async function getInventario(): Promise<Inventario[]> {
    const response = await axiosInstance.get("/inventario");
    return extractArrayData<Inventario>(response, 'getInventario');
}

export function useGetInventario() {
  return useQuery<Inventario[]>({
    queryKey: ["inventario"],
    queryFn: getInventario,
  });
} 
