import { useDeleteMaterial as useApiDeleteMaterial } from '@/api/material/deleteMaterial';

export function useDeleteMaterial() {
  const del = useApiDeleteMaterial();
  
  const eliminarMaterial = async (id: number) => {
    return await del.mutateAsync(id);
  };
  
  return { eliminarMaterial };
}
