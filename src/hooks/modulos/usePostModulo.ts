import { usePostModulo as useApiPostModulo } from "@/api/modulos";
import { Modulo } from "@/types";

export function usePostModulo() {
  const post = useApiPostModulo();
  const crearModulo = async (data: Modulo) => post.mutateAsync(data);
  return { crearModulo };
} 