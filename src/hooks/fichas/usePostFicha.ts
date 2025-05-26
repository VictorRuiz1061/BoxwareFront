import { usePostFicha as useApiPostFicha } from "@/api/fichas/postFicha";
import { Ficha } from "@/types/ficha";

export function usePostFicha() {
  const post = useApiPostFicha();
  const crearFicha = async (data: Ficha) => post.mutateAsync(data);
  return { crearFicha };
} 