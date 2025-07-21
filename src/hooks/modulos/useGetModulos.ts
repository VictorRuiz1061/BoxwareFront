import { useGetModulos as useApiGetModulos } from "@/api/modulos";

export function useGetModulos() {
  const { data, isLoading: loading } = useApiGetModulos();
  const modulos = Array.isArray(data) ? data : [];
  return { modulos, loading };
}