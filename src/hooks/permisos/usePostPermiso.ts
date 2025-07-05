import { usePostPermiso as useApiPostPermiso } from "@/api/permisos";
import { Permiso } from "@/types";

export function usePostPermiso() {
  const post = useApiPostPermiso();
  const crearPermiso = async (data: Permiso) => post.mutateAsync(data);
  return { crearPermiso };
}
