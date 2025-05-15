import { Material } from '@/types/material';
import { usePostMaterial as useApiPostMaterial } from '@/api/material/postMaterial';

export function usePostMaterial() {
  const post = useApiPostMaterial();
  
  const crearMaterial = async (material: Omit<Material, 'id_material'>) => {
    return await post.mutateAsync(material);
  };
  
  return { crearMaterial };
}
