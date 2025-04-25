import { useCallback, useEffect, useState } from 'react';
import { Programa } from '../types/programa';
import { getProgramas, crearPrograma, actualizarPrograma, eliminarPrograma } from '../api/programasApi';
import { z } from 'zod';

// Esquema de validación integrado
const programaSchema = z.object({
  nombre_programa: z.string()
    .min(3, { message: 'El nombre del programa debe tener al menos 3 caracteres' })
    .max(100, { message: 'El nombre del programa no debe exceder los 100 caracteres' }),
  area_id: z.number({
    required_error: 'El ID del área es requerido',
    invalid_type_error: 'El ID del área debe ser un número'
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
const programaUpdateSchema = programaSchema.partial();

// Función para validar con Zod
const validatePrograma = <T>(schema: z.ZodType<T>, data: any): { success: true; data: T } | { success: false; errors: Record<string, string> } => {
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

export function useProgramas() {
  const [programas, setProgramas] = useState<Programa[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string> | null>(null);

  const fetchProgramas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProgramas();
      setProgramas(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setProgramas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProgramas();
  }, [fetchProgramas]);

  const crear = async (programa: Omit<Programa, 'id_programa'>) => {
    try {
      // Validar datos primero
      const validation = validatePrograma(programaSchema, programa);
      if (!validation.success) {
        setValidationErrors(validation.errors);
        return { success: false, errors: validation.errors };
      }
      
      setValidationErrors(null);
      await crearPrograma(validation.data as Omit<Programa, 'id_programa'>);
      await fetchProgramas();
      return { success: true };
    } catch (error) {
      console.error('Error al crear programa:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      return { success: false, errors: { general: 'Error al crear el programa' } };
    }
  };

  const actualizar = async (id: number, programa: Partial<Programa>) => {
    try {
      // Validar datos primero
      const validation = validatePrograma(programaUpdateSchema, programa);
      if (!validation.success) {
        setValidationErrors(validation.errors);
        return { success: false, errors: validation.errors };
      }
      
      setValidationErrors(null);
      await actualizarPrograma(id, validation.data as Partial<Programa>);
      await fetchProgramas();
      return { success: true };
    } catch (error) {
      console.error('Error al actualizar programa:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      return { success: false, errors: { general: 'Error al actualizar el programa' } };
    }
  };

  const eliminar = async (id: number) => {
    try {
      await eliminarPrograma(id);
      setProgramas((prev) => prev.filter((p) => p.id_programa !== id));
      return { success: true };
    } catch (error) {
      console.error('Error al eliminar programa:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      return { success: false, errors: { general: 'Error al eliminar el programa' } };
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
    programas, 
    loading, 
    error,
    validationErrors,
    mostrarErrores,
    fetchProgramas, 
    crearPrograma: crear, 
    actualizarPrograma: actualizar, 
    eliminarPrograma: eliminar 
  };
}
