import { useGetSitios as useApiGetSitios } from "@/api/sitio";

export function useGetSitios() {
  const { data: sitios = [], isLoading: loading } = useApiGetSitios();
  return { sitios, loading };
}
