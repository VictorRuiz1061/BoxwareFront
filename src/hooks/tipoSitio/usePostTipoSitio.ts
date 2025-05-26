import { usePostTipoSitio as useApiPostTipoSitio } from "@/api/tipoSitio/postTipoSitio";
import { TipoSitio } from "@/types/tipoSitio";

export function usePostTipoSitio() {
  const post = useApiPostTipoSitio();
  const crearTipoSitio = async (data: TipoSitio) => post.mutateAsync(data);
  return { crearTipoSitio };
}
