import { Movimiento } from '@/types';
import { usePutMovimiento as useApiPutMovimiento } from '@/api/movimiento';

export function usePutMovimiento() {
  const put = useApiPutMovimiento();
  const actualizarMovimiento = async (id: number, data: Movimiento) => put.mutateAsync({ ...data, id });
  return { actualizarMovimiento };
}
