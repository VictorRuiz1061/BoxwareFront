import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Material } from "@/types/material";

export interface MaterialUpdate {
  id_material: number;
  codigo_sena: string;
  nombre_material: string;
  descripcion_material: string;
  stock: number;
  unidad_medida: string;
  fecha_vencimiento: string;
  producto_perecedero: boolean;
  fecha_creacion: string;
  fecha_modificacion: string;
  categoria_id: number;
  tipo_material_id: number;
  sitio_id: number;
}

export async function putMaterial(data: MaterialUpdate): Promise<Material> {
  const response = await axiosInstance.put(`/Materials/${data.id_material}`, data);
  return response.data;
}

export function usePutMaterial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putMaterial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Materials"] });
    },
    onError: (error) => {
      console.error("Error al actualizar Material:", error);
    },
  });
}
