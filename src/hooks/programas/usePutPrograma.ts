import { usePutPrograma as useApiPutPrograma } from "@/api/programas";
import { UpdateProgramaRequest } from "@/types";

export function usePutPrograma() {
  const put = useApiPutPrograma();
  const actualizarPrograma = async (id: number, data: Omit<UpdateProgramaRequest, 'id'>) => put.mutateAsync({ ...data, id });
  return { actualizarPrograma };
}
