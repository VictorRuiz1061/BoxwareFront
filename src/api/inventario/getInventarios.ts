import { useQuery } from "@tanstack/react-query";
import axiosInstance from '@/api/axiosConfig';
import { Inventario } from '@/types/inventario';
import { extractArrayData } from '@/utils/responseHandler';

export async function getInventarios(): Promise<Inventario[]> {
  const response = await axiosInstance.get("/inventario");
  return extractArrayData<Inventario>(response);
};

export function useGetInventarios() {
  return useQuery({
    queryKey: ["inventarios"],
    queryFn: getInventarios
  });
} 