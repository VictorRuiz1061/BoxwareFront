import { useGetTipoMateriales as useApiGetTipoMateriales } from "@/api/tipoMaterial";

export function useGetTipoMateriales() {
  const { data: tipoMateriales = [], isLoading: loading } = useApiGetTipoMateriales();
  return { tipoMateriales, loading };
}
