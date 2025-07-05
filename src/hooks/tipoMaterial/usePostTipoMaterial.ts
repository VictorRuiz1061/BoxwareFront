import { usePostTipoMaterial as useApiPostTipoMaterial } from "@/api/tipoMaterial";
import { TipoMaterial } from "@/types";


export function usePostTipoMaterial() {
  const post = useApiPostTipoMaterial();
  const crearTipoMaterial = async (data: Omit<TipoMaterial, 'id_tipo_material'>) => {
    return await post.mutateAsync({ ...data, id_tipo_material: 0 });
  };
  
  return { crearTipoMaterial };
}
