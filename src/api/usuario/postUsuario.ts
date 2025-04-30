import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Usuario, NuevoUsuario } from "@/types/usuario";

export async function postUsuario(data: NuevoUsuario): Promise<Usuario> {
  const response = await axiosInstance.post("/usuarios", data);
  return response.data;
}

export function usePostUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postUsuario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
    },
  });
} 