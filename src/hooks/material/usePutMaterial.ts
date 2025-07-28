import { usePutMaterial as useApiPutMaterial } from '@/api/materiales';
import { Material } from '@/types';

export function usePutMaterial() {
  const put = useApiPutMaterial();
  const actualizarMaterial = async (id: number, data: Partial<Material> & { imagen?: File | string }) => {
    const updatedData = { ...data };
    if (!updatedData.id_material) {
      updatedData.id_material = id;
    }
    return put.mutateAsync(updatedData);
  };
  return { actualizarMaterial };
}
