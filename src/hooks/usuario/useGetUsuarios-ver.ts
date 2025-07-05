import { useGetUsuariosVer as useApiGetUsuariosVer } from "@/api/usuario";

export function useGetUsuariosVer(id: number) {
  const { data: usuario = null, isLoading: loading } = useApiGetUsuariosVer(id);
  return { usuario, loading };
}
