import { useGetSedes as useApiGetSedes } from "@/api/sedes/getSedes";

export function useGetSedes() {
  const { data: sedes = [], isLoading: loading } = useApiGetSedes();
  return { sedes, loading };
} 