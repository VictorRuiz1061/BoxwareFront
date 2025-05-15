import React from "react";
import { Users, Package, MapPin } from "lucide-react"; 
import Grafica from "../organismos/Grafica";
import { useGetDashboardStats } from "../../hooks/dashboard/useGetDashboardStats";
import { useGetUsuarios } from '../../hooks/usuario/useGetUsuarios';
import { useGetRoles } from '../../hooks/roles/useGetRoles';
import { useGetMateriales } from '../../hooks/material/useGetMateriales';
import { useTheme } from "../../context/ThemeContext";

const PaginaInicio = () => {
  const { stats, loading, error } = useGetDashboardStats();
  const { usuarios } = useGetUsuarios();
  const { roles } = useGetRoles();
  const { materiales } = useGetMateriales();
  const { darkMode } = useTheme();

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
  // Materiales con bajo stock (ejemplo: stock <= 5)
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
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-lg font-semibold mb-4">Usuarios por Rol</h2>
              <div className="h-80">
                {usuariosPorRolChartData && <Grafica type="bar" data={usuariosPorRolChartData} options={barChartOptions} />}
              </div>
            </div>
            {/* Tabla de materiales con bajo stock */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-lg font-semibold mb-4">Materiales con Bajo Stock (≤ 5)</h2>
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Código</th>
                    <th className="text-left py-2">Nombre</th>
                    <th className="text-left py-2">Stock</th>
                    <th className="text-left py-2">Unidad</th>
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
