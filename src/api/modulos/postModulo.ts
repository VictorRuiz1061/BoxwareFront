import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Modulo } from "./getModulos";

export interface NuevoModulo {
  rutas: string;
  descripcion_ruta: string;
  mensaje_cambio: string;
  fecha_accion: string;
  estado: boolean;
  fecha_creacion: string;
}

export async function postModulo(data: NuevoModulo): Promise<Modulo> {
  const response = await axiosInstance.post("/modulos", data);
  return response.data;
}

export function usePostModulo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postModulo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modulos"] });
    },
  });
} 