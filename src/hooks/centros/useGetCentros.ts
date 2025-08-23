import { useGetCentros as useApiGetCentros } from "@/api/centros";

export function useGetCentros() {
  const { data: centros = [], isLoading: loading } = useApiGetCentros();
  return { centros, loading };
}
