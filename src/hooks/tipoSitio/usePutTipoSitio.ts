import { usePutTipoSitio as useApiPutTipoSitio } from "@/api/tipoSitio/putTipoSitio";
import { TipoSitio } from "@/types/tipoSitio";

export function usePutTipoSitio() {
  const put = useApiPutTipoSitio();
  const actualizarTipoSitio = async (id: number, data: TipoSitio) => put.mutateAsync({ ...data, id });
  return { actualizarTipoSitio };
}
