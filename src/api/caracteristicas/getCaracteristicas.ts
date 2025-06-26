import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Caracteristica } from "@/types";
import { extractArrayData } from "@/utils/responseHandler";

export async function getCaracteristicas(): Promise<Caracteristica[]> {
  const response = await axiosInstance.get("/caracteristicas");
  return extractArrayData<Caracteristica>(response, 'getCaracteristicas');
}

export async function getCaracteristicasByMaterial(materialId: number): Promise<Caracteristica[]> {
  const response = await axiosInstance.get(`/materiales/${materialId}`);
  return extractArrayData<Caracteristica>(response, 'getCaracteristicasByMaterial');
}

export function useGetCaracteristicas() {
  return useQuery<Caracteristica[]>({
    queryKey: ["caracteristicas"],
    queryFn: getCaracteristicas,
  });
}

export function useGetCaracteristicasByMaterial(materialId: number | null) {
  return useQuery<Caracteristica[], Error>({
    queryKey: ["caracteristicas", "material", materialId],
    queryFn: () => materialId ? getCaracteristicasByMaterial(materialId) : Promise.resolve([]),
    enabled: !!materialId,
  });
}
