import { useMutation } from "@tanstack/react-query";
import { postCargarUsuarios } from "@/api/usuario";

export function usePostCargarUsuarios() {
  return useMutation({
    mutationFn: ({ archivo, rol_id }: { archivo: File; rol_id: number }) =>
      postCargarUsuarios(archivo, rol_id)
  });
}