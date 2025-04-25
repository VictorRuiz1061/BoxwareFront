import { useCallback, useEffect, useState } from 'react';
import { Movimiento } from '../types/movimiento';
import { getMovimientos, crearMovimiento, actualizarMovimiento, eliminarMovimiento } from '../api/movimientosApi';
import { z } from 'zod';

// Esquema de validación integrado
const movimientoSchema = z.object({
  usuario_movimiento_id: z.number({
    required_error: 'El ID del usuario del movimiento es requerido',
    invalid_type_error: 'El ID del usuario del movimiento debe ser un número'
  }),
  tipo_movimiento_id: z.number({
    required_error: 'El ID del tipo de movimiento es requerido',
    invalid_type_error: 'El ID del tipo de movimiento debe ser un número'
  }),
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
const movimientoUpdateSchema = movimientoSchema.partial();

// Función para validar con Zod
const validateMovimiento = <T>(schema: z.ZodType<T>, data: any): { success: true; data: T } | { success: false; errors: Record<string, string> } => {
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

export function useMovimientos() {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string> | null>(null);

  const fetchMovimientos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMovimientos();
      setMovimientos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar movimientos:', err);
      setError('Error al cargar movimientos');
      setMovimientos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMovimientos();
  }, [fetchMovimientos]);

  const crear = async (movimiento: Omit<Movimiento, 'id_movimiento'>) => {
    try {
      // Validar datos primero
      const validation = validateMovimiento(movimientoSchema, movimiento);
      if (!validation.success) {
        setValidationErrors(validation.errors);
        return { success: false, errors: validation.errors };
      }
      
      setValidationErrors(null);
      await crearMovimiento(validation.data as Omit<Movimiento, 'id_movimiento'>);
      await fetchMovimientos();
      return { success: true };
    } catch (error) {
      console.error('Error al crear movimiento:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      return { success: false, errors: { general: 'Error al crear el movimiento' } };
    }
  };

  const actualizar = async (id: number, movimiento: Partial<Movimiento>) => {
    try {
      // Validar datos primero
      const validation = validateMovimiento(movimientoUpdateSchema, movimiento);
      if (!validation.success) {
        setValidationErrors(validation.errors);
        return { success: false, errors: validation.errors };
      }
      
      setValidationErrors(null);
      await actualizarMovimiento(id, validation.data as Partial<Movimiento>);
      await fetchMovimientos();
      return { success: true };
    } catch (error) {
      console.error('Error al actualizar movimiento:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      return { success: false, errors: { general: 'Error al actualizar el movimiento' } };
    }
  };

  const eliminar = async (id: number) => {
    try {
      await eliminarMovimiento(id);
      setMovimientos((prev) => prev.filter((m) => m.id_movimiento !== id));
      return { success: true };
    } catch (error) {
      console.error('Error al eliminar movimiento:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      return { success: false, errors: { general: 'Error al eliminar el movimiento' } };
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
    movimientos,
    loading,
    error,
    validationErrors,
    mostrarErrores,
    fetchMovimientos,
    crearMovimiento: crear,
    actualizarMovimiento: actualizar,
    eliminarMovimiento: eliminar,
  };
}
