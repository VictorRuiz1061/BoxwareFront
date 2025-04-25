import { useState } from 'react';
import { Modulo } from '../types/modulo';
import { getModulos, crearModulo, actualizarModulo, eliminarModulo } from '../api/modulosApi';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Clave para la query de modulos
const MODULOS_QUERY_KEY = ['modulos'];

// Esquema de validación integrado
const moduloSchema = z.object({
  fecha_accion: z.string()
    .refine(date => !isNaN(Date.parse(date)), {
      message: 'Fecha de acción inválida',
    }),
  rutas: z.string()
    .min(1, { message: 'La ruta es requerida' })
    .max(200, { message: 'La ruta no debe exceder los 200 caracteres' }),
  descripcion_ruta: z.string()
    .min(3, { message: 'La descripción debe tener al menos 3 caracteres' })
    .max(500, { message: 'La descripción no debe exceder los 500 caracteres' }),
  bandera_accion: z.union([
    z.number(),
    z.string().transform((val) => parseInt(val, 10))
  ])
    .refine((val) => !isNaN(val as number), {
      message: 'La bandera de acción debe ser un número válido',
    }),
  mensaje_cambio: z.string()
    .min(3, { message: 'El mensaje de cambio debe tener al menos 3 caracteres' })
    .max(200, { message: 'El mensaje de cambio no debe exceder los 200 caracteres' }),
  id_modulo: z.number().optional(),
});

// Esquema para actualizaciones (todos los campos opcionales)
const moduloUpdateSchema = moduloSchema.partial();

// Función para validar con Zod
const validateModulo = <T>(schema: z.ZodType<T>, data: any): { success: true; data: T } | { success: false; errors: Record<string, string> } => {
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

export function useModulos() {
  const [validationErrors, setValidationErrors] = useState<Record<string, string> | null>(null);
  // Obtener la instancia del queryClient
  const queryClient = useQueryClient();

  // Query para obtener los módulos
  const { 
    data: modulos = [], 
    isLoading: loading, 
    error: queryError,
    refetch 
  } = useQuery({
    queryKey: MODULOS_QUERY_KEY,
    queryFn: async () => {
      try {
        const data = await getModulos();
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error('Error al cargar los módulos:', error);
        throw new Error('Error al cargar los módulos');
      }
    }
  });

  // Mutation para crear un módulo
  const createMutation = useMutation({
    mutationFn: (moduloData: Omit<Modulo, 'id_modulo'>) => {
      return crearModulo(moduloData);
    },
    onSuccess: () => {
      // Invalidar y volver a cargar los datos
      queryClient.invalidateQueries({ queryKey: MODULOS_QUERY_KEY });
    }
  });

  // Mutation para actualizar un módulo
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Modulo> }) => {
      return actualizarModulo(id, data);
    },
    onSuccess: () => {
      // Invalidar y volver a cargar los datos
      queryClient.invalidateQueries({ queryKey: MODULOS_QUERY_KEY });
    }
  });

  // Mutation para eliminar un módulo
  const deleteMutation = useMutation({
    mutationFn: (id: number) => {
      return eliminarModulo(id);
    },
    onSuccess: (_, id) => {
      // Optimistic update - actualiza el cache inmediatamente
      queryClient.setQueryData(MODULOS_QUERY_KEY, (oldData: Modulo[] | undefined) => {
        return oldData ? oldData.filter(m => m.id_modulo !== id) : [];
      });
    }
  });

  // Función para crear un módulo con validación
  const crear = async (modulo: Omit<Modulo, 'id_modulo'> | Record<string, any>) => {
    // Validar datos primero
    const validation = validateModulo(moduloSchema, modulo);
    if (!validation.success) {
      setValidationErrors(validation.errors);
      return { success: false, errors: validation.errors };
    }
    
    setValidationErrors(null);
    const moduloValidado = {
      ...validation.data,
      fecha_accion: validation.data.fecha_accion || new Date().toISOString()
    } as Omit<Modulo, 'id_modulo'>;
    
    await createMutation.mutateAsync(moduloValidado);
    return { success: true };
  };

  // Función para actualizar un módulo con validación
  const actualizar = async (id: number, modulo: Partial<Modulo> | Record<string, any>) => {
    // Validar datos primero
    const validation = validateModulo(moduloUpdateSchema, modulo);
    if (!validation.success) {
      setValidationErrors(validation.errors);
      return { success: false, errors: validation.errors };
    }
    
    setValidationErrors(null);
    const updateData = {
      ...validation.data,
      fecha_accion: new Date().toISOString()
    } as Partial<Modulo>;
    
    await updateMutation.mutateAsync({ id, data: updateData });
    return { success: true };
  };

  // Función para eliminar un módulo
  const eliminar = async (id: number) => {
    await deleteMutation.mutateAsync(id);
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

  // Determinar el error general (de query o mutaciones)
  const error = queryError ? 
    (queryError instanceof Error ? queryError.message : 'Error desconocido') : 
    (createMutation.error || updateMutation.error || deleteMutation.error) ? 
      'Error en la operación' : null;

  return {
    modulos,
    loading,
    error,
    validationErrors,
    mostrarErrores,
    // Mantenemos los nombres originales para compatibilidad con los componentes existentes
    crear,
    actualizar,
    eliminar,
    refetch
  };
};
