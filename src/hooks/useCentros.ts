import { useCallback, useEffect, useState } from 'react';
import { Centro } from '../types/centro';
import { getCentros, crearCentro, actualizarCentro, eliminarCentro } from '../api/centrosApi';
import { z } from 'zod';

// Esquema de validación integrado
const centroSchema = z.object({
  id_centro: z.number().optional(), // Agregamos este campo para que sea compatible con la API
  nombre_centro: z.string()
    .min(3, { message: 'El nombre del centro debe tener al menos 3 caracteres' })
    .max(100, { message: 'El nombre del centro no debe exceder los 100 caracteres' }),
  municipio_id: z.number({
    required_error: 'El ID del municipio es requerido',
    invalid_type_error: 'El ID del municipio debe ser un número'
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
const centroUpdateSchema = centroSchema.partial();

// Función para validar con Zod
const validateCentro = <T>(schema: z.ZodType<T>, data: any): { success: true; data: T } | { success: false; errors: Record<string, string> } => {
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

export function useCentros() {
  const [centros, setCentros] = useState<Centro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string> | null>(null);

  const fetchCentros = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCentros();
      setCentros(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar los centros:', err);
      setError('Error al cargar los centros');
      setCentros([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCentros();
  }, [fetchCentros]);

  const crear = async (centroData: Omit<Centro, 'id_centro'>) => {
    // Validar datos primero
    const validation = validateCentro(centroSchema, centroData);
    if (!validation.success) {
      setValidationErrors(validation.errors);
      return { success: false, errors: validation.errors };
    }
    
    setValidationErrors(null);
    
    // Crear un objeto Centro completo para la API
    const centroValidado = {
      ...validation.data,
      id_centro: 0, // Este valor será reemplazado por el backend
      fecha_creacion: validation.data.fecha_creacion || new Date().toISOString(),
      fecha_modificacion: validation.data.fecha_modificacion || new Date().toISOString()
    } as Centro;
    
    await crearCentro(centroValidado);
    await fetchCentros();
    return { success: true };
  };

  const actualizar = async (id: number, centro: Partial<Centro>) => {
    // Validar datos primero
    const validation = validateCentro(centroUpdateSchema, centro);
    if (!validation.success) {
      setValidationErrors(validation.errors);
      return { success: false, errors: validation.errors };
    }
    
    setValidationErrors(null);
    await actualizarCentro(id, validation.data);
    await fetchCentros();
    return { success: true };
  };

  const eliminar = async (id: number) => {
    await eliminarCentro(id);
    setCentros((prev) => prev.filter((c) => c.id_centro !== id));
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
    centros,
    loading,
    error,
    validationErrors,
    mostrarErrores,
    fetchCentros,
    crearCentro: crear,
    actualizarCentro: actualizar,
    eliminarCentro: eliminar,
  };
}
