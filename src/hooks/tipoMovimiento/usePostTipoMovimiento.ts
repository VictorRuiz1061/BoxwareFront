import { usePostTipoMovimiento as useApiPostTipoMovimiento } from "@/api/tipoMovimiento";
import { TipoMovimiento } from "@/types";

export function usePostTipoMovimiento() {
  const post = useApiPostTipoMovimiento();
  const crearTipoMovimiento = async (data: TipoMovimiento) => post.mutateAsync(data);
  return { crearTipoMovimiento };
}
