import { usePostArea as useApiPostArea } from "@/api/areas";
import { Area } from "@/types/area";

export function usePostArea() {
  const post = useApiPostArea();
  const crearArea = async (data: Area) => post.mutateAsync(data);
  return { crearArea };
} 