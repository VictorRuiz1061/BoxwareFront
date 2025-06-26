import { usePutModulo as useApiPutModulo } from "@/api/modulos";
import { Modulo } from "@/types";

export function usePutModulo() {
  const put = useApiPutModulo();
  const actualizarModulo = async (id: number, data: Partial<Modulo>) => put.mutateAsync({ ...data, id });
  return { actualizarModulo };
}