import { useGetPermisos as useApiGetPermisos } from "@/api/permisos/getPermisos";

export function useGetPermisos() {
  const { data: permisos = [], isLoading: loading } = useApiGetPermisos();
  return { permisos, loading };
}
