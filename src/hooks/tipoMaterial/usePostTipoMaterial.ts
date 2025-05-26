import { usePostTipoMaterial as useApiPostTipoMaterial } from "@/api/tipoMaterial/postTipoMaterial";
import { TipoMaterial } from "@/types/tipoMaterial";

export function usePostTipoMaterial() {
  const post = useApiPostTipoMaterial();
  const crearTipoMaterial = async (data: TipoMaterial) => { post.mutateAsync(data); };
  
  return { crearTipoMaterial };
}
