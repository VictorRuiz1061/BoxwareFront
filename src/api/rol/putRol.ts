import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Rol } from "./getRoles";

export interface RolUpdate {
  id: number;
  nombre?: string;
}

export async function putRol(data: RolUpdate): Promise<Rol> {
  const response = await axiosInstance.put(`/roles/${data.id}`, data);
  return response.data;
}

export function usePutRol() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putRol,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
} 