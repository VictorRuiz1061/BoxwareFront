import { usePutSitio as useApiPutSitio } from "@/api/sitio/putSitio";

export function usePutSitio() {
  const mutation = useApiPutSitio();
  
  const actualizarSitio = async (id: number, data: any) => {
    try {
      await mutation.mutateAsync({ id, data });
      return { success: true };
    } catch (error) {
      console.error("Error al actualizar sitio:", error);
      return { success: false, error };
    }
  };
  
  return { actualizarSitio, isLoading: mutation.isPending };
}
