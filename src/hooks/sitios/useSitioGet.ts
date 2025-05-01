import { useGetSitios } from "@/api/sitio/getSitios";

export function useSitioGet() {
  const { data: Sitioes = [], isLoading: loading } = useGetSitios();
  return { Sitioes, loading };
}