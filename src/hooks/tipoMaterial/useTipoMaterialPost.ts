import { usePostTipoMateriales } from "@/api/tipoMaterial/postTipoMateria";
import TipoMaterial from "@/components/pages/TipoMaterial";

export function useTipoMaterialPost() {
  const post = usePostTipoMateriales();

  const crearTipoMaterial = async (data: TipoMaterial) => post.mutateAsync(data);

  return { crearTipoMaterial };
}