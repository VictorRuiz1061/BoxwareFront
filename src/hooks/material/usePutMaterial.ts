import { usePutMaterial as useApiPutMaterial } from '@/api/materiales/putMateriales';
import { Material } from '@/types/material';

export function usePutMaterial() {
  const put = useApiPutMaterial();
  const actualizarMaterial = async (id: number, data: Material ) => put.mutateAsync({ ...data, id });
  return { actualizarMaterial };
} 