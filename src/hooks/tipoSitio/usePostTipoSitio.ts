import { usePostTipoSitio as useApiPostTipoSitio } from "@/api/tipoSitio";
import { TipoSitio } from "@/types";

export function usePostTipoSitio() {
  const post = useApiPostTipoSitio();
  const crearTipoSitio = async (data: TipoSitio) => post.mutateAsync(data);
  return { crearTipoSitio };
}
