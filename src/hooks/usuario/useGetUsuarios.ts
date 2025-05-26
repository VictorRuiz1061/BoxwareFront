import { useGetUsuarios as useApiGetUsuarios } from "@/api/usuario/getUsuarios";

export function useGetUsuarios() {
  const { data: usuarios = [], isLoading: loading } = useApiGetUsuarios();
  return { usuarios, loading };
}
