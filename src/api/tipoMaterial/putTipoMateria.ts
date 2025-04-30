import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { TipoMaterial } from "@/types/tipoMaterial";

export interface TipoMaterialUpdate {
  id_tipo_material: number;
  tipo_elemento: string;
  estado: string;
  fecha_creacion: string;
  fecha_modificacion: string;
}

export async function putTipoMaterial(data: TipoMaterialUpdate): Promise<TipoMaterial> {
  const response = await axiosInstance.put(`/TipoMateriales/${data.id_tipo_material}`, data);
  return response.data;
}

export function usePutTipoMaterial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putTipoMaterial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["TipoMateriales"] });
    },
    onError: (error) => {
      console.error("Error al actualizar TipoMaterial:", error);
    },
  });
}