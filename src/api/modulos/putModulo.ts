import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Modulo } from "./getModulos";

export interface ModuloUpdate {
  id: number;
  rutas?: string;
  descripcion_ruta?: string;
  mensaje_cambio?: string;
  fecha_accion?: string;
  estado?: boolean;
  fecha_creacion?: string;
}

export async function putModulo(data: ModuloUpdate): Promise<Modulo> {
  const response = await axiosInstance.put(`/modulos/${data.id}`, data);
  return response.data;
}

export function usePutModulo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putModulo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modulos"] });
    },
  });
} 