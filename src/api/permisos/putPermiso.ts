import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Permiso } from "./getPermisos";

export interface PermisoUpdate {
  id: number;
  nombre?: string;
  estado?: boolean | string | number;
}

export async function putPermiso(data: PermisoUpdate): Promise<Permiso> {
  const response = await axiosInstance.put(`/permisos/${data.id}`, data);
  return response.data;
}

export function usePutPermiso() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putPermiso,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permisos"] });
    },
  });
} 