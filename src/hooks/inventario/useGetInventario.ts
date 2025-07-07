import { useGetInventario as useApiGetInventario } from "@/api/inventario";

export function useGetInventario() {
  const { data: inventario = [], isLoading: loading } = useApiGetInventario();
  return { inventario, loading };
}