import { useCallback, useEffect, useState } from 'react';
import { getDashboardStats } from '../../api/dashboardApi';

interface DashboardStats {
  totalUsuarios: number;
  totalMovimientos: number;
  totalMateriales: number;
  totalSitios: number;
  movimientosPorMes: { 
    mes: string; 
    entrada: number; 
    salida: number;
  }[];
  materiales: {
    tipo: string;
    cantidad: number;
  }[];
  movimientoRecientes: {
    descripcion: string;
    fecha: string;
    estado: string;
  }[];
}

export function useGetDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (e) {
      setError('Error al cargar estadísticas del dashboard');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refreshStats: fetchStats
  };
} 