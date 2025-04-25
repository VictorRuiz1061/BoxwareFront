import { useCallback, useEffect, useState } from 'react';
import { Municipio } from '../types/municipio';
import { getMunicipios, crearMunicipio, actualizarMunicipio, eliminarMunicipio } from '../api/municipiosApi';
import { z } from 'zod';

// Esquema de validación integrado
const municipioSchema = z.object({
  nombre_municipio: z.string()
    .min(3, { message: 'El nombre del municipio debe tener al menos 3 caracteres' })
    .max(100, { message: 'El nombre del municipio no debe exceder los 100 caracteres' }),
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
const municipioUpdateSchema = municipioSchema.partial();

// Función para validar con Zod
const validateMunicipio = <T>(schema: z.ZodType<T>, data: any): { success: true; data: T } | { success: false; errors: Record<string, string> } => {
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

export function useMunicipios() {
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string> | null>(null);

  const fetchMunicipios = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMunicipios();
      setMunicipios(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar los municipios:', err);
      setError('Error al cargar los municipios');
      setMunicipios([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMunicipios();
  }, [fetchMunicipios]);

  const crear = async (municipio: Omit<Municipio, 'id_municipio'>) => {
    try {
      // Validar datos primero
      const validation = validateMunicipio(municipioSchema, municipio);
      if (!validation.success) {
        setValidationErrors(validation.errors);
        return { success: false, errors: validation.errors };
      }
      
      setValidationErrors(null);
      await crearMunicipio(validation.data as Omit<Municipio, 'id_municipio'>);
      await fetchMunicipios();
      return { success: true };
    } catch (error) {
      console.error('Error al crear municipio:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      return { success: false, errors: { general: 'Error al crear el municipio' } };
    }
  };

  const actualizar = async (id: number, municipio: Partial<Municipio>) => {
    try {
      // Validar datos primero
      const validation = validateMunicipio(municipioUpdateSchema, municipio);
      if (!validation.success) {
        setValidationErrors(validation.errors);
        return { success: false, errors: validation.errors };
      }
      
      setValidationErrors(null);
      // Convertir a tipo completo ya que la API espera Omit<Municipio, 'id_municipio'>
      const municipioActual = municipios.find(m => m.id_municipio === id);
      if (!municipioActual) {
        setError('No se pudo encontrar el municipio a actualizar');
        return { success: false, errors: { general: 'No se pudo encontrar el municipio a actualizar' } };
      }
      
      const municipioCompleto: Omit<Municipio, 'id_municipio'> = {
        nombre_municipio: municipio.nombre_municipio || municipioActual.nombre_municipio,
        fecha_creacion: municipio.fecha_creacion || municipioActual.fecha_creacion,
        fecha_modificacion: municipio.fecha_modificacion || municipioActual.fecha_modificacion
      };
      
      await actualizarMunicipio(id, municipioCompleto);
      await fetchMunicipios();
      return { success: true };
    } catch (error) {
      console.error('Error al actualizar municipio:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      return { success: false, errors: { general: 'Error al actualizar el municipio' } };
    }
  };

  const eliminar = async (id: number) => {
    try {
      await eliminarMunicipio(id);
      setMunicipios((prev) => prev.filter((m) => m.id_municipio !== id));
      return { success: true };
    } catch (error) {
      console.error('Error al eliminar municipio:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      return { success: false, errors: { general: 'Error al eliminar el municipio' } };
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
    municipios,
    loading,
    error,
    validationErrors,
    mostrarErrores,
    fetchMunicipios,
    crearMunicipio: crear,
    actualizarMunicipio: actualizar,
    eliminarMunicipio: eliminar,
  };
}
