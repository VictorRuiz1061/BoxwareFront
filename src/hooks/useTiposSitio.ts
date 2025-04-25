import { useCallback, useEffect, useState } from 'react';
import { TipoSitio } from '../types/tipoSitio';
import { getTiposSitio, crearTipoSitio, actualizarTipoSitio, eliminarTipoSitio } from '../api/tiposSitioApi';
import { z } from 'zod';

// Esquema de validación integrado
const tipoSitioSchema = z.object({
  nombre_tipo_sitio: z.string()
    .min(3, { message: 'El nombre del tipo de sitio debe tener al menos 3 caracteres' })
    .max(100, { message: 'El nombre del tipo de sitio no debe exceder los 100 caracteres' }),
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
const tipoSitioUpdateSchema = tipoSitioSchema.partial();

// Función para validar con Zod
const validateTipoSitio = <T>(schema: z.ZodType<T>, data: any): { success: true; data: T } | { success: false; errors: Record<string, string> } => {
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

export function useTiposSitio() {
  const [tiposSitio, setTiposSitio] = useState<TipoSitio[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string> | null>(null);

  const fetchTiposSitio = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTiposSitio();
      setTiposSitio(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setTiposSitio([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTiposSitio();
  }, [fetchTiposSitio]);

  const crear = async (tipoSitio: Omit<TipoSitio, 'id_tipo_sitio'>) => {
    try {
      // Validar datos primero
      const validation = validateTipoSitio(tipoSitioSchema, tipoSitio);
      if (!validation.success) {
        setValidationErrors(validation.errors);
        return { success: false, errors: validation.errors };
      }
      
      setValidationErrors(null);
      await crearTipoSitio(validation.data as Omit<TipoSitio, 'id_tipo_sitio'>);
      await fetchTiposSitio();
      return { success: true };
    } catch (error) {
      console.error('Error al crear tipo de sitio:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      return { success: false, errors: { general: 'Error al crear el tipo de sitio' } };
    }
  };

  const actualizar = async (id: number, tipoSitio: Partial<TipoSitio>) => {
    try {
      // Validar datos primero
      const validation = validateTipoSitio(tipoSitioUpdateSchema, tipoSitio);
      if (!validation.success) {
        setValidationErrors(validation.errors);
        return { success: false, errors: validation.errors };
      }
      
      setValidationErrors(null);
      await actualizarTipoSitio(id, validation.data as Partial<TipoSitio>);
      await fetchTiposSitio();
      return { success: true };
    } catch (error) {
      console.error('Error al actualizar tipo de sitio:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      return { success: false, errors: { general: 'Error al actualizar el tipo de sitio' } };
    }
  };

  const eliminar = async (id: number) => {
    try {
      await eliminarTipoSitio(id);
      setTiposSitio((prev) => prev.filter((t) => t.id_tipo_sitio !== id));
      return { success: true };
    } catch (error) {
      console.error('Error al eliminar tipo de sitio:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      return { success: false, errors: { general: 'Error al eliminar el tipo de sitio' } };
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
    tiposSitio, 
    loading, 
    error, 
    validationErrors,
    mostrarErrores,
    fetchTiposSitio, 
    crearTipoSitio: crear, 
    actualizarTipoSitio: actualizar, 
    eliminarTipoSitio: eliminar 
  };
}
