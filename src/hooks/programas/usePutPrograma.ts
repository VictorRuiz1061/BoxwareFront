import { usePutPrograma as useApiPutPrograma } from "@/api/programas";
import { Programa } from "@/types";

export function usePutPrograma() {
  const put = useApiPutPrograma();
  const actualizarPrograma = async (id: number, data: Programa) => put.mutateAsync({ ...data, id });
  return { actualizarPrograma };
}
