import { useGetTiposMovimiento as useApiGetTiposMovimiento } from "@/api/tipoMovimiento";


export function useGetTiposMovimiento() {
  const { data: tiposMovimiento = [], isLoading: loading } = useApiGetTiposMovimiento();
  return { tiposMovimiento, loading };
}
