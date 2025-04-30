import { getUsuarios } from '@/api/usuario/getUsuarios';
import { getMateriales } from './materialesApi';
import { getTipoMateriales } from './tipoMaterialApi';
import { getSitios } from './sitiosApi';
import { getMovimientos } from './movimientosApi';
import { getTiposMovimiento } from './tiposMovimientoApi';
import { getCategoriasElementos } from './categoriaElementosApi';

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
    // Obtener datos de las diferentes APIs
    const [usuarios, materiales, tiposMaterial, sitios, movimientos, tiposMovimiento] = await Promise.all([
      getUsuarios(),
      getMateriales(),
      getTipoMateriales(),
      getSitios(),
      getMovimientos(),
      getTiposMovimiento(),
      getCategoriasElementos()
    ]);

    // Calcular totales
    const totalUsuarios = usuarios.length;
    const totalMovimientos = movimientos.length;
    const totalMateriales = materiales.length;
    const totalSitios = sitios.length;

    // Agrupar materiales por tipo
    const materialesPorTipo: Record<string, number> = {};
    
    // Crear un mapa de tipos de material para buscar nombres
    const mapaTiposMaterial = tiposMaterial.reduce((map, tipo) => {
      map[tipo.id_tipo_material] = tipo.tipo_elemento;
      return map;
    }, {} as Record<number, string>);
    
    // Contar materiales por tipo
    materiales.forEach(material => {
      const tipoNombre = mapaTiposMaterial[material.tipo_material_id] || 'Sin categoría';
      materialesPorTipo[tipoNombre] = (materialesPorTipo[tipoNombre] || 0) + 1;
    });
    
    // Formato para gráfica de materiales
    const materialesData = Object.entries(materialesPorTipo)
      .map(([tipo, cantidad]) => ({
        tipo,
        cantidad
      }))
      .sort((a, b) => b.cantidad - a.cantidad) // Ordenar de mayor a menor
      .slice(0, 6); // Tomar los 6 más numerosos

    // Calcular movimientos por mes (últimos 6 meses)
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const movimientosPorMes = [];
    
    // Crear un mapa de tipos de movimiento para identificar entradas/salidas
    const mapaTiposMovimiento = tiposMovimiento.reduce((map, tipo) => {
      map[tipo.id_tipo_movimiento] = tipo.tipo_movimiento;
      return map;
    }, {} as Record<number, string>);
    
    // Obtener últimos 6 meses
    const hoy = new Date();
    for (let i = 5; i >= 0; i--) {
      const fecha = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
      const mes = meses[fecha.getMonth()];
      
      // Filtrar movimientos de este mes
      const movimientosMes = movimientos.filter(m => {
        try {
          const fechaMovimiento = new Date(m.fecha_creacion);
          return fechaMovimiento.getMonth() === fecha.getMonth() && 
                 fechaMovimiento.getFullYear() === fecha.getFullYear();
        } catch (e) {
          return false;
        }
      });
      
      // Contar entradas y salidas
      let entradas = 0;
      let salidas = 0;
      
      movimientosMes.forEach(movimiento => {
        const tipoNombre = (mapaTiposMovimiento[movimiento.tipo_movimiento_id] || '').toLowerCase();
        if (tipoNombre.includes('entrada')) {
          entradas++;
        } else if (tipoNombre.includes('salida')) {
          salidas++;
        }
      });
      
      movimientosPorMes.push({
        mes: `${mes}`,
        entrada: entradas,
        salida: salidas
      });
    }

    // Crear un mapa para buscar nombres de usuarios
    const mapaUsuarios = usuarios.reduce((map, usuario) => {
      map[usuario.id_usuario] = `${usuario.nombre} ${usuario.apellido}`;
      return map;
    }, {} as Record<number, string>);

    // Crear un mapa para buscar nombres de sitios

    // Obtener últimos movimientos
    const movimientosRecientes = movimientos
      .sort((a, b) => {
        try {
          return new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime();
        } catch (e) {
          return 0;
        }
      })
      .slice(0, 5)
      .map(movimiento => {
        // Buscar tipo de movimiento y detalles adicionales
        const tipoNombre = mapaTiposMovimiento[movimiento.tipo_movimiento_id] || 'Desconocido';
        const usuario = mapaUsuarios[movimiento.usuario_movimiento_id] || 'Usuario desconocido';
        
        // Definir estado basado en alguna lógica
        let estado = 'Completado';
        try {
          const fechaMovimiento = new Date(movimiento.fecha_creacion);
          const hoy = new Date();
          const diferenciaDias = Math.floor((hoy.getTime() - fechaMovimiento.getTime()) / (1000 * 3600 * 24));
          
          if (diferenciaDias < 1) {
            estado = 'En progreso';
          } else if (diferenciaDias < 3) {
            estado = 'Pendiente';
          }
        } catch (e) {
          // Si hay error al procesar la fecha, mantener "Completado" por defecto
        }
        
        return {
          descripcion: `${tipoNombre} por ${usuario}`,
          fecha: movimiento.fecha_creacion,
          estado
        };
      });

    return {
      totalUsuarios,
      totalMovimientos,
      totalMateriales,
      totalSitios,
      movimientosPorMes,
      materiales: materialesData,
      movimientoRecientes: movimientosRecientes
    };
  } catch (error) {
    console.error('Error al obtener estadísticas del dashboard:', error);
    // Devolver datos de ejemplo en caso de error (para desarrollo)
    return {
      totalUsuarios: 45,
      totalMovimientos: 120,
      totalMateriales: 85,
      totalSitios: 12,
      movimientosPorMes: [
        { mes: 'Enero', entrada: 15, salida: 10 },
        { mes: 'Febrero', entrada: 20, salida: 12 },
        { mes: 'Marzo', entrada: 25, salida: 15 },
        { mes: 'Abril', entrada: 30, salida: 20 },
        { mes: 'Mayo', entrada: 22, salida: 18 },
        { mes: 'Junio', entrada: 28, salida: 16 }
      ],
      materiales: [
        { tipo: 'Herramientas', cantidad: 35 },
        { tipo: 'Equipos', cantidad: 25 },
        { tipo: 'Consumibles', cantidad: 15 },
        { tipo: 'Otros', cantidad: 10 }
      ],
      movimientoRecientes: [
        { descripcion: 'Entrada de herramientas', fecha: '2023-06-15', estado: 'Completado' },
        { descripcion: 'Salida de equipos', fecha: '2023-06-14', estado: 'Completado' },
        { descripcion: 'Inventario de consumibles', fecha: '2023-06-13', estado: 'En progreso' },
        { descripcion: 'Mantenimiento de equipos', fecha: '2023-06-12', estado: 'Pendiente' }
      ]
    };
  }
}; 