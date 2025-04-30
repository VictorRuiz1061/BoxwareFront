import { useCallback, useEffect, useState } from 'react';
import { CategoriaElemento } from '../types/categoriaElemento';
import {
  getCategoriasElementos,
  crearCategoriaElemento,
  actualizarCategoriaElemento,
  eliminarCategoriaElemento
} from '../api/categoriaElementosApi';

export function useCategoriaElementos() {
  const [categorias, setCategorias] = useState<CategoriaElemento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategorias = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCategoriasElementos();
      setCategorias(data);
      setError(null);
    } catch (e) {
      setError('Error al cargar las categorías de elementos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategorias();
  }, [fetchCategorias]);

  const crear = async (values: Omit<CategoriaElemento, 'id_categoria_elemento'>) => {
    await crearCategoriaElemento(values);
    fetchCategorias();
  };
  const actualizar = async (id: number, values: Partial<CategoriaElemento>) => {
    await actualizarCategoriaElemento(id, values);
    fetchCategorias();
  };
  const eliminar = async (id: number) => {
    await eliminarCategoriaElemento(id);
    fetchCategorias();
  };

  return {
    categorias,
    loading,
    error,
    crearCategoriaElemento: crear,
    actualizarCategoriaElemento: actualizar,
    eliminarCategoriaElemento: eliminar,
  };
}
