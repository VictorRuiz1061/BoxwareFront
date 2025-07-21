import { usePutTipoMovimiento as useApiPutTipoMovimiento } from "@/api/tipoMovimiento";
import { TipoMovimiento } from "@/types";

export function usePutTipoMovimiento() {
  const put = useApiPutTipoMovimiento();
  const actualizarTipoMovimiento = async (id: number, data: TipoMovimiento) => put.mutateAsync({ ...data, id });
  return { actualizarTipoMovimiento };
}
