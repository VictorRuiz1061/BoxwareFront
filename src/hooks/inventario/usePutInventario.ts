import { usePutInventario as useApiPutInventario } from "@/api/inventario";
import { Inventario } from "@/types";

export function usePutInventario() {
  const put = useApiPutInventario();
  const actualizarInventario = async (id: number, data: Inventario) => put.mutateAsync({ ...data, id });
  return { actualizarInventario };
}