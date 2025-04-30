import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Sitio } from "@/types/sitio";

export interface SitioUpdate {
    sede_id: number;
    id_sitio: number;
    nombre_sitio: string;
    ubicacion: string;
    fecha_creacion: string;
    fecha_modificacion: string;
    ficha_tecnica: string;
    persona_encargada_id: number;
    tipo_sitio_id: number;
}

export async function putSitio(data: SitioUpdate): Promise<Sitio> {
  const response = await axiosInstance.put(`/sitios/${data.id_sitio}`, data);
  return response.data;
}

export function usePutSitio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putSitio,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sitios"] });
    },
    onError: (error) => {
      console.error("Error al actualizar sitio:", error);
    },
  });
}
