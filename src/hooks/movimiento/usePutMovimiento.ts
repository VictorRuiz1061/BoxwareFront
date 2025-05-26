import { Movimiento } from '@/types/movimiento';
import { usePutMovimiento as useApiPutMovimiento } from '@/api/movimiento/putMovimiento';

export function usePutMovimiento() {
  const put = useApiPutMovimiento();
  const actualizarMovimiento = async (id: number, data: Movimiento) => put.mutateAsync({ ...data, id });
  return { actualizarMovimiento };
}
