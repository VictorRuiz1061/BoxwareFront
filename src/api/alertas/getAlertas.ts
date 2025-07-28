import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Alerta } from "@/types/alerta";
import { extractArrayData } from "@/utils/responseHandler";

export async function getAlertas(estado?: string): Promise<Alerta[]> {
  const params = estado ? { estado } : {};
  const response = await axiosInstance.get("/alertas", { params });
  return extractArrayData<Alerta>(response);
}

export function useGetAlertas(estado?: string) {
  return useQuery<Alerta[]>({
    queryKey: ["alertas", estado],
    queryFn: () => getAlertas(estado),
  });
}
