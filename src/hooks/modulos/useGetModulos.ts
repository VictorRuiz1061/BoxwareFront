import { useGetModulos as useApiGetModulos } from "@/api/modulos/getModulos";

export function useGetModulos() {
  const { data: modulos = [], isLoading: loading } = useApiGetModulos();
  return { modulos, loading };
} 