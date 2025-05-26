import { usePutSitio as useApiPutSitio } from "@/api/sitio/putSitio";
import { Sitio } from "@/types/sitio";

export function usePutSitio() {
  const put = useApiPutSitio();
  const actualizarSitio = async (id: number, data: Sitio) => put.mutateAsync({ ...data, id });
  return { actualizarSitio };
}
