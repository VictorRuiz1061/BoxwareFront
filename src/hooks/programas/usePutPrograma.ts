import { usePutPrograma as useApiPutPrograma } from "@/api/programas/putPrograma";
import { Programa } from "@/types/programa";

export function usePutPrograma() {
  const put = useApiPutPrograma();
  const actualizarPrograma = async (id: number, data: Programa) => put.mutateAsync({ ...data, id });
  return { actualizarPrograma };
}
