import { useCallback, useEffect, useState } from 'react';
import { Sitio } from '../types/sitio';
import { getSitios, crearSitio, actualizarSitio, eliminarSitio } from '../api/sitiosApi';

export function useSitios() {
  const [sitios, setSitios] = useState<Sitio[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSitios = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getSitios();
      setSitios(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSitios();
  }, [fetchSitios]);

  const handleCrearSitio = async (sitio: Omit<Sitio, 'id_sitio'>) => {
    await crearSitio(sitio);
    await fetchSitios();
  };
  const handleActualizarSitio = async (id: number, sitio: Omit<Sitio, 'id_sitio'>) => {
    await actualizarSitio(id, sitio);
    await fetchSitios();
  };
  const handleEliminarSitio = async (id: number) => {
    await eliminarSitio(id);
    await fetchSitios();
  };

  return {
    sitios,
    loading,
    crearSitio: handleCrearSitio,
    actualizarSitio: handleActualizarSitio,
    eliminarSitio: handleEliminarSitio,
  };
}
