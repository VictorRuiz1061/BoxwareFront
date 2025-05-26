import { usePostPrograma as useApiPostPrograma } from "@/api/programas/postPrograma";
import { Programa } from "@/types/programa";

export function usePostPrograma() {
  const post = useApiPostPrograma();
  const crearPrograma = async (data: Programa) => post.mutateAsync(data);
  return { crearPrograma };
}
