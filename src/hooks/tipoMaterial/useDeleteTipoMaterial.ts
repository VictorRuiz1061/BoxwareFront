import { useDeleteTipoMaterial as useApiDeleteTipoMaterial } from "@/api/tipoMaterial/deleteTipoMaterial";

export function useDeleteTipoMaterial() {
  const mutation = useApiDeleteTipoMaterial();
  
  const eliminarTipoMaterial = async (id: number) => {
    try {
      await mutation.mutateAsync(id);
      return { success: true };
    } catch (error) {
      console.error("Error al eliminar tipo de material:", error);
      return { success: false, error };
    }
  };
  
  return { eliminarTipoMaterial, isLoading: mutation.isPending };
}
