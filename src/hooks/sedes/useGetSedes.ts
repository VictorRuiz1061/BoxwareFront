import { useGetSedes as useApiGetSedes } from "@/api/sedes";

export function useGetSedes() {
  const { data: sedes = [], isLoading: loading } = useApiGetSedes();
  return { sedes, loading };
}
