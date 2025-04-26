import { useCallback, useEffect, useState } from 'react';
import { Centro } from '../types/centro';
import { getCentros, crearCentro, actualizarCentro, eliminarCentro } from '../api/centrosApi';

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

  const crear = async (centro: Omit<Centro, 'id_centro'>) => {
    try {
      setValidationErrors(null);
      const centroConId: Centro = {
        ...centro,
        id_centro: 0 // Este valor será reemplazado por el backend
      };
      await crearCentro(centroConId);
      await fetchCentros();
      return { success: true };
    } catch (error) {
      console.error('Error al crear centro:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      return { success: false, errors: { general: 'Error al crear el centro' } };
    }
  };

  const actualizar = async (id: number, centro: Partial<Centro>) => {
    try {
      setValidationErrors(null);
      await actualizarCentro(id, centro);
      await fetchCentros();
      return { success: true };
    } catch (error) {
      console.error('Error al actualizar centro:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      return { success: false, errors: { general: 'Error al actualizar el centro' } };
    }
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
