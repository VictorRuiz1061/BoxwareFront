import { usePostRol as useApiPostRol, NuevoRol } from "@/api/rol/postRol";

export function usePostRol() {
  const post = useApiPostRol();
  const crearRol = async (data: NuevoRol) => post.mutateAsync(data);
  return { crearRol };
} 