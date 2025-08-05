import { useState } from 'react';
import { Bell, Filter, Search, Check, Archive } from 'lucide-react';
import { useGetAlertas } from '@/hooks/alertas';
import { usePatchAlertaLeer } from '@/hooks/alertas';
import { Alerta, NivelAlerta, EstadoAlerta, TipoAlerta } from '@/types/alerta';
import { useTheme } from '@/context/ThemeContext';
import AnimatedContainer from '@/components/atomos/AnimatedContainer';
import Table from '@/components/organismos/Table';

const AlertasTemplate = () => {
  const { darkMode } = useTheme();
  const { alertas } = useGetAlertas();
  const { actualizarAlerta } = usePatchAlertaLeer();

  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [filtroNivel, setFiltroNivel] = useState<string>('todos');
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [busqueda, setBusqueda] = useState<string>('');

  // Filtrar alertas
  const alertasFiltradas = alertas.filter(alerta => {
    const cumpleEstado = filtroEstado === 'todos' || alerta.estado === filtroEstado;
    const cumpleNivel = filtroNivel === 'todos' || alerta.nivel === filtroNivel;
    const cumpleTipo = filtroTipo === 'todos' || alerta.tipo === filtroTipo;
    const cumpleBusqueda = busqueda === '' || 
      alerta.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      alerta.mensaje.toLowerCase().includes(busqueda.toLowerCase());

    return cumpleEstado && cumpleNivel && cumpleTipo && cumpleBusqueda;
  });

  // Estadísticas
  const totalAlertas = alertas.length;
  const alertasNoLeidas = alertas.filter(a => a.estado === EstadoAlerta.PENDIENTE).length;
  const alertasLeidas = alertas.filter(a => a.estado === EstadoAlerta.LEIDA).length;
  const alertasArchivadas = alertas.filter(a => a.estado === EstadoAlerta.ARCHIVADA).length;

  const handleMarcarLeida = async (alerta: Alerta) => {
    try {
      await actualizarAlerta(alerta.id_alerta);
    } catch (error) {
    }
  };

  const getIconoAlerta = (nivel: NivelAlerta) => {
    switch (nivel) {
      case NivelAlerta.ERROR:
      case NivelAlerta.CRITICAL:
        return <div className="w-3 h-3 bg-red-500 rounded-full"></div>;
      case NivelAlerta.WARNING:
        return <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>;
      case NivelAlerta.INFO:
      default:
        return <div className="w-3 h-3 bg-blue-500 rounded-full"></div>;
    }
  };

  const getColorEstado = (estado: EstadoAlerta) => {
    switch (estado) {
      case EstadoAlerta.PENDIENTE:
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case EstadoAlerta.LEIDA:
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case EstadoAlerta.ARCHIVADA:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const columns = [
    {
      header: 'Estado',
      accessor: 'estado',
      cell: (alerta: Alerta) => (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getColorEstado(alerta.estado)}`}>
          {alerta.estado === EstadoAlerta.PENDIENTE ? 'Pendiente' :
           alerta.estado === EstadoAlerta.LEIDA ? 'Leída' : 'Archivada'}
        </span>
      )
    },
    {
      header: 'Nivel',
      accessor: 'nivel',
      cell: (alerta: Alerta) => (
        <div className="flex items-center space-x-2">
          {getIconoAlerta(alerta.nivel)}
          <span className="text-sm capitalize">{alerta.nivel}</span>
        </div>
      )
    },
    {
      header: 'Título',
      accessor: 'titulo',
      cell: (alerta: Alerta) => (
        <div className="max-w-xs">
          <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {alerta.titulo}
          </p>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} truncate`}>
            {alerta.mensaje}
          </p>
        </div>
      )
    },
    {
      header: 'Tipo',
      accessor: 'tipo',
      cell: (alerta: Alerta) => (
        <span className="text-sm capitalize">
          {alerta.tipo.replace('_', ' ')}
        </span>
      )
    },
    {
      header: 'Fecha',
      accessor: 'fecha_creacion',
      cell: (alerta: Alerta) => (
        <span className="text-sm text-gray-500">
          {formatearFecha(alerta.fecha_creacion)}
        </span>
      )
    },
    {
      header: 'Acciones',
      accessor: 'acciones',
      cell: (alerta: Alerta) => (
        <div className="flex items-center space-x-2">
          {alerta.estado === EstadoAlerta.PENDIENTE && (
            <button
              onClick={() => handleMarcarLeida(alerta)}
              className={`p-1 rounded-full ${
                darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'
              } transition-colors duration-200`}
              title="Marcar como leída"
            >
              <Check size={16} className="text-green-500" />
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <AnimatedContainer animation="fadeIn" duration={800} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-lg ${
            darkMode ? 'bg-slate-800' : 'bg-blue-100'
          }`}>
            <Bell className={`w-6 h-6 ${
              darkMode ? 'text-blue-400' : 'text-blue-600'
            }`} />
          </div>
          <div>
            <h1 className={`text-2xl font-bold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Alertas y Notificaciones
            </h1>
            <p className={`text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Gestiona todas las alertas del sistema
            </p>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`p-4 rounded-lg border ${
          darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Total
              </p>
              <p className={`text-2xl font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {totalAlertas}
              </p>
            </div>
            <Bell className={`w-8 h-8 ${
              darkMode ? 'text-blue-400' : 'text-blue-600'
            }`} />
          </div>
        </div>

        <div className={`p-4 rounded-lg border ${
          darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Sin leer
              </p>
              <p className="text-2xl font-bold text-red-600">
                {alertasNoLeidas}
              </p>
            </div>
            <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-lg border ${
          darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Leídas
              </p>
              <p className="text-2xl font-bold text-green-600">
                {alertasLeidas}
              </p>
            </div>
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-lg border ${
          darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Archivadas
              </p>
              <p className={`text-2xl font-bold ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {alertasArchivadas}
              </p>
            </div>
            <Archive className={`w-8 h-8 ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`} />
          </div>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className={`p-4 rounded-lg border ${
        darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center space-x-4 mb-4">
          <Filter className={`w-5 h-5 ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`} />
          <h3 className={`font-medium ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Filtros
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Búsqueda */}
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              placeholder="Buscar alertas..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg ${
                darkMode 
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
          </div>

          {/* Filtro Estado */}
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className={`px-4 py-2 border rounded-lg ${
              darkMode 
                ? 'bg-slate-700 border-slate-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          >
            <option value="todos">Todos los estados</option>
            <option value={EstadoAlerta.PENDIENTE}>Pendiente</option>
            <option value={EstadoAlerta.LEIDA}>Leída</option>
            <option value={EstadoAlerta.ARCHIVADA}>Archivada</option>
          </select>

          {/* Filtro Nivel */}
          <select
            value={filtroNivel}
            onChange={(e) => setFiltroNivel(e.target.value)}
            className={`px-4 py-2 border rounded-lg ${
              darkMode 
                ? 'bg-slate-700 border-slate-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          >
            <option value="todos">Todos los niveles</option>
            <option value={NivelAlerta.INFO}>Info</option>
            <option value={NivelAlerta.WARNING}>Warning</option>
            <option value={NivelAlerta.ERROR}>Error</option>
            <option value={NivelAlerta.CRITICAL}>Critical</option>
          </select>

          {/* Filtro Tipo */}
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className={`px-4 py-2 border rounded-lg ${
              darkMode 
                ? 'bg-slate-700 border-slate-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          >
            <option value="todos">Todos los tipos</option>
            <option value={TipoAlerta.STOCK_BAJO}>Stock bajo</option>
            <option value={TipoAlerta.PRESTAMO}>Préstamo</option>
            <option value={TipoAlerta.DEVOLUCION}>Devolución</option>
            <option value={TipoAlerta.TRANSFERENCIA}>Transferencia</option>
            <option value={TipoAlerta.MATERIAL_NUEVO}>Material nuevo</option>
            <option value={TipoAlerta.MOVIMIENTO_CRITICO}>Movimiento crítico</option>
            <option value={TipoAlerta.SISTEMA}>Sistema</option>
          </select>
        </div>
      </div>

      {/* Tabla de alertas */}
      <div className={`rounded-lg border ${
        darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
      }`}>
        <Table
          data={alertasFiltradas.map(alerta => ({
            ...alerta,
            key: alerta.id_alerta, // Usar 'id_alerta' que sí existe en el tipo Alerta
          }))}
          columns={columns.map(col => ({
            ...col,
            key: col.accessor as keyof Alerta, // Aseguramos el tipo correcto para key
            label: col.header,
          }))}
        />
      </div>
    </AnimatedContainer>
  );
};

export default AlertasTemplate; 