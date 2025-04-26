import { useCallback, useEffect, useState } from 'react';
import { Usuario } from '../types/usuario';
import { getUsuarios, crearUsuario, actualizarUsuario, eliminarUsuario } from '../api/usuariosApi';

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
      setValidationErrors(null);
      await crearUsuario(usuario);
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
      setValidationErrors(null);
      await actualizarUsuario(id, usuario);
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
