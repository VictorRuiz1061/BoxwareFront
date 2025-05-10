import { usePostSede as useApiPostSede, NuevaSede } from "@/api/sedes/postSede";

export function usePostSede() {
  const post = useApiPostSede();
  const crearSede = async (data: NuevaSede) => post.mutateAsync(data);
  return { crearSede };
} 