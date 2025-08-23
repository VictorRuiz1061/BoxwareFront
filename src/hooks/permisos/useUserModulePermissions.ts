// src/hooks/permisos/useUserModulePermissions.ts
import { useEffect, useState } from 'react';
import { useGetModulos } from '@/api/modulos';
import { useAuthContext } from '@/context/AuthContext';
import { Modulo } from '@/types/modulo';
import { useUserPermissions } from './useUserPermissions';
import { Permiso } from '@/types';
import { getJsonCookie, setJsonCookie } from '@/api/axiosConfig';

/**
 * Custom hook to fetch and filter modules based on user permissions
 * @returns Object containing filtered modules and loading state
 */
export function useUserModulePermissions() {
  // Inicializar desde cookie si está disponible
  const [permittedModules, setPermittedModules] = useState<Modulo[]>(() => {
    const fromCookie = getJsonCookie<Modulo[]>('permittedModules');
    console.log("useUserModulePermissions: Initial permittedModules from cookie", fromCookie);
    return Array.isArray(fromCookie) ? fromCookie : [];
  });

  // Track if we've already processed the modules to prevent infinite loops
  const [processed, setProcessed] = useState(false);

  const { userPermissions, isLoading: permisosLoading } = useUserPermissions();
  const { data: allModulos, isLoading: modulosLoading } = useGetModulos();
  const { authState } = useAuthContext();

  // Single effect to handle module filtering
  useEffect(() => {
    console.log("useUserModulePermissions: Effect running. processed:", processed, "permisosLoading:", permisosLoading, "modulosLoading:", modulosLoading);
    // Skip if already processed or still loading dependencies
    if (processed || permisosLoading || modulosLoading) {
      return;
    }

    // Skip if we don't have the required data
    if (!authState.user || !userPermissions || !allModulos) {
      console.log("useUserModulePermissions: Missing dependencies. authState.user:", !!authState.user, "userPermissions:", !!userPermissions, "allModulos:", !!allModulos);
      return;
    }

    try {
      console.log("useUserModulePermissions: Processing modules...");
      console.log("useUserModulePermissions: userPermissions", userPermissions);
      console.log("useUserModulePermissions: allModulos", allModulos);

      // Process permissions only once
      setProcessed(true);

      if (userPermissions.length === 0) {
        console.log("useUserModulePermissions: No user permissions found.");
        return;
      }

      // Get all module IDs the user has permission to view
      const permittedModuleIds = new Set<number>();

      userPermissions.forEach((permisos: Permiso) => {
        // Only consider permissions where the user can view
        if (permisos.puede_ver) {
          // Extract module IDs from the permission
          if (Array.isArray(permisos.modulo_id)) {
            permisos.modulo_id.forEach((modId: number | Modulo) => {
              // Handle both number and object types
              const moduleId = typeof modId === 'object' ? modId.id_modulo : Number(modId);
              permittedModuleIds.add(moduleId);
            });
          }
        }
      });

      // Filter modules based on permitted module IDs
      const filteredModules = allModulos.filter(modulo =>
        permittedModuleIds.has(modulo.id_modulo)
      );

      console.log("useUserModulePermissions: filteredModules", filteredModules);

      // Actualizar estado y cookie solo si cambió
      const currentModulesJson = JSON.stringify(permittedModules);
      const newModulesJson = JSON.stringify(filteredModules);

      if (currentModulesJson !== newModulesJson) {
        console.log("useUserModulePermissions: Updating permittedModules and cookie.");
        setPermittedModules(filteredModules);
        setJsonCookie('permittedModules', filteredModules);
      } else {
        console.log("useUserModulePermissions: permittedModules did not change.");
      }
    } catch (error) {
      console.error("useUserModulePermissions: Error during module processing", error);
    }
  }, [authState.user, userPermissions, allModulos, permisosLoading, modulosLoading, processed]);

  // Reset processed state when dependencies change
  useEffect(() => {
    if (processed && (permisosLoading || modulosLoading)) {
      console.log("useUserModulePermissions: Resetting processed state.");
      setProcessed(false);
    }
  }, [permisosLoading, modulosLoading, processed]);

  return {
    permittedModules,
    loading: !processed || permisosLoading || modulosLoading
  };
}