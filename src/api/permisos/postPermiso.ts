import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Permiso } from "./getPermisos";

export interface NuevoPermiso {
  nombre: string;
}

export async function postPermiso(data: NuevoPermiso): Promise<Permiso> {
  const response = await axiosInstance.post("/permisos", data);
  return response.data;
}

export function usePostPermiso() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postPermiso,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permisos"] });
    },
  });
} 