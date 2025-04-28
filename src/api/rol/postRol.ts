import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Rol } from "./getRoles";

export interface NuevoRol {
  nombre: string;
}

export async function postRol(data: NuevoRol): Promise<Rol> {
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