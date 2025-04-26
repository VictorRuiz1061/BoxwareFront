import { Users, BarChart2, Package, MapPin, Tag, Layers, Home, Landmark, Map, ClipboardList } from "lucide-react"; 
import Sidebar from "../organismos/Sidebar";
import Header from "../organismos/Header";
import Grafica from "../organismos/Grafica";
import { useDashboardStats } from "../../hooks/useDashboardStats";
import { useUsuarios } from '../../hooks/useUsuarios';
import { useFichas } from '../../hooks/useFichas';
import { useRoles } from '../../hooks/useRoles';
import { useProgramas } from '../../hooks/useProgramas';
import { useCategoriaElementos } from '../../hooks/useCategoriaElementos';
import { useTipoMateriales } from '../../hooks/useTipoMateriales';
import { useSedes } from '../../hooks/useSedes';
import { useCentros } from '../../hooks/useCentros';
import { useMunicipios } from '../../hooks/useMunicipios';
import { useSitios } from '../../hooks/useSitios';
import { useMateriales } from '../../hooks/useMateriales';

const PaginaInicio = () => {
  const { stats, loading, error } = useDashboardStats();
  const { usuarios } = useUsuarios();
  const { fichas } = useFichas();
  const { roles } = useRoles();
  const { programas } = useProgramas();
  const { categorias } = useCategoriaElementos();
  const { tipoMateriales } = useTipoMateriales();
  const { sedes } = useSedes();
  const { centros } = useCentros();
  const { municipios } = useMunicipios();
  const { sitios } = useSitios();
  const { materiales } = useMateriales();

  // Opciones para gráficas
  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Movimientos por Mes',
      },
    },
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Materiales por Tipo',
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: true,
        text: 'Distribución de Materiales',
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
      icon: <Users size={20} className="text-blue-500" />, color: "bg-blue-100",
    },
    {
      title: "Movimientos",
      value: stats?.totalMovimientos?.toLocaleString() || "-",
      icon: <BarChart2 size={20} className="text-green-500" />, color: "bg-green-100",
    },
    {
      title: "Materiales",
      value: materiales.length.toLocaleString(),
      icon: <Package size={20} className="text-amber-500" />, color: "bg-amber-100",
    },
    {
      title: "Sitios", 
      value: stats?.totalSitios?.toLocaleString() || "-",
      icon: <MapPin size={20} className="text-purple-500" />,
      color: "bg-purple-100",
    },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Contenido */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 bg-gray-100 min-h-screen">
            {/* Título del dashboard */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
              <p className="text-gray-600">
                Bienvenido, aquí está el resumen de tu sistema
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-lg text-gray-600">Cargando estadísticas...</p>
              </div>
            ) : error ? (
              <div className="bg-red-100 p-4 rounded-lg text-red-700 mb-6">
                <p>{error}</p>
              </div>
            ) : (
              <>
                {/* Tarjetas de estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {statsCards.map((card, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md p-5">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-gray-600 mb-1">{card.title}</p>
                          <h3 className="text-2xl font-bold">{card.value}</h3>
                        </div>
                        <div className={`p-3 rounded-lg ${card.color}`}>
                          {card.icon}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Gráficas */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* Gráfica de línea - Movimientos por mes */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold mb-4">Movimientos por Mes</h2>
                    <div className="h-80">
                      {lineChartData && <Grafica type="line" data={lineChartData} options={lineChartOptions} />}
                    </div>
                  </div>

                  {/* Gráfica de barras - Materiales por tipo */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold mb-4">Materiales por Tipo</h2>
                    <div className="h-80">
                      {barChartData && <Grafica type="bar" data={barChartData} options={barChartOptions} />}
                    </div>
                  </div>
                </div>

                {/* Gráfica circular y Actividades recientes */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Gráfica circular - Distribución de materiales */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold mb-4">Distribución de Materiales</h2>
                    <div className="h-80">
                      {pieChartData && <Grafica type="doughnut" data={pieChartData} options={pieChartOptions} />}
                    </div>
                  </div>

                  {/* Actividades recientes - Tabla simple */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold mb-4">
                      Movimientos Recientes
                    </h2>
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Actividad</th>
                          <th className="text-left py-2">Fecha</th>
                          <th className="text-left py-2">Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats?.movimientoRecientes.map((activity, index) => (
                          <tr key={index} className={index !== stats.movimientoRecientes.length - 1 ? 'border-b' : ''}>
                            <td className="py-3">{activity.descripcion}</td>
                            <td className="py-3">{new Date(activity.fecha).toLocaleDateString()}</td>
                            <td className="py-3">
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
                        <tr><td colSpan={4} className="text-center py-4 text-gray-400">No hay materiales con bajo stock</td></tr>
                      ) : (
                        materialesBajoStock.map((mat, idx) => (
                          <tr key={mat.id_material} className={idx !== materialesBajoStock.length - 1 ? 'border-b' : ''}>
                            <td className="py-3">{mat.codigo_sena}</td>
                            <td className="py-3">{mat.nombre_material}</td>
                            <td className="py-3">{mat.stock}</td>
                            <td className="py-3">{mat.unidad_medida}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PaginaInicio;
