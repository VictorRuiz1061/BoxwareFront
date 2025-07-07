import { useGetAreas as useApiGetAreas } from "@/api/areas";

export function useGetAreas() {
  const { data: areas = [], isLoading: loading } = useApiGetAreas();
  return { areas, loading };
} 
