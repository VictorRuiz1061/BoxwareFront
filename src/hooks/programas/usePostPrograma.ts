import { usePostPrograma as useApiPostPrograma, NuevoPrograma } from "@/api/programas/postPrograma";

export function usePostPrograma() {
  const post = useApiPostPrograma();
  const crearPrograma = async (data: NuevoPrograma) => post.mutateAsync(data);
  return { crearPrograma };
} 