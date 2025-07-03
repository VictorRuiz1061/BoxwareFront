import { usePostMaterial as useApiPostMaterial } from '@/api/materiales';
import { Material } from '@/types';

type CreateMaterialPayload = Omit<Material, 'id_material'>;

export function usePostMaterial() {
  const post = useApiPostMaterial();
  const crearMaterial = async (data: CreateMaterialPayload) => post.mutateAsync(data);
  return { crearMaterial };
}