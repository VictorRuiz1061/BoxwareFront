import { useGetCaracteristicas as useApiGetCaracteristicas } from "@/api/caracteristicas";

export function useGetCaracteristicas() {
  const { data: caracteristicas = [], isLoading: loading } = useApiGetCaracteristicas();
  return { caracteristicas, loading };
}