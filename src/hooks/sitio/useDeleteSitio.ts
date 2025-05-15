import { useDeleteSitio as useApiDeleteSitio } from "@/api/sitio/deleteSitio";

export function useDeleteSitio() {
  const mutation = useApiDeleteSitio();
  
  const eliminarSitio = async (id: number) => {
    try {
      await mutation.mutateAsync(id);
      return { success: true };
    } catch (error) {
      console.error("Error al eliminar sitio:", error);
      return { success: false, error };
    }
  };
  
  return { eliminarSitio, isLoading: mutation.isPending };
}
