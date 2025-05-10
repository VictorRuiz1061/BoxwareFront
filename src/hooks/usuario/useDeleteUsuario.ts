import { useDeleteUsuario as useApiDeleteUsuario } from "@/api/usuario/deleteUsuario";

export function useDeleteUsuario() {
  const del = useApiDeleteUsuario();
  const eliminarUsuario = async (id: number) => del.mutateAsync(id);
  return { eliminarUsuario };
} 