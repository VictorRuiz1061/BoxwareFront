import { useCallback, useEffect, useState } from 'react';
import { Sede } from '../types/sede';
import { getSedes, crearSede, actualizarSede, eliminarSede } from '../api/sedesApi';
import { z } from 'zod';

// Esquema de validación integrado
const sedeSchema = z.object({
  nombre_sede: z.string()
    .min(3, { message: 'El nombre de la sede debe tener al menos 3 caracteres' })
    .max(100, { message: 'El nombre de la sede no debe exceder los 100 caracteres' }),
  direccion_sede: z.string()
    .min(5, { message: 'La dirección debe tener al menos 5 caracteres' })
    .max(200, { message: 'La dirección no debe exceder los 200 caracteres' }),
  centro_sede_id: z.number({
    required_error: 'El ID del centro de la sede es requerido',
    invalid_type_error: 'El ID del centro de la sede debe ser un número'
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
  id_sede: z.number().optional(),
});

// Esquema para actualizaciones (todos los campos opcionales)
const sedeUpdateSchema = sedeSchema.partial();

// Función para validar con Zod
const validateSede = <T>(schema: z.ZodType<T>, data: any): { success: true; data: T } | { success: false; errors: Record<string, string> } => {
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

export function useSedes() {
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string> | null>(null);

  const fetchSedes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSedes();
      setSedes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar las sedes:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setSedes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSedes();
  }, [fetchSedes]);

  const crear = async (sedeData: Omit<Sede, 'id_sede'>) => {
    try {
      // Validar datos primero
      const validation = validateSede(sedeSchema, sedeData);
      if (!validation.success) {
        setValidationErrors(validation.errors);
        return { success: false, errors: validation.errors };
      }
      
      setValidationErrors(null);
      // Añadir un ID temporal para cumplir con la API
      const sede: Sede = {
        ...sedeData,
        id_sede: 0 // Este valor será reemplazado por el backend
      };
      await crearSede(sede);
      await fetchSedes();
      return { success: true };
    } catch (error) {
      console.error('Error al crear sede:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      return { success: false, errors: { general: 'Error al crear la sede' } };
    }
  };

  const actualizar = async (id: number, sede: Partial<Sede>) => {
    try {
      // Validar datos primero
      const validation = validateSede(sedeUpdateSchema, sede);
      if (!validation.success) {
        setValidationErrors(validation.errors);
        return { success: false, errors: validation.errors };
      }
      
      setValidationErrors(null);
      await actualizarSede(id, validation.data as Partial<Sede>);
      await fetchSedes();
      return { success: true };
    } catch (error) {
      console.error('Error al actualizar sede:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      return { success: false, errors: { general: 'Error al actualizar la sede' } };
    }
  };

  const eliminar = async (id: number) => {
    try {
      await eliminarSede(id);
      setSedes((prev) => prev.filter((s) => s.id_sede !== id));
      return { success: true };
    } catch (error) {
      console.error('Error al eliminar sede:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      return { success: false, errors: { general: 'Error al eliminar la sede' } };
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
    sedes, 
    loading, 
    error, 
    validationErrors,
    mostrarErrores,
    fetchSedes, 
    crearSede: crear, 
    actualizarSede: actualizar, 
    eliminarSede: eliminar 
  };
}
