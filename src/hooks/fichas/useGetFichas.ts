import { useGetFichas as useApiGetFichas } from "@/api/fichas";

export function useGetFichas() {
  const { data: fichas = [], isLoading: loading } = useApiGetFichas();
  return { fichas, loading };
}