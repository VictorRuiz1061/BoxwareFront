import { usePutSitio as useApiPutSitio } from "@/api/sitio";
import { Sitio } from "@/types";

export function usePutSitio() {
  const put = useApiPutSitio();
  const actualizarSitio = async (id: number, data: Sitio) => put.mutateAsync({ ...data, id });
  return { actualizarSitio };
}
