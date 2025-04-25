import { useCallback, useEffect, useState } from 'react';
import { Permiso } from '../types/permiso';
import { getPermisos, crearPermiso, actualizarPermiso, eliminarPermiso } from '../api/permisosApi';
import { z } from 'zod';

// Esquema de validación integrado
const permisoSchema = z.object({
  nombre: z.string()
    .min(3, { message: 'El nombre del permiso debe tener al menos 3 caracteres' })
    .max(100, { message: 'El nombre del permiso no debe exceder los 100 caracteres' }),
  codigo_nombre: z.string()
    .min(2, { message: 'El código nombre debe tener al menos 2 caracteres' })
    .max(50, { message: 'El código nombre no debe exceder los 50 caracteres' }),
  modulo_id: z.number({
    required_error: 'El ID del módulo es requerido',
    invalid_type_error: 'El ID del módulo debe ser un número'
  }),
  rol_id: z.number({
    required_error: 'El ID del rol es requerido',
    invalid_type_error: 'El ID del rol debe ser un número'
  }),
  id_permiso: z.number().optional(),
});

// Esquema para actualizaciones (todos los campos opcionales)
const permisoUpdateSchema = permisoSchema.partial();

// Función para validar con Zod
const validatePermiso = <T>(schema: z.ZodType<T>, data: any): { success: true; data: T } | { success: false; errors: Record<string, string> } => {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        if (err.path.length > 0) {
          const key = err.path[0].toString();
          errors[key] = err.message;
        }
      });
      return { success: false, errors };
    }
    return {
      success: false,
      errors: { general: 'Error de validación desconocido' },
    };
  }
};
 
export function usePermisos() {
  const [permisos, setPermisos] = useState<Permiso[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string> | null>(null);

  const fetchPermisos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPermisos();
      setPermisos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar los permisos:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setPermisos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPermisos();
  }, [fetchPermisos]);

  const crear = async (permiso: Omit<Permiso, 'id_permiso'>) => {
    try {
      // Validar datos primero
      const validation = validatePermiso(permisoSchema, permiso);
      if (!validation.success) {
        setValidationErrors(validation.errors);
        return { success: false, errors: validation.errors };
      }
      
      setValidationErrors(null);
      // Añadir un ID temporal para cumplir con la API
      const permisoConId: Permiso = {
        ...permiso,
        id_permiso: 0 // Este valor será reemplazado por el backend
      };
      await crearPermiso(permisoConId);
      await fetchPermisos();
      return { success: true };
    } catch (error) {
      console.error('Error al crear permiso:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      return { success: false, errors: { general: 'Error al crear el permiso' } };
    }
  };

  const actualizar = async (id: number, permiso: Partial<Permiso>) => {
    try {
      // Validar datos primero
      const validation = validatePermiso(permisoUpdateSchema, permiso);
      if (!validation.success) {
        setValidationErrors(validation.errors);
        return { success: false, errors: validation.errors };
      }
      
      setValidationErrors(null);
      await actualizarPermiso(id, validation.data as Partial<Permiso>);
      await fetchPermisos();
      return { success: true };
    } catch (error) {
      console.error('Error al actualizar permiso:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      return { success: false, errors: { general: 'Error al actualizar el permiso' } };
    }
  };

  const eliminar = async (id: number) => {
    try {
      await eliminarPermiso(id);
      setPermisos((prev) => prev.filter((p) => p.id_permiso !== id));
      return { success: true };
    } catch (error) {
      console.error('Error al eliminar permiso:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      return { success: false, errors: { general: 'Error al eliminar el permiso' } };
    }
  };

  // Función auxiliar para mostrar mensajes de error
  const mostrarErrores = () => {
    if (!validationErrors) return null;
    
    let mensaje = 'Errores de validación:\n';
    Object.entries(validationErrors).forEach(([campo, error]) => {
      mensaje += `- ${campo}: ${error}\n`;
    });
    
    return mensaje;
  };

  return { 
    permisos, 
    loading, 
    error, 
    validationErrors,
    mostrarErrores,
    fetchPermisos, 
    crearPermiso: crear, 
    actualizarPermiso: actualizar, 
    eliminarPermiso: eliminar 
  };
}
