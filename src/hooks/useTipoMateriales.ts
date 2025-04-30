import { useCallback, useEffect, useState } from 'react';
import { TipoMaterial } from '../types/tipoMaterial';
import { getTipoMateriales, crearTipoMaterial, actualizarTipoMaterial, eliminarTipoMaterial } from '../api/tipoMaterialApi';

export function useTipoMateriales() {
  const [tipoMateriales, setTipoMateriales] = useState<TipoMaterial[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTipoMateriales = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTipoMateriales();
      setTipoMateriales(data);
      setError(null);
    } catch (e) {
      setError('Error al cargar los tipos de material');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTipoMateriales();
  }, [fetchTipoMateriales]);

  const crear = async (tipoMaterial: Omit<TipoMaterial, 'id_tipo_material'>) => {
    await crearTipoMaterial(tipoMaterial);
    await fetchTipoMateriales();
  };

  const actualizar = async (id: number, tipoMaterial: Partial<TipoMaterial>) => {
    await actualizarTipoMaterial(id, tipoMaterial);
    await fetchTipoMateriales();
  };

  const eliminar = async (id: number) => {
    await eliminarTipoMaterial(id);
    await fetchTipoMateriales();
  };

  return {
    tipoMateriales,
    loading,
    error,
    crearTipoMaterial: crear,
    actualizarTipoMaterial: actualizar,
    eliminarTipoMaterial: eliminar,
    fetchTipoMateriales,
  };
}
