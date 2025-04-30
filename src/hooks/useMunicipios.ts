import { useCallback, useEffect, useState } from 'react';
import { Municipio } from '../types/municipio';
import { getMunicipios, crearMunicipio, actualizarMunicipio, eliminarMunicipio } from '../api/municipiosApi';

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
      setValidationErrors(null);
      await crearMunicipio(municipio);
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
      setValidationErrors(null);
      const municipioActual = municipios.find(m => m.id_municipio === id);
      if (!municipioActual) {
        setError('No se pudo encontrar el municipio a actualizar');
        return { success: false, errors: { general: 'No se pudo encontrar el municipio a actualizar' } };
      }
      const municipioCompleto: Omit<Municipio, 'id_municipio'> = {
        nombre_municipio: municipio.nombre_municipio ?? municipioActual.nombre_municipio,
        fecha_creacion: municipio.fecha_creacion ?? municipioActual.fecha_creacion,
        fecha_modificacion: municipio.fecha_modificacion ?? municipioActual.fecha_modificacion
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
