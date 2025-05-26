import { usePostTipoMovimiento as useApiPostTipoMovimiento } from "@/api/tipoMovimiento/postTipoMovimiento";
import { TipoMovimiento } from "@/types/tipoMovimiento";

export function usePostTipoMovimiento() {
  const post = useApiPostTipoMovimiento();
  const crearTipoMovimiento = async (data: TipoMovimiento) => post.mutateAsync(data);
  return { crearTipoMovimiento };
}
