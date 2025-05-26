import { useGetTiposSitio as useApiGetTiposSitio } from "@/api/tipoSitio/getTiposSitio";

export function useGetTiposSitio() {
  const { data: tiposSitio = [], isLoading: loading } = useApiGetTiposSitio();
  return { tiposSitio, loading };
}
