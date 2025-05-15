import { usePutTipoMaterial as useApiPutTipoMaterial } from "@/api/tipoMaterial/putTipoMaterial";

export function usePutTipoMaterial() {
  const mutation = useApiPutTipoMaterial();
  
  const actualizarTipoMaterial = async (id: number, data: any) => {
    try {
      await mutation.mutateAsync({ id, data });
      return { success: true };
    } catch (error) {
      console.error("Error al actualizar tipo de material:", error);
      return { success: false, error };
    }
  };
  
  return { actualizarTipoMaterial, isLoading: mutation.isPending };
}
