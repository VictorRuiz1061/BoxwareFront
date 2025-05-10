import { usePostFicha as useApiPostFicha } from "@/api/fichas/postFicha";
import { NuevaFicha } from "@/api/fichas/postFicha";

export function usePostFicha() {
  const post = useApiPostFicha();
  const crearFicha = async (data: NuevaFicha) => post.mutateAsync(data);
  return { crearFicha };
} 