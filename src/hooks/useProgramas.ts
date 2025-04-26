import { useCallback, useEffect, useState } from 'react';
import { Programa } from '../types/programa';
import { getProgramas, crearPrograma, actualizarPrograma, eliminarPrograma } from '../api/programasApi';

export function useProgramas() {
  const [programas, setProgramas] = useState<Programa[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string> | null>(null);

  const fetchProgramas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProgramas();
      setProgramas(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setProgramas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProgramas();
  }, [fetchProgramas]);

  const crear = async (programa: Omit<Programa, 'id_programa'>) => {
    try {
      setValidationErrors(null);
      await crearPrograma(programa);
      await fetchProgramas();
      return { success: true };
    } catch (error) {
      console.error('Error al crear programa:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      return { success: false, errors: { general: 'Error al crear el programa' } };
    }
  };

  const actualizar = async (id: number, programa: Partial<Programa>) => {
    try {
      setValidationErrors(null);
      await actualizarPrograma(id, programa);
      await fetchProgramas();
      return { success: true };
    } catch (error) {
      console.error('Error al actualizar programa:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      return { success: false, errors: { general: 'Error al actualizar el programa' } };
    }
  };

  const eliminar = async (id: number) => {
    try {
      await eliminarPrograma(id);
      setProgramas((prev) => prev.filter((p) => p.id_programa !== id));
      return { success: true };
    } catch (error) {
      console.error('Error al eliminar programa:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      return { success: false, errors: { general: 'Error al eliminar el programa' } };
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
    programas, 
    loading, 
    error,
    validationErrors,
    mostrarErrores,
    fetchProgramas, 
    crearPrograma: crear, 
    actualizarPrograma: actualizar, 
    eliminarPrograma: eliminar 
  };
}
