import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Usuario } from "@/types/usuario";

export async function postUsuario(data: Usuario | FormData): Promise<Usuario> {
  const config = data instanceof FormData ? {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  } : {};
  
  const response = await axiosInstance.post("/usuarios", data, config);
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
