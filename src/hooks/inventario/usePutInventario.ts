import { usePutInventario as useApiPutInventario } from '@/api/inventario';
import { Inventario } from '@/types/inventario';

export function usePutInventario() {
  const put = useApiPutInventario();
  const actualizarInventario = async (id: number, data: Inventario) => put.mutateAsync({ id, data });
  return { actualizarInventario };
}