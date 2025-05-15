import { Material } from '@/types/material';
import { usePutMaterial as useApiPutMaterial } from '@/api/material/putMaterial';

export function usePutMaterial() {
  const put = useApiPutMaterial();
  
  const actualizarMaterial = async (id: number, material: Partial<Material>) => {
    return await put.mutateAsync({ id, data: material });
  };
  
  return { actualizarMaterial };
}
