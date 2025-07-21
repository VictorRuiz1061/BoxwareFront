import { usePutTipoMaterial as useApiPutTipoMaterial } from "@/api/tipoMaterial";
import { TipoMaterial } from "@/types";


export function usePutTipoMaterial() {
  const put = useApiPutTipoMaterial();
  const actualizarTipoMaterial = async (id: number, data: Partial<TipoMaterial>) => {
    return await put.mutateAsync({ ...data, id });
  };
  
  return { actualizarTipoMaterial };
}
