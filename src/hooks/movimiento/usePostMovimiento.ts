import { usePostMovimiento as useApiPostMovimiento } from '@/api/movimiento';
import { Movimiento } from '@/types';

export function usePostMovimiento() {
  const post = useApiPostMovimiento();
  const crearMovimiento = async (data: Movimiento) => post.mutateAsync(data);
  return { crearMovimiento };
}
