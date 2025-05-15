import { useGetSitios as useApiGetSitios } from "@/api/sitio/getSitios";

export function useGetSitios() {
  const { data: sitios = [], isLoading: loading } = useApiGetSitios();
  return { sitios, loading };
}
