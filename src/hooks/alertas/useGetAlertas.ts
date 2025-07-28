import { useGetAlertas as useApiGetAlertas } from "@/api/alertas/getAlertas";

export function useGetAlertas() {
  const { data: alertas = [], isLoading: loading } = useApiGetAlertas();
  return { alertas, loading };
} 
