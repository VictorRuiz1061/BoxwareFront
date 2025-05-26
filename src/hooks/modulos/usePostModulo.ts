import { usePostModulo as useApiPostModulo } from "@/api/modulos/postModulo";
import { Modulo } from "@/types/modulo";

export function usePostModulo() {
  const post = useApiPostModulo();
  const crearModulo = async (data: Modulo) => post.mutateAsync(data);
  return { crearModulo };
} 