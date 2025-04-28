import { useGetUsuarios as useApiGetUsuarios } from "@/api/usuario/getUsuarios";

export function useGetUsuarios() {
  return useApiGetUsuarios();
} 