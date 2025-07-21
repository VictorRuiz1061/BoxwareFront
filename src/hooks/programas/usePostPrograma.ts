import { usePostPrograma as useApiPostPrograma } from "@/api/programas";
import { Programa } from "@/types";

export function usePostPrograma() {
  const post = useApiPostPrograma();
  const crearPrograma = async (data: Programa) => post.mutateAsync(data);
  return { crearPrograma };
}
