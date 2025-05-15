import { usePutTipoSitio as useApiPutTipoSitio } from "@/api/tipoSitio/putTipoSitio";

export function usePutTipoSitio() {
  const mutation = useApiPutTipoSitio();
  
  const actualizarTipoSitio = async (id: number, data: any) => {
    try {
      await mutation.mutateAsync({ id, data });
      return { success: true };
    } catch (error) {
      console.error("Error al actualizar tipo de sitio:", error);
      return { success: false, error };
    }
  };

  return { actualizarTipoSitio, isLoading: mutation.isPending };
}
