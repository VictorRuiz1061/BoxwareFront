import { useCallback, useEffect, useState } from 'react';
import { Area } from '../types/area';
import { getAreas, crearArea, actualizarArea, eliminarArea } from '../api/areasApi';

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
    try {
      setValidationErrors(null);
      await crearArea(area);
      await fetchAreas();
      return { success: true };
    } catch (error) {
      console.error('Error al crear área:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      return { success: false, errors: { general: 'Error al crear el área' } };
    }
  };

  const actualizar = async (id: number, area: Partial<Area>) => {
    try {
      setValidationErrors(null);
      await actualizarArea(id, area);
      await fetchAreas();
      return { success: true };
    } catch (error) {
      console.error('Error al actualizar área:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      return { success: false, errors: { general: 'Error al actualizar el área' } };
    }
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
