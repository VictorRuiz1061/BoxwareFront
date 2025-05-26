import { usePutModulo as useApiPutModulo } from "@/api/modulos/putModulo";
import { Modulo } from "@/types/modulo";

export function usePutModulo() {
  const put = useApiPutModulo();
  const actualizarModulo = async (id: number, data: Modulo) => put.mutateAsync({ ...data, id });
  return { actualizarModulo };
} 