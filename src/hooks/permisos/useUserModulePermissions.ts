import { useEffect, useState } from 'react';
import { useGetModulos } from '@/api/modulos';
import { useAuthContext } from '@/context/AuthContext';
import { Modulo } from '@/types/modulo';
import { useUserPermissions } from './useUserPermissions';
import { Permiso } from '@/types';

/**
 * Custom hook to fetch and filter modules based on user permissions
 * @returns Object containing filtered modules and loading state
 */
export function useUserModulePermissions() {
  // Initialize state with localStorage data if available
  const [permittedModules, setPermittedModules] = useState<Modulo[]>(() => {
    try {
      const storedModules = localStorage.getItem('permittedModules');
      return storedModules ? JSON.parse(storedModules) : [];
    } catch (error) {
      return [];
    }
  });
  
  // Track if we've already processed the modules to prevent infinite loops
  const [processed, setProcessed] = useState(false);
  
  const { userPermissions, isLoading: permisosLoading } = useUserPermissions();
  const { data: allModulos, isLoading: modulosLoading } = useGetModulos();
  const { authState } = useAuthContext();

  // Single effect to handle module filtering
  useEffect(() => {
    // Skip if already processed or still loading dependencies
    if (processed || permisosLoading || modulosLoading) {
      return;
    }
    
    // Skip if we don't have the required data
    if (!authState.user || !userPermissions || !allModulos) {
      return;
    }

    try {
      // Process permissions only once
      setProcessed(true);
      
      if (userPermissions.length === 0) {
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

      // Update state and localStorage only if modules have changed
      const currentModulesJson = JSON.stringify(permittedModules);
      const newModulesJson = JSON.stringify(filteredModules);
      
      if (currentModulesJson !== newModulesJson) {
        setPermittedModules(filteredModules);
        localStorage.setItem('permittedModules', newModulesJson);
      }
    } catch (error) {
    }
  }, [authState.user, userPermissions, allModulos, permisosLoading, modulosLoading, processed]);

  // Reset processed state when dependencies change
  useEffect(() => {
    if (processed && (permisosLoading || modulosLoading)) {
      setProcessed(false);
    }
  }, [permisosLoading, modulosLoading, processed]);

  return { 
    permittedModules, 
    loading: !processed || permisosLoading || modulosLoading
  };
}
