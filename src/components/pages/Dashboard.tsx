import React, { useState, useEffect } from "react";
import { Users, Package, MapPin } from "lucide-react"; 

// Importaciones desde los barrel files de componentes
import { Grafica } from "@/components/organismos";

// Importación del contexto de tema
import { useTheme } from "@/context/ThemeContext";

interface MovimientoPorMes {
  mes: string;
  entrada: number;
  salida: number;
}

interface MaterialStats {
  tipo: string;
  cantidad: number;
}

interface MovimientoReciente {
  descripcion: string;
  fecha: string;
  estado: string;
}

interface Stats {
  movimientosPorMes: MovimientoPorMes[];
  materiales: MaterialStats[];
  movimientoRecientes: MovimientoReciente[];
  totalSitios: number;
}

interface Usuario {
  id: number;
  nombre: string;
  rol_id: number;
}

interface Rol {
  id_rol: number;
  nombre_rol: string;
}

interface Material {
  id_material: number;
  codigo_sena: string;
  nombre_material: string;
  stock: number;
  unidad_medida: string;
}

const PaginaInicio = () => {
  const { darkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [materiales, setMateriales] = useState<Material[]>([]);

  // Opciones para gráficas
  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: darkMode ? '#e5e7eb' : '#1f2937'
        }
      },
      title: {
        display: true,
        text: 'Movimientos por Mes',
        color: darkMode ? '#e5e7eb' : '#1f2937'
      },
    },
    scales: {
      x: {
        ticks: { color: darkMode ? '#e5e7eb' : '#1f2937' },
        grid: { color: darkMode ? '#374151' : '#e5e7eb' }
      },
      y: {
        ticks: { color: darkMode ? '#e5e7eb' : '#1f2937' },
        grid: { color: darkMode ? '#374151' : '#e5e7eb' }
      }
    }
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: darkMode ? '#e5e7eb' : '#1f2937'
        }
      },
      title: {
        display: true,
        text: 'Materiales por Tipo',
        color: darkMode ? '#e5e7eb' : '#1f2937'
      },
    },
    scales: {
      x: {
        ticks: { color: darkMode ? '#e5e7eb' : '#1f2937' },
        grid: { color: darkMode ? '#374151' : '#e5e7eb' }
      },
      y: {
        ticks: { color: darkMode ? '#e5e7eb' : '#1f2937' },
        grid: { color: darkMode ? '#374151' : '#e5e7eb' }
      }
    }
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: darkMode ? '#e5e7eb' : '#1f2937'
        }
      },
      title: {
        display: true,
        text: 'Distribución de Materiales',
        color: darkMode ? '#e5e7eb' : '#1f2937'
      },
    },
  };

  // Datos para gráficas
  const lineChartData = stats ? {
    labels: stats.movimientosPorMes.map(item => item.mes),
    datasets: [
      {
        label: 'Entradas',
        data: stats.movimientosPorMes.map(item => item.entrada),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Salidas',
        data: stats.movimientosPorMes.map(item => item.salida),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }
    ],
  } : null;

  const barChartData = stats ? {
    labels: stats.materiales.map(item => item.tipo),
    datasets: [
      {
        label: 'Cantidad',
        data: stats.materiales.map(item => item.cantidad),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(53, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
        ],
      }
    ],
  } : null;

  const pieChartData = stats ? {
    labels: stats.materiales.map(item => item.tipo),
    datasets: [
      {
        label: 'Cantidad',
        data: stats.materiales.map(item => item.cantidad),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  } : null;

    // Generar datos de ejemplo para las gráficas
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Simulamos una carga de datos
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Datos de ejemplo para las estadísticas
        const mockStats: Stats = {
          movimientosPorMes: [
            { mes: 'Enero', entrada: 45, salida: 30 },
            { mes: 'Febrero', entrada: 52, salida: 38 },
            { mes: 'Marzo', entrada: 48, salida: 42 },
            { mes: 'Abril', entrada: 60, salida: 50 },
            { mes: 'Mayo', entrada: 65, salida: 45 },
            { mes: 'Junio', entrada: 70, salida: 55 }
          ],
          materiales: [
            { tipo: 'Electrónicos', cantidad: 120 },
            { tipo: 'Papelería', cantidad: 85 },
            { tipo: 'Herramientas', cantidad: 65 },
            { tipo: 'Insumos', cantidad: 95 }
          ],
          movimientoRecientes: [
            { descripcion: 'Entrada de materiales', fecha: '2025-05-28', estado: 'Completado' },
            { descripcion: 'Salida de herramientas', fecha: '2025-05-27', estado: 'Completado' },
            { descripcion: 'Inventario mensual', fecha: '2025-05-25', estado: 'En progreso' },
            { descripcion: 'Pedido de insumos', fecha: '2025-05-23', estado: 'Pendiente' }
          ],
          totalSitios: 5
        };
        
        // Datos de ejemplo para usuarios
        const mockUsuarios: Usuario[] = [
          { id: 1, nombre: 'Juan Pérez', rol_id: 1 },
          { id: 2, nombre: 'María López', rol_id: 2 },
          { id: 3, nombre: 'Carlos Gómez', rol_id: 1 },
          { id: 4, nombre: 'Ana Martínez', rol_id: 3 },
          { id: 5, nombre: 'Pedro Rodríguez', rol_id: 2 }
        ];
        
        // Datos de ejemplo para roles
        const mockRoles: Rol[] = [
          { id_rol: 1, nombre_rol: 'Administrador' },
          { id_rol: 2, nombre_rol: 'Vendedor' },
          { id_rol: 3, nombre_rol: 'Supervisor' }
        ];
        
        // Datos de ejemplo para materiales
        const mockMateriales: Material[] = [
          { id_material: 1, codigo_sena: 'M001', nombre_material: 'Laptop HP', stock: 3, unidad_medida: 'Unidad' },
          { id_material: 2, codigo_sena: 'M002', nombre_material: 'Monitor Dell', stock: 5, unidad_medida: 'Unidad' },
          { id_material: 3, codigo_sena: 'M003', nombre_material: 'Teclado Logitech', stock: 8, unidad_medida: 'Unidad' },
          { id_material: 4, codigo_sena: 'M004', nombre_material: 'Mouse Inalámbrico', stock: 2, unidad_medida: 'Unidad' },
          { id_material: 5, codigo_sena: 'M005', nombre_material: 'Papel Carta', stock: 15, unidad_medida: 'Resma' }
        ];
        
        setStats(mockStats);
        setUsuarios(mockUsuarios);
        setRoles(mockRoles);
        setMateriales(mockMateriales);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los datos del dashboard');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Usuarios por rol
  const usuariosPorRol = roles.map(rol => ({
    rol: rol.nombre_rol,
    cantidad: usuarios.filter(u => u.rol_id === rol.id_rol).length
  }));
  const usuariosPorRolChartData = {
    labels: usuariosPorRol.map(item => item.rol),
    datasets: [{
      label: 'Usuarios',
      data: usuariosPorRol.map(item => item.cantidad),
      backgroundColor: ['#6366f1', '#f59e42', '#10b981', '#ef4444', '#f472b6', '#facc15', '#38bdf8', '#a3e635'],
    }]
  };
  // Materiales con bajo stock (stock <= 5)
  const materialesBajoStock = materiales.filter(m => m.stock <= 5);

  // Datos para las tarjetas
  const statsCards = [
    {
      title: "Usuarios",
      value: usuarios.length.toLocaleString(),
      icon: <Users size={20} className="text-blue-500" />, 
      color: "bg-blue-100",
    },
    {
      title: "Materiales",
      value: materiales.length.toLocaleString(),
      icon: <Package size={20} className="text-amber-500" />, 
      color: "bg-amber-100",
    },
    {
      title: "Sitios", 
      value: stats?.totalSitios?.toLocaleString() || "-",
      icon: <MapPin size={20} className="text-purple-500" />,
      color: "bg-purple-100",
    },
  ];

  return (
    <>
      <div className={`p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'} min-h-screen transition-colors duration-300`}>
        {/* Título del dashboard */}
        <div className="mb-6">
          <h1 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Panel de Control</h1>
          <p className="text-gray-600">
            Bienvenido, aquí está el resumen de tu sistema
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className={`animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 ${darkMode ? 'border-blue-400' : 'border-blue-500'}`}></div>
          </div>
        ) : error ? (
          <div className={`${darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'} p-4 rounded-lg mb-6 transition-colors duration-300`}>
            Error al cargar los datos: {typeof error === 'string' ? error : 'Error desconocido'}
          </div>
        ) : (
          <>
            {/* Tarjetas de estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statsCards.map((card, index) => {
                // Adjust card colors for dark mode
                const cardBgColor = darkMode 
                  ? card.title === "Usuarios" ? 'bg-blue-900/30' 
                    : card.title === "Materiales" ? 'bg-amber-900/30' 
                    : 'bg-green-900/30'
                  : card.color;
                
                return (
                  <div key={index} className={`${cardBgColor} rounded-lg shadow-md p-6 transition-colors duration-300`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>{card.title}</h3>
                        <p className={`text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>{card.value}</p>
                      </div>
                      <div className={`p-3 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        {card.icon}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Gráficas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Gráfica de línea - Movimientos por mes */}
              <div className={`${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'} rounded-lg shadow-md p-6 transition-colors duration-300`}>
                <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Movimientos por Mes</h2>
                <div className="h-80">
                  {lineChartData && <Grafica type="line" data={lineChartData} options={lineChartOptions} />}
                </div>
              </div>

              {/* Gráfica de barras - Materiales por tipo */}
              <div className={`${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'} rounded-lg shadow-md p-6 transition-colors duration-300`}>
                <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Materiales por Tipo</h2>
                <div className="h-80">
                  {barChartData && <Grafica type="bar" data={barChartData} options={barChartOptions} />}
                </div>
              </div>
            </div>

            {/* Gráfica circular y Actividades recientes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfica circular - Distribución de materiales */}
              <div className={`${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'} rounded-lg shadow-md p-6 transition-colors duration-300`}>
                <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Distribución de Materiales</h2>
                <div className="h-80">
                  {pieChartData && <Grafica type="doughnut" data={pieChartData} options={pieChartOptions} />}
                </div>
              </div>

              {/* Actividades recientes - Tabla simple */}
              <div className={`${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'} rounded-lg shadow-md p-6 transition-colors duration-300`}>
                <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  Movimientos Recientes
                </h2>
                <table className="w-full">
                  <thead>
                    <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <th className={`text-left py-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Actividad</th>
                      <th className={`text-left py-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Fecha</th>
                      <th className={`text-left py-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats?.movimientoRecientes.map((activity, index) => (
                      <tr key={index} className={index !== stats.movimientoRecientes.length - 1 ? `border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}` : ''}>
                        <td className={`py-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{activity.descripcion}</td>
                        <td className={`py-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{new Date(activity.fecha).toLocaleDateString()}</td>
                        <td className={`py-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          <span className={`text-xs py-1 px-2 rounded ${
                            activity.estado === 'Completado' ? 'bg-green-100 text-green-800' :
                            activity.estado === 'En progreso' ? 'bg-blue-100 text-blue-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {activity.estado}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Gráfica de usuarios por rol */}
            <div className={`${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'} rounded-lg shadow-md p-6 mb-8 transition-colors duration-300`}>
              <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Usuarios por Rol</h2>
              <div className="h-80">
                {usuariosPorRolChartData && <Grafica type="bar" data={usuariosPorRolChartData} options={barChartOptions} />}
              </div>
            </div>
            {/* Tabla de materiales con bajo stock */}
            <div className={`${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'} rounded-lg shadow-md p-6 mb-8 transition-colors duration-300`}>
              <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Materiales con Bajo Stock (≤ 5)</h2>
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <th className={`text-left py-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Código</th>
                    <th className={`text-left py-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Nombre</th>
                    <th className={`text-left py-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Stock</th>
                    <th className={`text-left py-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Unidad</th>
                  </tr>
                </thead>
                <tbody>
                  {materialesBajoStock.length === 0 ? (
                    <tr><td colSpan={4} className={`text-center py-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>No hay materiales con bajo stock</td></tr>
                  ) : (
                    materialesBajoStock.map((mat, idx) => (
                      <tr key={mat.id_material} className={idx !== materialesBajoStock.length - 1 ? `border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}` : ''}>
                        <td className={`py-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{mat.codigo_sena}</td>
                        <td className={`py-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{mat.nombre_material}</td>
                        <td className={`py-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{mat.stock}</td>
                        <td className={`py-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{mat.unidad_medida}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default React.memo(PaginaInicio);
