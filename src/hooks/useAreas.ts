import { useCallback, useEffect, useState } from 'react';
import { Area } from '../types/area';
import { getAreas, crearArea, actualizarArea, eliminarArea } from '../api/areasApi';
import { z } from 'zod';

// Esquemas de validación integrados en el hook
const areaSchema = z.object({
  nombre_area: z.string()
    .min(3, { message: 'El nombre del área debe tener al menos 3 caracteres' })
    .max(100, { message: 'El nombre del área no debe exceder los 100 caracteres' }),
  fecha_creacion: z.string()
    .refine(date => !isNaN(Date.parse(date)), {
      message: 'Fecha de creación inválida',
    }),
  fecha_modificacion: z.string()
    .refine(date => !isNaN(Date.parse(date)), {
      message: 'Fecha de modificación inválida',
    }),
});

// Esquema para actualizaciones (todos los campos opcionales)
const areaUpdateSchema = areaSchema.partial();

// Función para validar con Zod
const validateArea = <T>(schema: z.ZodType<T>, data: any): { success: true; data: T } | { success: false; errors: Record<string, string> } => {
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

export function useAreas() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string> | null>(null);

  const fetchAreas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAreas();
      setAreas(data);
    } catch (err) {
      setError('Error al cargar las áreas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAreas();
  }, [fetchAreas]);

  const crear = async (area: Omit<Area, 'id_area'>) => {
    // Validar los datos primero
    const validation = validateArea(areaSchema, area);
    if (!validation.success) {
      setValidationErrors(validation.errors);
      return { success: false, errors: validation.errors };
    }
    
    setValidationErrors(null);
    await crearArea(validation.data);
    await fetchAreas();
    return { success: true };
  };

  const actualizar = async (id: number, area: Partial<Area>) => {
    // Validar los datos primero
    const validation = validateArea(areaUpdateSchema, area);
    if (!validation.success) {
      setValidationErrors(validation.errors);
      return { success: false, errors: validation.errors };
    }
    
    setValidationErrors(null);
    await actualizarArea(id, validation.data);
    await fetchAreas();
    return { success: true };
  };

  const eliminar = async (id: number) => {
    await eliminarArea(id);
    setAreas((prev) => prev.filter((a) => a.id_area !== id));
    return { success: true };
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
    areas,
    loading,
    error,
    validationErrors,
    mostrarErrores,
    fetchAreas,
    crearArea: crear,
    actualizarArea: actualizar,
    eliminarArea: eliminar,
  };
}
