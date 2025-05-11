import { useGetTiposMovimiento as useApiGetTiposMovimiento } from "@/api/tipoMovimiento/getTiposMovimiento";

export function useGetTiposMovimiento() {
  const { data: tiposMovimiento = [], isLoading: loading } = useApiGetTiposMovimiento();
  return { tiposMovimiento, loading };
}
