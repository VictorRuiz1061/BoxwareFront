import { usePutCaracteristica as useApiPutCaracteristica } from "@/api/caracteristicas";
import { Caracteristica } from "@/types";

export function usePutCaracteristica() {
  const put = useApiPutCaracteristica();
  const actualizarCaracteristica = async (id: number, data: Partial<Caracteristica>) => put.mutateAsync({ id, ...data });
  return { actualizarCaracteristica };
}
