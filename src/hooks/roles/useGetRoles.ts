import { useGetRoles as useApiGetRoles } from "@/api/rol";

export function useGetRoles() {
  const { data: roles = [], isLoading: loading } = useApiGetRoles();
  return { roles, loading };
}
