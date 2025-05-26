import { useGetCentros as useApiGetCentros } from "@/api/centros/getCentros";

export function useGetCentros() {
  const { data: centros = [], isLoading: loading } = useApiGetCentros();
  return { centros, loading };
}
