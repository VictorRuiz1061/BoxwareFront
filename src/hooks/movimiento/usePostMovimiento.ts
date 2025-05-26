import { usePostMovimiento as useApiPostMovimiento } from '@/api/movimiento/postMovimiento';
import { Movimiento } from '@/types/movimiento';

export function usePostMovimiento() {
  const post = useApiPostMovimiento();
  const crearMovimiento = async (data: Movimiento) => post.mutateAsync(data);
  return { crearMovimiento };
}
