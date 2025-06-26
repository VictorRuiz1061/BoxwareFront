import { usePostMaterial as useApiPostMaterial } from '@/api/materiales';
import { Material } from '@/types';

export function usePostMaterial() {
  const post = useApiPostMaterial();
  const crearMaterial = async (data: Material) => post.mutateAsync(data);
  return { crearMaterial };
}