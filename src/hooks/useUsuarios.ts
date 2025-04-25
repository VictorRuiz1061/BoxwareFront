import { useCallback, useEffect, useState } from 'react';
import { Usuario } from '../types/usuario';
import { getUsuarios, crearUsuario, actualizarUsuario, eliminarUsuario } from '../api/usuariosApi';
import { z } from 'zod';

// Esquema de validación integrado
const usuarioSchema = z.object({
  nombre: z.string()
    .min(2, { message: 'El nombre debe tener al menos 2 caracteres' })
    .max(50, { message: 'El nombre no debe exceder los 50 caracteres' }),
  apellido: z.string()
    .min(2, { message: 'El apellido debe tener al menos 2 caracteres' })
    .max(50, { message: 'El apellido no debe exceder los 50 caracteres' }),
  edad: z.number({
    required_error: 'La edad es requerida',
    invalid_type_error: 'La edad debe ser un número'
  }).min(16 , { message: 'Debe ser mayor de edad (18 años)' })
    .max(100, { message: 'La edad no parece válida' }),
  cedula: z.string()
    .min(8, { message: 'La cédula debe tener al menos 8 caracteres' })
    .max(15, { message: 'La cédula no debe exceder los 15 caracteres' }),
  email: z.string()
    .email({ message: 'Correo electrónico inválido' }),
  contrasena: z.string()
    .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    .regex(/[A-Z]/, { message: 'La contraseña debe tener al menos una letra mayúscula' })
    .regex(/[a-z]/, { message: 'La contraseña debe tener al menos una letra minúscula' })
    .regex(/[0-9]/, { message: 'La contraseña debe tener al menos un número' }),
  telefono: z.string()
    .min(7, { message: 'El teléfono debe tener al menos 7 caracteres' })
    .max(15, { message: 'El teléfono no debe exceder los 15 caracteres' }),
  esta_activo: z.boolean({
    required_error: 'El estado de activación es requerido',
    invalid_type_error: 'El estado de activación debe ser un valor booleano'
  }),
  fecha_registro: z.string()
    .refine(date => !isNaN(Date.parse(date)), {
      message: 'Fecha de registro inválida',
    })
    .optional(),
  rol_id: z.number({
    required_error: 'El ID del rol es requerido',
    invalid_type_error: 'El ID del rol debe ser un número'
  }),
});

// Esquema para actualizaciones (todos los campos opcionales)
const usuarioUpdateSchema = usuarioSchema.partial();

// Función para validar con Zod
const validateUsuario = <T>(schema: z.ZodType<T>, data: any): { success: true; data: T } | { success: false; errors: Record<string, string> } => {
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

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string> | null>(null);

  const fetchUsuarios = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUsuarios();
      setUsuarios(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar los usuarios:', err);
      setError('Error al cargar los usuarios');
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  const crear = async (usuario: Omit<Usuario, 'id_usuario'>) => {
    try {
      // Validar datos primero
      const validation = validateUsuario(usuarioSchema, usuario);
      if (!validation.success) {
        setValidationErrors(validation.errors);
        return { success: false, errors: validation.errors };
      }
      
      setValidationErrors(null);
      await crearUsuario(validation.data as Omit<Usuario, 'id_usuario'>);
      await fetchUsuarios();
      return { success: true };
    } catch (error) {
      console.error('Error al crear usuario:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      return { success: false, errors: { general: 'Error al crear el usuario' } };
    }
  };

  const actualizar = async (id: number, usuario: Partial<Usuario>) => {
    try {
      // Validar datos primero
      const validation = validateUsuario(usuarioUpdateSchema, usuario);
      if (!validation.success) {
        setValidationErrors(validation.errors);
        return { success: false, errors: validation.errors };
      }
      
      setValidationErrors(null);
      await actualizarUsuario(id, validation.data as Partial<Usuario>);
      await fetchUsuarios();
      return { success: true };
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      return { success: false, errors: { general: 'Error al actualizar el usuario' } };
    }
  };

  const eliminar = async (id: number) => {
    try {
      await eliminarUsuario(id);
      setUsuarios((prev) => prev.filter((u) => u.id_usuario !== id));
      return { success: true };
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      return { success: false, errors: { general: 'Error al eliminar el usuario' } };
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
    usuarios,
    loading,
    error,
    validationErrors,
    mostrarErrores,
    fetchUsuarios,
    crearUsuario: crear,
    actualizarUsuario: actualizar,
    eliminarUsuario: eliminar,
  };
}
