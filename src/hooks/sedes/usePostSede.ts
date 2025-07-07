import { usePostSede as useApiPostSede } from "@/api/sedes";
import { Sede } from "@/types";

export function usePostSede() {
  const post = useApiPostSede();
  const crearSede = async (data: Sede) => post.mutateAsync(data);
  return { crearSede };
} 