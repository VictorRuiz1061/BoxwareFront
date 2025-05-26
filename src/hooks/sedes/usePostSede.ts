import { usePostSede as useApiPostSede } from "@/api/sedes/postSede";
import { Sede } from "@/types/sede";

export function usePostSede() {
  const post = useApiPostSede();
  const crearSede = async (data: Sede) => post.mutateAsync(data);
  return { crearSede };
} 