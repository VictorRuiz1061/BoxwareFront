import { usePutModulo as useApiPutModulo } from "@/api/modulos/putModulo";
import { ModuloUpdate } from "@/api/modulos/putModulo";

export function usePutModulo() {
  const put = useApiPutModulo();
  const actualizarModulo = async (id: number, data: ModuloUpdate) => put.mutateAsync({ ...data, id });
  return { actualizarModulo };
} 