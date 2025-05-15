import { useDeleteTipoSitio as useApiDeleteTipoSitio } from "@/api/tipoSitio/deleteTipoSitio";

export function useDeleteTipoSitio() {
  const mutation = useApiDeleteTipoSitio();
  
  const eliminarTipoSitio = async (id: number) => {
    try {
      await mutation.mutateAsync(id);
      return { success: true };
    } catch (error) {
      console.error("Error al eliminar tipo de sitio:", error);
      return { success: false, error };
    }
  };

  return { eliminarTipoSitio, isLoading: mutation.isPending };
}
