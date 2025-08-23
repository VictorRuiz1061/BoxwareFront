import { usePostRol as useApiPostRol } from "@/api/rol";
import { Rol } from "@/types";

export function usePostRol() {
  const post = useApiPostRol();
  const crearRol = async (data: Rol) => post.mutateAsync(data);
  return { crearRol };
}
