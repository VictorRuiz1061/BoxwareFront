import { useGetAreas as useApiGetAreas } from "@/api/areas/getAreas";

export function useGetAreas() {
  const { data: areas = [], isLoading: loading } = useApiGetAreas();
  return { areas, loading };
} 