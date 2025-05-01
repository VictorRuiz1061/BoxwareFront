import { usePostMaterial } from "@/api/material/postMaterial";
import { Material } from "@/types/material";

export function useMaterialPost() {
  const post = usePostMaterial();

  const crearMaterial = async (data: Material) => post.mutateAsync(data);

  return { crearMaterial };
}