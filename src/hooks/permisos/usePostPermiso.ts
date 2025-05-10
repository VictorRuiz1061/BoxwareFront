import { usePostPermiso as useApiPostPermiso, NuevoPermiso } from "@/api/permisos/postPermiso";

export function usePostPermiso() {
  const post = useApiPostPermiso();
  const crearPermiso = async (data: NuevoPermiso) => post.mutateAsync(data);
  return { crearPermiso };
} 