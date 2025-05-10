import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Rol } from "@/types/rol";

export interface NuevoRol {
  nombre_rol: string;
  descripcion: string;
  estado: boolean;
  fecha_creacion: string;
  fecha_modificacion: string;
}

export async function postRol(data: NuevoRol): Promise<Rol> {
  console.log('Enviando datos al servidor:', data);
  const response = await axiosInstance.post("/roles", data);
  return response.data;
}

export function usePostRol() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postRol,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
} 