import { useCallback, useEffect, useState } from 'react';
import { Ficha } from '../types/ficha';
import { getFichas, crearFicha, actualizarFicha, eliminarFicha } from '../api/fichasApi';

export function useFichas() {
  const [fichas, setFichas] = useState<Ficha[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string> | null>(null);

  const fetchFichas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFichas();
      setFichas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar las fichas:', err);
      setError('Error al cargar las fichas');
      setFichas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFichas();
  }, [fetchFichas]);

  const crear = async (ficha: Ficha) => {
    try {
      setValidationErrors(null);
      await crearFicha(ficha);
      await fetchFichas();
      return { success: true };
    } catch (error) {
      console.error('Error al crear ficha:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      return { success: false, errors: { general: 'Error al crear la ficha' } };
    }
  };

  const actualizar = async (id: number, ficha: Partial<Ficha>) => {
    try {
      setValidationErrors(null);
      await actualizarFicha(id, ficha);
      await fetchFichas();
      return { success: true };
    } catch (error) {
      console.error('Error al actualizar ficha:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      return { success: false, errors: { general: 'Error al actualizar la ficha' } };
    }
  };

  const eliminar = async (id: number) => {
    try {
      await eliminarFicha(id);
      setFichas((prev) => prev.filter((f) => f.id_ficha !== id));
      return { success: true };
    } catch (error) {
      console.error('Error al eliminar ficha:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      return { success: false, errors: { general: 'Error al eliminar la ficha' } };
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
    fichas,
    loading,
    error,
    validationErrors,
    mostrarErrores,
    fetchFichas,
    crearFicha: crear,
    actualizarFicha: actualizar,
    eliminarFicha: eliminar,
  };
}
