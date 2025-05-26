import { usePutTipoMaterial as useApiPutTipoMaterial } from "@/api/tipoMaterial/putTipoMaterial";
import { TipoMaterial } from "@/types/tipoMaterial";

export function usePutTipoMaterial() {
  const put = useApiPutTipoMaterial();
  const actualizarTipoMaterial = async (id: number, data: TipoMaterial) => put.mutateAsync({ ...data, id });
  
  return { actualizarTipoMaterial };
}
