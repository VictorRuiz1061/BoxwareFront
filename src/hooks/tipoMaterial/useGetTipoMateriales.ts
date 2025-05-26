import { useGetTipoMateriales as useApiGetTipoMateriales } from "@/api/tipoMaterial/getTipoMateriales";

export function useGetTipoMateriales() {
  const { data: tipoMateriales = [], isLoading: loading } = useApiGetTipoMateriales();
  return { tipoMateriales, loading };
}
