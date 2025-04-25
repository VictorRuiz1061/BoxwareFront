import { useCallback, useEffect, useState } from 'react';
import { Ficha } from '../types/ficha';
import { getFichas, crearFicha, actualizarFicha, eliminarFicha } from '../api/fichasApi';
import { z } from 'zod';

// Esquema de validación integrado
const fichaSchema = z.object({
  codigo_ficha: z.string()
    .min(3, { message: 'El código de la ficha debe tener al menos 3 caracteres' })
    .max(20, { message: 'El código de la ficha no debe exceder los 20 caracteres' }),
  nombre_programa: z.string()
    .min(3, { message: 'El nombre del programa debe tener al menos 3 caracteres' })
    .max(100, { message: 'El nombre del programa no debe exceder los 100 caracteres' }),
  fecha_inicio: z.string()
    .refine(date => !isNaN(Date.parse(date)), {
      message: 'Fecha de inicio inválida',
    }),
  fecha_fin: z.string()
    .refine(date => !isNaN(Date.parse(date)), {
      message: 'Fecha de fin inválida',
    }),
  instructor_id: z.number({
    required_error: 'El ID del instructor es requerido',
    invalid_type_error: 'El ID del instructor debe ser un número'
  }).optional(),
  programa_id: z.number({
    required_error: 'El ID del programa es requerido',
    invalid_type_error: 'El ID del programa debe ser un número'
  }).optional(),
  usuario_ficha_id: z.number({
    required_error: 'El ID del usuario de la ficha es requerido',
    invalid_type_error: 'El ID del usuario de la ficha debe ser un número'
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
const fichaUpdateSchema = fichaSchema.partial();

// Función para validar con Zod
const validateFicha = <T>(schema: z.ZodType<T>, data: any): { success: true; data: T } | { success: false; errors: Record<string, string> } => {
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

export function useFichas() {
  const [fichas, setFichas] = useState<Ficha[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string> | null>(null);

  const fetchFichas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFichas();
      setFichas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar las fichas:', err);
      setError('Error al cargar las fichas');
      setFichas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFichas();
  }, [fetchFichas]);

  const crear = async (ficha: Omit<Ficha, 'id_ficha'>) => {
    try {
      // Validar datos primero
      const validation = validateFicha(fichaSchema, ficha);
      if (!validation.success) {
        setValidationErrors(validation.errors);
        return { success: false, errors: validation.errors };
      }
      
      setValidationErrors(null);
      // Utilizamos type assertion para asegurar la compatibilidad de tipos
      await crearFicha(validation.data as Omit<Ficha, 'id_ficha'>);
      await fetchFichas();
      return { success: true };
    } catch (error) {
      console.error('Error al crear ficha:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      return { success: false, errors: { general: 'Error al crear la ficha' } };
    }
  };

  const actualizar = async (id: number, ficha: Partial<Ficha>) => {
    try {
      // Validar datos primero
      const validation = validateFicha(fichaUpdateSchema, ficha);
      if (!validation.success) {
        setValidationErrors(validation.errors);
        return { success: false, errors: validation.errors };
      }
      
      setValidationErrors(null);
      // Utilizamos type assertion para asegurar la compatibilidad de tipos
      await actualizarFicha(id, validation.data as Partial<Ficha>);
      await fetchFichas();
      return { success: true };
    } catch (error) {
      console.error('Error al actualizar ficha:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      return { success: false, errors: { general: 'Error al actualizar la ficha' } };
    }
  };

  const eliminar = async (id: number) => {
    try {
      await eliminarFicha(id);
      setFichas((prev) => prev.filter((f) => f.id_ficha !== id));
      return { success: true };
    } catch (error) {
      console.error('Error al eliminar ficha:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      return { success: false, errors: { general: 'Error al eliminar la ficha' } };
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
    fichas,
    loading,
    error,
    validationErrors,
    mostrarErrores,
    fetchFichas,
    crearFicha: crear,
    actualizarFicha: actualizar,
    eliminarFicha: eliminar,
  };
}
