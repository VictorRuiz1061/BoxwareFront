import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Usuario } from "@/types/usuario";

export async function putUsuario(id: number, data: Partial<Usuario> | FormData): Promise<Usuario> {
  const config = data instanceof FormData ? {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  } : {};
  
  const response = await axiosInstance.put(`/usuarios/${id}`, data, config);
  return response.data;
}

export function usePutUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Usuario> | FormData }) => putUsuario(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
    },
  });
}
