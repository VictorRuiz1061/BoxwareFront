import { usePutTipoSitio as useApiPutTipoSitio } from "@/api/tipoSitio";
import { TipoSitio } from "@/types";

export function usePutTipoSitio() {
  const put = useApiPutTipoSitio();
  const actualizarTipoSitio = async (id: number, data: TipoSitio) => put.mutateAsync({ ...data, id });
  return { actualizarTipoSitio };
}
