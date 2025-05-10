import { usePostArea as useApiPostArea } from "@/api/areas/postArea";
import { NuevaArea } from "@/api/areas/postArea";

export function usePostArea() {
  const post = useApiPostArea();
  const crearArea = async (data: NuevaArea) => post.mutateAsync(data);
  return { crearArea };
} 