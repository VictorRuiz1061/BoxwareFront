import { usePutTipoMovimiento as useApiPutTipoMovimiento } from "@/api/tipoMovimiento/putTipoMovimiento";
import { TipoMovimiento } from "@/types/tipoMovimiento";

export function usePutTipoMovimiento() {
  const put = useApiPutTipoMovimiento();
  const actualizarTipoMovimiento = async (id: number, data: TipoMovimiento) => put.mutateAsync({ ...data, id });
  return { actualizarTipoMovimiento };
}
