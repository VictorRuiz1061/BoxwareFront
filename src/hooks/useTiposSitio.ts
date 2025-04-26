import { useCallback, useEffect, useState } from 'react';
import { TipoSitio } from '../types/tipoSitio';
import { getTiposSitio, crearTipoSitio, actualizarTipoSitio, eliminarTipoSitio } from '../api/tiposSitioApi';

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
      setValidationErrors(null);
      await crearTipoSitio(tipoSitio);
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
      setValidationErrors(null);
      await actualizarTipoSitio(id, tipoSitio);
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
