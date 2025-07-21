import { usePostFicha as useApiPostFicha } from "@/api/fichas";
import { Ficha } from "@/types";

export function usePostFicha() {
  const post = useApiPostFicha();
  const crearFicha = async (data: Ficha) => post.mutateAsync(data);
  return { crearFicha };
}