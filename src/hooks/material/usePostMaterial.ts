import { usePostMaterial as useApiPostMaterial } from '@/api/materiales/postMateriales';
import { Material } from '@/types/material';

export function usePostMaterial() {
  const post = useApiPostMaterial();
  const crearMaterial = async (data: Material) => post.mutateAsync(data);
  return { crearMaterial };
}