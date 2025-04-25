import { useCallback, useEffect, useState } from 'react';
import { TipoMovimiento } from '../types/tipoMovimiento';
import { getTiposMovimiento, crearTipoMovimiento, actualizarTipoMovimiento, eliminarTipoMovimiento } from '../api/tiposMovimientoApi';
import { z } from 'zod';

// Esquema de validación integrado
const tipoMovimientoSchema = z.object({
  tipo_movimiento: z.string()
    .min(3, { message: 'El tipo de movimiento debe tener al menos 3 caracteres' })
    .max(100, { message: 'El tipo de movimiento no debe exceder los 100 caracteres' }),
  fecha_creacion: z.string()
    .refine(date => !isNaN(Date.parse(date)), {
      message: 'Fecha de creación inválida',
    })
    .optional(),
  fecha_modificacion: z.string()
    .refine(date => !isNaN(Date.parse(date)), {
      message: 'Fecha de modificación inválida',
    })
    .optional(),
});

// Esquema para actualizaciones (todos los campos opcionales)
const tipoMovimientoUpdateSchema = tipoMovimientoSchema.partial();

// Función para validar con Zod
const validateTipoMovimiento = <T>(schema: z.ZodType<T>, data: any): { success: true; data: T } | { success: false; errors: Record<string, string> } => {
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

export function useTiposMovimiento() {
  const [tiposMovimiento, setTiposMovimiento] = useState<TipoMovimiento[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string> | null>(null);

  const fetchTiposMovimiento = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTiposMovimiento();
      setTiposMovimiento(data);
      setError(null);
    } catch (e) {
      setError('Error al cargar los tipos de movimiento');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTiposMovimiento();
  }, [fetchTiposMovimiento]);

  const crear = async (tipoMovimiento: Omit<TipoMovimiento, 'id_tipo_movimiento'>) => {
    try {
      // Validar datos primero
      const validation = validateTipoMovimiento(tipoMovimientoSchema, tipoMovimiento);
      if (!validation.success) {
        setValidationErrors(validation.errors);
        return { success: false, errors: validation.errors };
      }
      
      setValidationErrors(null);
      await crearTipoMovimiento(validation.data as Omit<TipoMovimiento, 'id_tipo_movimiento'>);
      await fetchTiposMovimiento();
      return { success: true };
    } catch (error) {
      console.error('Error al crear tipo de movimiento:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      return { success: false, errors: { general: 'Error al crear el tipo de movimiento' } };
    }
  };

  const actualizar = async (id: number, tipoMovimiento: Partial<TipoMovimiento>) => {
    try {
      // Validar datos primero
      const validation = validateTipoMovimiento(tipoMovimientoUpdateSchema, tipoMovimiento);
      if (!validation.success) {
        setValidationErrors(validation.errors);
        return { success: false, errors: validation.errors };
      }
      
      setValidationErrors(null);
      await actualizarTipoMovimiento(id, validation.data as Partial<TipoMovimiento>);
      await fetchTiposMovimiento();
      return { success: true };
    } catch (error) {
      console.error('Error al actualizar tipo de movimiento:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      return { success: false, errors: { general: 'Error al actualizar el tipo de movimiento' } };
    }
  };

  const eliminar = async (id: number) => {
    try {
      await eliminarTipoMovimiento(id);
      setTiposMovimiento((prev) => prev.filter((t) => t.id_tipo_movimiento !== id));
      return { success: true };
    } catch (error) {
      console.error('Error al eliminar tipo de movimiento:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      return { success: false, errors: { general: 'Error al eliminar el tipo de movimiento' } };
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
    tiposMovimiento,
    loading,
    error,
    validationErrors,
    mostrarErrores,
    crearTipoMovimiento: crear,
    actualizarTipoMovimiento: actualizar,
    eliminarTipoMovimiento: eliminar,
    fetchTiposMovimiento,
  };
}
