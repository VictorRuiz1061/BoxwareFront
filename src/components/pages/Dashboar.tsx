import { Users, DollarSign, ShoppingBag, Activity } from "lucide-react";
import Sidebar from "../organismos/Sidebar";
import Header from "../organismos/Header";

const PaginaInicio = () => {
  const statsCards = [
    {
      title: "Usuarios",
      value: "3,456",
      icon: <Users size={20} className="text-blue-500" />,
      color: "bg-blue-100",
    },
    {
      title: "Ingresos",
      value: "$24,780",
      icon: <DollarSign size={20} className="text-green-500" />,
      color: "bg-green-100",
    },
    {
      title: "Pedidos",
      value: "768",
      icon: <ShoppingBag size={20} className="text-amber-500" />,
      color: "bg-amber-100",
    },
    {
      title: "Conversión",
      value: "3.2%",
      icon: <Activity size={20} className="text-purple-500" />,
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
                Bienvenido, aquí está el resumen de tu cuenta.
              </p>
            </div>

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

            {/* Actividades recientes - Tabla simple */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">
                Actividades Recientes
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
                  <tr className="border-b">
                    <td className="py-3">Nuevo usuario registrado</td>
                    <td className="py-3">Hoy</td>
                    <td className="py-3">
                      <span className="bg-green-100 text-green-800 text-xs py-1 px-2 rounded">
                        Completado
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3">Actualización de sistema</td>
                    <td className="py-3">Ayer</td>
                    <td className="py-3">
                      <span className="bg-blue-100 text-blue-800 text-xs py-1 px-2 rounded">
                        En progreso
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3">Mantenimiento programado</td>
                    <td className="py-3">20 Mar</td>
                    <td className="py-3">
                      <span className="bg-amber-100 text-amber-800 text-xs py-1 px-2 rounded">
                        Pendiente
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Proyectos - Lista simple */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Proyectos</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-3">
                  <div>
                    <h3 className="font-medium">Rediseño de la web</h3>
                    <p className="text-sm text-gray-500">5 miembros</p>
                  </div>
                  <div className="bg-blue-100 text-blue-800 text-xs py-1 px-2 rounded">
                    En progreso
                  </div>
                </div>
                <div className="flex justify-between items-center border-b pb-3">
                  <div>
                    <h3 className="font-medium">App móvil</h3>
                    <p className="text-sm text-gray-500">8 miembros</p>
                  </div>
                  <div className="bg-amber-100 text-amber-800 text-xs py-1 px-2 rounded">
                    En revisión
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Sistema de pagos</h3>
                    <p className="text-sm text-gray-500">3 miembros</p>
                  </div>
                  <div className="bg-green-100 text-green-800 text-xs py-1 px-2 rounded">
                    Completado
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PaginaInicio;
