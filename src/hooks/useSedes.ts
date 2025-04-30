import { useCallback, useEffect, useState } from 'react';
import { Sede } from '../types/sede';
import { getSedes, crearSede, actualizarSede, eliminarSede } from '../api/sedesApi';

export function useSedes() {
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string> | null>(null);

  const fetchSedes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSedes();
      setSedes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar las sedes:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setSedes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSedes();
  }, [fetchSedes]);

  const crear = async (sedeData: Omit<Sede, 'id_sede'>) => {
    try {
      setValidationErrors(null);
      const sede: Sede = {
        ...sedeData,
        id_sede: 0 // Este valor será reemplazado por el backend
      };
      await crearSede(sede);
      await fetchSedes();
      return { success: true };
    } catch (error) {
      console.error('Error al crear sede:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      return { success: false, errors: { general: 'Error al crear la sede' } };
    }
  };

  const actualizar = async (id: number, sede: Partial<Sede>) => {
    try {
      setValidationErrors(null);
      await actualizarSede(id, sede);
      await fetchSedes();
      return { success: true };
    } catch (error) {
      console.error('Error al actualizar sede:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      return { success: false, errors: { general: 'Error al actualizar la sede' } };
    }
  };

  const eliminar = async (id: number) => {
    try {
      await eliminarSede(id);
      setSedes((prev) => prev.filter((s) => s.id_sede !== id));
      return { success: true };
    } catch (error) {
      console.error('Error al eliminar sede:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      return { success: false, errors: { general: 'Error al eliminar la sede' } };
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
    sedes, 
    loading, 
    error, 
    validationErrors,
    mostrarErrores,
    fetchSedes, 
    crearSede: crear, 
    actualizarSede: actualizar, 
    eliminarSede: eliminar 
  };
}
