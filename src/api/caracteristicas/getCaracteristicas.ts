import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Caracteristica } from "@/types";
import { extractArrayData } from "@/utils/responseHandler";

export async function getCaracteristicas(): Promise<Caracteristica[]> {
  const response = await axiosInstance.get("/caracteristicas");
  return extractArrayData<Caracteristica>(response);
}

export function useGetCaracteristicas() {
  return useQuery<Caracteristica[]>({
    queryKey: ["Caracteristicas"],
    queryFn: getCaracteristicas,
  });
}
