import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Usuario } from "@/types/usuario";

export interface UsuarioUpdate {
  id: number;
  nombre?: string;
  // ...otros campos opcionales
}

export async function putUsuario(data: UsuarioUpdate): Promise<Usuario> {
  const response = await axiosInstance.put(`/usuarios/${data.id}`, data);
  return response.data;
}

export function usePutUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putUsuario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
    },
  });
} 