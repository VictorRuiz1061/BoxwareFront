import { useCallback, useEffect, useState } from 'react';
import { Rol } from '../types/rol';
import { getRoles, crearRol, actualizarRol, eliminarRol } from '../api/rolesApi';
import { z } from 'zod';

// Esquema de validación integrado
const rolSchema = z.object({
  nombre_rol: z.string()
    .min(3, { message: 'El nombre del rol debe tener al menos 3 caracteres' })
    .max(50, { message: 'El nombre del rol no debe exceder los 50 caracteres' }),
  descripcion: z.string()
    .min(5, { message: 'La descripción debe tener al menos 5 caracteres' })
    .max(200, { message: 'La descripción no debe exceder los 200 caracteres' }),
  estado: z.boolean({
    required_error: 'El estado es requerido',
    invalid_type_error: 'El estado debe ser un valor booleano'
  }),
  fecha_creacion: z.string()
    .refine(date => !isNaN(Date.parse(date)), {
      message: 'Fecha de creación inválida',
    })
    .optional(),
});

// Esquema para actualizaciones (todos los campos opcionales)
const rolUpdateSchema = rolSchema.partial();

// Función para validar con Zod
const validateRol = <T>(schema: z.ZodType<T>, data: any): { success: true; data: T } | { success: false; errors: Record<string, string> } => {
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

export function useRoles() {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string> | null>(null);

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRoles();
      setRoles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar los roles:', err);
      setError('Error al cargar los roles');
      setRoles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const crear = async (rol: Omit<Rol, 'id_rol'>) => {
    try {
      // Validar datos primero
      const validation = validateRol(rolSchema, rol);
      if (!validation.success) {
        setValidationErrors(validation.errors);
        return { success: false, errors: validation.errors };
      }
      
      setValidationErrors(null);
      await crearRol(validation.data as Omit<Rol, 'id_rol'>);
      await fetchRoles();
      return { success: true };
    } catch (error) {
      console.error('Error al crear rol:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      return { success: false, errors: { general: 'Error al crear el rol' } };
    }
  };

  const actualizar = async (id: number, rol: Partial<Rol>) => {
    try {
      // Validar datos primero
      const validation = validateRol(rolUpdateSchema, rol);
      if (!validation.success) {
        setValidationErrors(validation.errors);
        return { success: false, errors: validation.errors };
      }
      
      setValidationErrors(null);
      await actualizarRol(id, validation.data as Partial<Rol>);
      await fetchRoles();
      return { success: true };
    } catch (error) {
      console.error('Error al actualizar rol:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      return { success: false, errors: { general: 'Error al actualizar el rol' } };
    }
  };

  const eliminar = async (id: number) => {
    try {
      await eliminarRol(id);
      setRoles((prev) => prev.filter((r) => r.id_rol !== id));
      return { success: true };
    } catch (error) {
      console.error('Error al eliminar rol:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      return { success: false, errors: { general: 'Error al eliminar el rol' } };
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
    roles,
    loading,
    error,
    validationErrors,
    mostrarErrores,
    crearRol: crear,
    actualizarRol: actualizar,
    eliminarRol: eliminar,
    fetchRoles,
  };
}
