import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Usuario } from "@/types/usuario";

export async function putUsuario(data: Partial<Usuario> & { id: number }): Promise<Usuario> {
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
