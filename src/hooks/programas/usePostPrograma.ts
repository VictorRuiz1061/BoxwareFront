import { usePostPrograma as useApiPostPrograma } from "@/api/programas";
import { CreateProgramaRequest } from "@/types";

export function usePostPrograma() {
  const post = useApiPostPrograma();
  const crearPrograma = async (data: CreateProgramaRequest) => post.mutateAsync(data);
  return { crearPrograma };
}
