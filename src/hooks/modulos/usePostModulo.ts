import { usePostModulo as useApiPostModulo } from "@/api/modulos/postModulo";
import { NuevoModulo } from "@/api/modulos/postModulo";

export function usePostModulo() {
  const post = useApiPostModulo();
  const crearModulo = async (data: NuevoModulo) => post.mutateAsync(data);
  return { crearModulo };
} 