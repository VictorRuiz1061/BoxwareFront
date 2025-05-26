import { usePostPermiso as useApiPostPermiso } from "@/api/permisos/postPermiso";
import { Permiso } from "@/types/permiso";

export function usePostPermiso() {
  const post = useApiPostPermiso();
  const crearPermiso = async (data: Permiso) => post.mutateAsync(data);
  return { crearPermiso };
}
