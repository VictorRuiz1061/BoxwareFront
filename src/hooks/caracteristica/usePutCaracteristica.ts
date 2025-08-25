import { usePutCaracteristicas as useApiPutCaracteristicas } from "@/api/caracteristicas";
import { Caracteristica } from "@/types";

export function usePutCaracteristica() {
  const put = useApiPutCaracteristicas();
  const actualizarCaracteristica = async (id: number, data: Partial<Caracteristica>) => put.mutateAsync({ id, ...data });
  return { actualizarCaracteristica };
}