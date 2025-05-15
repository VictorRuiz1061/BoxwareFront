import { usePostTipoSitio as useApiPostTipoSitio } from "@/api/tipoSitio/postTipoSitio";

export function usePostTipoSitio() {
  const mutation = useApiPostTipoSitio();
  
  const crearTipoSitio = async (data: any) => {
    try {
      await mutation.mutateAsync(data);
      return { success: true };
    } catch (error) {
      console.error("Error al crear tipo de sitio:", error);
      return { success: false, error };
    }
  };

  return { crearTipoSitio, isLoading: mutation.isPending };
}
