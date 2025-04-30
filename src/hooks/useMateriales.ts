import { useCallback, useEffect, useState } from 'react';
import { Material } from '../types/material';
import { getMateriales, crearMaterial, actualizarMaterial, eliminarMaterial } from '../api/materialesApi';

export function useMateriales() {
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMateriales = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMateriales();
      setMateriales(data);
    } catch (err) {
      setError('Error al cargar los materiales');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMateriales();
  }, [fetchMateriales]);

  const crear = async (material: Omit<Material, 'id_material'>) => {
    await crearMaterial(material);
    await fetchMateriales();
  };

  const actualizar = async (id: number, material: Partial<Material>) => {
    await actualizarMaterial(id, material);
    await fetchMateriales();
  };

  const eliminar = async (id: number) => {
    await eliminarMaterial(id);
    setMateriales((prev) => prev.filter((m) => m.id_material !== id));
  };

  return {
    materiales,
    loading,
    error,
    fetchMateriales,
    crearMaterial: crear,
    actualizarMaterial: actualizar,
    eliminarMaterial: eliminar,
  };
}
