import { useQuery } from "@tanstack/react-query";
import { getPermisos } from "@/api/permisos";
import { Permiso } from "@/types";
import { useAuthContext } from "@/context/AuthContext";

/**
 * Custom hook to fetch permissions for the current user's role
 * @returns Query result with permissions data and filtered permissions for the user's role
 */
export function useUserPermissions() {
  const { authState } = useAuthContext();
  const roleId = authState.user?.rol_id;

  const query = useQuery<Permiso[]>({
    queryKey: ["permisos"],
    queryFn: getPermisos,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep data in cache for 10 minutes
  });

  // Filter permissions for the user's role
  const userPermissions = query.data?.filter((permisos: Permiso) => {
    if (!roleId) return false;
    
    // Check if rol_id is an object with id_rol property
    if (typeof permisos.rol_id === 'object' && permisos.rol_id !== null) {
      return permisos.rol_id.id_rol === roleId;
    }
    // Check if rol_id is a number
    return permisos.rol_id === roleId;
  }) || [];

  return {
    ...query,
    userPermissions
  };
}
