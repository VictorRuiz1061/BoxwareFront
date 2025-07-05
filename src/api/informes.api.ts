// Funciones para obtener datos de informes desde el backend
// Todas las funciones hacen peticiones al backend con el token JWT

// Interfaces para los diferentes tipos de informes
interface MaterialPorUsuario {
  id_movimiento: number;
  material_id: number;
  nombre_material: string;
  codigo_sena: string;
  descripcion_material: string;
  id_usuario: number;
  nombre: string;
  apellido: string;
  email: string;
  tipo_movimiento: string;
  fecha_creacion: string;
}

interface InventarioSedeArea {
  id_material: number;
  nombre_material: string;
  codigo_sena: string;
  stock: number;
  unidad_medida: string;
  sede_nombre: string;
  area_nombre: string;
}

interface MovimientoHistorico {
  id_movimiento: number;
  tipo_movimiento: string;
  fecha_creacion: string;
  usuario_nombre: string;
  material_nombre: string;
  cantidad: number;
  descripcion: string;
}

interface MaterialStockMinimo {
  id_material: number;
  nombre_material: string;
  codigo_sena: string;
  stock: number;
  stock_minimo: number;
  unidad_medida: string;
}

interface MaterialMasUtilizado {
  id_material: number;
  nombre_material: string;
  codigo_sena: string;
  cantidad_movimientos: number;
  ultimo_movimiento: string;
}

interface UsuarioConMasMateriales {
  id_usuario: number;
  nombre: string;
  apellido: string;
  email: string;
  cantidad_materiales: number;
}

interface EstadoInventarioItem {
  id_material: number;
  nombre_material: string;
  codigo_sena: string;
  estado: string;
  fecha_ultimo_cambio: string;
  usuario_responsable: string;
}

interface TransferenciaSede {
  id_movimiento: number;
  fecha_creacion: string;
  sede_origen: string;
  sede_destino: string;
  material_nombre: string;
  cantidad: number;
  usuario_responsable: string;
}

interface HistorialUsuario {
  id_movimiento: number;
  usuario_nombre: string;
  tipo_movimiento: string;
  material_nombre: string;
  fecha_creacion: string;
  descripcion: string;
}

interface MaterialBaja {
  id_material: number;
  nombre_material: string;
  codigo_sena: string;
  fecha_baja: string;
  motivo_baja: string;
  usuario_responsable: string;
}

// Función auxiliar para hacer peticiones al backend
const fetchFromBackend = async <T>(endpoint: string): Promise<T[]> => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:3000/${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error al obtener datos de ${endpoint}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error en fetchFromBackend (${endpoint}):`, error);
    throw error;
  }
};

// Funciones específicas para cada tipo de informe
export const getMaterialesPorUsuario = async (): Promise<MaterialPorUsuario[]> => {
  return fetchFromBackend<MaterialPorUsuario>('informes/materiales-por-usuario');
};

export const getInventarioPorSedeArea = async (): Promise<InventarioSedeArea[]> => {
  return fetchFromBackend<InventarioSedeArea>('informes/inventario-por-sede-area');
};

export const getMovimientosHistoricos = async (): Promise<MovimientoHistorico[]> => {
  return fetchFromBackend<MovimientoHistorico>('informes/movimientos-historicos');
};

export const getMaterialesStockMinimo = async (): Promise<MaterialStockMinimo[]> => {
  return fetchFromBackend<MaterialStockMinimo>('informes/materiales-stock-minimo');
};

export const getMaterialesMasUtilizados = async (): Promise<MaterialMasUtilizado[]> => {
  return fetchFromBackend<MaterialMasUtilizado>('informes/materiales-mas-utilizados');
};

export const getUsuariosConMasMateriales = async (): Promise<UsuarioConMasMateriales[]> => {
  return fetchFromBackend<UsuarioConMasMateriales>('informes/usuarios-con-mas-materiales');
};

export const getEstadoInventario = async (): Promise<EstadoInventarioItem[]> => {
  return fetchFromBackend<EstadoInventarioItem>('informes/estado-inventario');
};

export const getTransferenciasSedes = async (): Promise<TransferenciaSede[]> => {
  return fetchFromBackend<TransferenciaSede>('informes/transferencias-sedes');
};

export const getHistorialPorUsuario = async (): Promise<HistorialUsuario[]> => {
  return fetchFromBackend<HistorialUsuario>('informes/historial-por-usuario');
};

export const getMaterialesBaja = async (): Promise<MaterialBaja[]> => {
  return fetchFromBackend<MaterialBaja>('informes/materiales-baja');
};

// Función para manejar errores o datos de ejemplo en desarrollo
export const getExampleData = <T>(type: string): T[] => {
  console.warn(`Usando datos de ejemplo para ${type}`);
  return [] as T[]; // Devuelve un array vacío por defecto
};
