import { usePutSitio } from "@/api/sitio/putSitio";
import { SitioUpdate } from "@/api/sitio/putSitio";

export function useSitioPut() {
  const put = usePutSitio();

  const actualizarSitio = async (id: number, data: SitioUpdate) =>
    put.mutateAsync({ ...data, id_sitio: id });

  return { actualizarSitio };
}