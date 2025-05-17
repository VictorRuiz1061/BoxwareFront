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

export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:3000/dashboard', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });
    if (!response.ok) {
      throw new Error('Error al obtener estadísticas del dashboard');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener estadísticas del dashboard:', error);
    throw error;
  }
};