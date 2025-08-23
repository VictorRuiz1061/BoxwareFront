import React, { useMemo, useState } from "react";
import { AnimatedContainer } from "@/components/atomos";
import Grafica from "@/components/organismos/Grafica";
import { useTheme } from "@/context/ThemeContext";
import { useGetMateriales } from "@/hooks/material";
import { useGetInventarios } from "@/hooks/inventario";
import { useGetSitios } from "@/hooks/sitio";
import { useGetMovimientos } from "@/hooks/movimiento";
import { useGetCategoriasElementos } from "@/hooks/Elemento";
import { useGetTipoMateriales } from "@/hooks/tipoMaterial";
import { useGetTiposMovimiento } from "@/hooks/tipoMovimiento";

const Dashboard = () => {
  const { darkMode } = useTheme();
  const { materiales, loading: loadingMateriales } = useGetMateriales();
  const { inventarios, loading: loadingInventarios } = useGetInventarios();
  const { sitios, loading: loadingSitios } = useGetSitios();
  const { movimientos, loading: loadingMovimientos } = useGetMovimientos();
  const { categorias } = useGetCategoriasElementos();
  const { tipoMateriales } = useGetTipoMateriales();
  const { tiposMovimiento } = useGetTiposMovimiento();
  
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>("");
  const [selectedSitioId, setSelectedSitioId] = useState<string>("");
  const [filtroFecha, setFiltroFecha] = useState<string>("7"); // días

  // Tarjetas de resumen expandidas
  const totalMateriales = materiales.length;
  const totalSitios = sitios.length;
  const stockTotal = useMemo(() => inventarios.reduce((acc, inv) => acc + (inv.stock || 0), 0), [inventarios]);
  const movimientosEsteMes = useMemo(() => {
    const now = new Date();
    return movimientos.filter(mov => {
      const fechaStr = mov.fecha_creacion || mov.fecha_modificacion;
      if (!fechaStr) return false;
      const fecha = new Date(fechaStr);
      return fecha.getMonth() === now.getMonth() && fecha.getFullYear() === now.getFullYear();
    }).length;
  }, [movimientos]);

  // Nuevas estadísticas
  const materialesActivos = useMemo(() => materiales.filter(mat => mat.estado).length, [materiales]);
  const sitiosActivos = useMemo(() => sitios.filter(sitio => sitio.estado).length, [sitios]);
  const promedioStockPorMaterial = useMemo(() => {
    if (materiales.length === 0) return 0;
    return Math.round(stockTotal / materiales.length);
  }, [stockTotal, materiales.length]);

  // Gráfica: Materiales por sitio (mejorada)
  const materialesPorSitio = useMemo(() => {
    return sitios.map(sitio => {
      const materialesEnSitio = inventarios.filter(inv => Number(inv.sitio_id) === Number(sitio.id_sitio));
      const materialesUnicos = [...new Set(materialesEnSitio.map(inv => Number(inv.material_id)))];
      return {
        sitio: sitio.nombre_sitio,
        cantidad: materialesUnicos.length,
      };
    });
  }, [sitios, inventarios]);

  // Gráfica: Stock total por material (mejorada)
  const stockPorMaterial = useMemo(() => {
    return materiales.map(mat => {
      const stock = inventarios.filter(inv => Number(inv.material_id) === Number(mat.id_material)).reduce((acc, inv) => acc + (inv.stock || 0), 0);
      return {
        material: mat.nombre_material,
        stock,
      };
    });
  }, [materiales, inventarios]);

  // Nueva gráfica: Distribución de materiales por categoría
  const materialesPorCategoria = useMemo(() => {
    return categorias.map(cat => {
      const count = materiales.filter(mat => Number(mat.categoria_id) === Number(cat.id_categoria_elemento)).length;
      return {
        categoria: cat.nombre_categoria,
        cantidad: count,
      };
    }).filter(item => item.cantidad > 0);
  }, [materiales, categorias]);

  // Nueva gráfica: Materiales por tipo
  const materialesPorTipo = useMemo(() => {
    return tipoMateriales.map(tipo => {
      const count = materiales.filter(mat => Number(mat.tipo_material_id) === Number(tipo.id_tipo_material)).length;
      return {
        tipo: tipo.tipo_elemento,
        cantidad: count,
      };
    }).filter(item => item.cantidad > 0);
  }, [materiales, tipoMateriales]);

  // Nueva gráfica: Movimientos por tipo
  const movimientosPorTipo = useMemo(() => {
    return tiposMovimiento.map(tipo => {
      const count = movimientos.filter(mov => Number(mov.tipo_movimiento) === Number(tipo.id_tipo_movimiento)).length;
      return {
        tipo: tipo.tipo_movimiento,
        cantidad: count,
      };
    }).filter(item => item.cantidad > 0);
  }, [movimientos, tiposMovimiento]);

  // Top 5 materiales con más stock
  const topMaterialesStock = useMemo(() => {
    return stockPorMaterial
      .sort((a, b) => b.stock - a.stock)
      .slice(0, 5);
  }, [stockPorMaterial]);

  // Gráfica: Movimientos recientes (mejorada con filtro)
  const movimientosPorDia = useMemo(() => {
    const dias = parseInt(filtroFecha);
    const fechas = Array.from({ length: dias }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (dias - 1 - i));
      return d.toISOString().split("T")[0];
    });
    const data = fechas.map(fecha => {
      const count = movimientos.filter(mov => {
        const fechaStr = mov.fecha_creacion || mov.fecha_modificacion;
        return fechaStr && fechaStr.startsWith(fecha);
      }).length;
      return { fecha, count };
    });
    return data;
  }, [movimientos, filtroFecha]);

  // Gráfica: Stock de un material por sitio (mejorada)
  const stockMaterialPorSitio = useMemo(() => {
    if (!selectedMaterialId) return [];
    return sitios.map(sitio => {
      const inv = inventarios.find(inv =>
        Number(inv.sitio_id) === Number(sitio.id_sitio) &&
        Number(inv.material_id) === Number(selectedMaterialId)
      );
      return {
        sitio: sitio.nombre_sitio,
        stock: inv ? inv.stock : 0,
      };
    });
  }, [selectedMaterialId, sitios, inventarios]);

  // Nueva gráfica: Stock por sitio (con selector de sitio)
  const stockPorSitio = useMemo(() => {
    if (!selectedSitioId) return [];
    const sitioSeleccionado = sitios.find(s => Number(s.id_sitio) === Number(selectedSitioId));
    if (!sitioSeleccionado) return [];

    const inventariosSitio = inventarios.filter(inv => Number(inv.sitio_id) === Number(selectedSitioId));
    return inventariosSitio.map(inv => {
      const material = materiales.find(mat => Number(mat.id_material) === Number(inv.material_id));
      return {
        material: material ? material.nombre_material : `Material ${inv.material_id}`,
        stock: inv.stock || 0,
      };
    }).filter(item => item.stock > 0);
  }, [selectedSitioId, sitios, inventarios, materiales]);

  // Indicadores de rendimiento
  const indicadoresRendimiento = useMemo(() => {
    const materialesSinStock = materiales.filter(mat => {
      const stock = inventarios.filter(inv => Number(inv.material_id) === Number(mat.id_material))
        .reduce((acc, inv) => acc + (inv.stock || 0), 0);
      return stock === 0;
    }).length;

    const sitiosSinInventario = sitios.filter(sitio => {
      const inventariosSitio = inventarios.filter(inv => Number(inv.sitio_id) === Number(sitio.id_sitio));
      return inventariosSitio.length === 0;
    }).length;

    return {
      materialesSinStock,
      sitiosSinInventario,
      porcentajeMaterialesActivos: Math.round((materialesActivos / totalMateriales) * 100) || 0,
      porcentajeSitiosActivos: Math.round((sitiosActivos / totalSitios) * 100) || 0,
    };
  }, [materiales, inventarios, sitios, materialesActivos, totalMateriales, sitiosActivos, totalSitios]);

  // Loading
  const loading = loadingMateriales || loadingInventarios || loadingSitios || loadingMovimientos;

  return (
    <AnimatedContainer>
      <div className={`p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'} min-h-screen transition-colors duration-300`}>
        <h1 className="text-3xl font-bold mb-6">Dashboard de Inventario</h1>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <span className="text-lg">Cargando datos...</span>
          </div>
        ) : (
          <>
            {/* Tarjetas de resumen expandidas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center">
                <span className="text-2xl font-bold text-blue-600">{totalMateriales}</span>
                <span className="text-gray-500 dark:text-gray-300">Materiales</span>
                <span className="text-xs text-green-600 mt-1">{indicadoresRendimiento.porcentajeMaterialesActivos}% activos</span>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center">
                <span className="text-2xl font-bold text-green-600">{totalSitios}</span>
                <span className="text-gray-500 dark:text-gray-300">Sitios</span>
                <span className="text-xs text-green-600 mt-1">{indicadoresRendimiento.porcentajeSitiosActivos}% activos</span>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center">
                <span className="text-2xl font-bold text-purple-600">{stockTotal}</span>
                <span className="text-gray-500 dark:text-gray-300">Stock Total</span>
                <span className="text-xs text-gray-500 mt-1">Promedio: {promedioStockPorMaterial}</span>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center">
                <span className="text-2xl font-bold text-orange-600">{movimientosEsteMes}</span>
                <span className="text-gray-500 dark:text-gray-300">Movimientos este mes</span>
                <span className="text-xs text-gray-500 mt-1">Últimos 30 días</span>
              </div>
            </div>

            {/* Indicadores de rendimiento */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                <div className="text-red-600 font-semibold">{indicadoresRendimiento.materialesSinStock}</div>
                <div className="text-sm text-red-500">Materiales sin stock</div>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                <div className="text-yellow-600 font-semibold">{indicadoresRendimiento.sitiosSinInventario}</div>
                <div className="text-sm text-yellow-500">Sitios sin inventario</div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <div className="text-blue-600 font-semibold">{categorias.length}</div>
                <div className="text-sm text-blue-500">Categorías</div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <div className="text-green-600 font-semibold">{tiposMovimiento.length}</div>
                <div className="text-sm text-green-500">Tipos de movimiento</div>
              </div>
            </div>

            {/* Gráficas principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Materiales por sitio */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Materiales por Sitio</h2>
                <Grafica
                  type="bar"
                  data={{
                    labels: materialesPorSitio.map(d => d.sitio),
                    datasets: [{
                      label: "Materiales distintos",
                      data: materialesPorSitio.map(d => d.cantidad),
                      backgroundColor: "#3b82f6"
                    }]
                  }}
                  options={{ responsive: true, plugins: { legend: { display: false } } }}
                />
                {materialesPorSitio.every(d => d.cantidad === 0) && (
                  <div className="text-center text-gray-500 mt-4">No hay materiales registrados en los sitios.</div>
                )}
              </div>

              {/* Distribución por categoría */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Materiales por Categoría</h2>
                <Grafica
                  type="pie"
                  data={{
                    labels: materialesPorCategoria.map(d => d.categoria),
                    datasets: [{
                      data: materialesPorCategoria.map(d => d.cantidad),
                      backgroundColor: [
                        "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6",
                        "#06b6d4", "#84cc16", "#f97316", "#ec4899", "#6366f1"
                      ]
                    }]
                  }}
                  options={{ responsive: true }}
                />
                {materialesPorCategoria.length === 0 && (
                  <div className="text-center text-gray-500 mt-4">No hay categorías con materiales.</div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Stock total por material */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Stock Total por Material</h2>
                <Grafica
                  type="bar"
                  data={{
                    labels: stockPorMaterial.map(d => d.material),
                    datasets: [{
                      label: "Stock total",
                      data: stockPorMaterial.map(d => d.stock),
                      backgroundColor: "#10b981"
                    }]
                  }}
                  options={{ responsive: true, plugins: { legend: { display: false } } }}
                />
              </div>

              {/* Materiales por tipo */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Materiales por Tipo</h2>
                <Grafica
                  type="doughnut"
                  data={{
                    labels: materialesPorTipo.map(d => d.tipo),
                    datasets: [{
                      data: materialesPorTipo.map(d => d.cantidad),
                      backgroundColor: [
                        "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6",
                        "#06b6d4", "#84cc16", "#f97316", "#ec4899", "#6366f1"
                      ]
                    }]
                  }}
                  options={{ responsive: true }}
                />
                {materialesPorTipo.length === 0 && (
                  <div className="text-center text-gray-500 mt-4">No hay tipos de material registrados.</div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Movimientos recientes con filtro */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Movimientos Recientes</h2>
                  <select
                    className="p-2 rounded border dark:bg-gray-900 dark:text-white text-sm"
                    value={filtroFecha}
                    onChange={e => setFiltroFecha(e.target.value)}
                  >
                    <option value="7">Últimos 7 días</option>
                    <option value="14">Últimos 14 días</option>
                    <option value="30">Últimos 30 días</option>
                  </select>
                </div>
                <Grafica
                  type="line"
                  data={{
                    labels: movimientosPorDia.map(d => d.fecha),
                    datasets: [{
                      label: "Movimientos",
                      data: movimientosPorDia.map(d => d.count),
                      borderColor: "#6366f1",
                      backgroundColor: "#6366f1",
                      fill: false
                    }]
                  }}
                  options={{ responsive: true, plugins: { legend: { display: false } } }}
                />
              </div>

              {/* Movimientos por tipo */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Movimientos por Tipo</h2>
                <Grafica
                  type="bar"
                  data={{
                    labels: movimientosPorTipo.map(d => d.tipo),
                    datasets: [{
                      label: "Cantidad",
                      data: movimientosPorTipo.map(d => d.cantidad),
                      backgroundColor: "#8b5cf6"
                    }]
                  }}
                  options={{ responsive: true, plugins: { legend: { display: false } } }}
                />
                {movimientosPorTipo.length === 0 && (
                  <div className="text-center text-gray-500 mt-4">No hay movimientos registrados.</div>
                )}
              </div>
            </div>

            {/* Top 5 materiales con más stock */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
              <h2 className="text-lg font-semibold mb-4">Top 5 Materiales con Más Stock</h2>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {topMaterialesStock.map((item, index) => (
                  <div key={index} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{item.stock}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 truncate">{item.material}</div>
                    <div className="text-xs text-gray-500">#{index + 1}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Stock de un material por sitio */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Stock de un Material por Sitio</h2>
                <select
                  className="mb-4 p-2 rounded border dark:bg-gray-900 dark:text-white w-full"
                  value={selectedMaterialId}
                  onChange={e => setSelectedMaterialId(e.target.value)}
                >
                  <option value="">Seleccione un material</option>
                  {materiales.map(mat => (
                    <option key={mat.id_material} value={mat.id_material}>{mat.nombre_material}</option>
                  ))}
                </select>
                {selectedMaterialId && (
                  <>
                    <Grafica
                      type="bar"
                      data={{
                        labels: stockMaterialPorSitio.map(d => d.sitio),
                        datasets: [{
                          label: "Stock",
                          data: stockMaterialPorSitio.map(d => d.stock),
                          backgroundColor: "#f59e0b"
                        }]
                      }}
                      options={{ responsive: true, plugins: { legend: { display: false } } }}
                    />
                    {stockMaterialPorSitio.every(d => d.stock === 0) && (
                      <div className="text-center text-gray-500 mt-4">No hay stock de este material en los sitios.</div>
                    )}
                  </>
                )}
              </div>

              {/* Stock por sitio (nueva gráfica) */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Stock por Sitio</h2>
                <select
                  className="mb-4 p-2 rounded border dark:bg-gray-900 dark:text-white w-full"
                  value={selectedSitioId}
                  onChange={e => setSelectedSitioId(e.target.value)}
                >
                  <option value="">Seleccione un sitio</option>
                  {sitios.map(sitio => (
                    <option key={sitio.id_sitio} value={sitio.id_sitio}>{sitio.nombre_sitio}</option>
                  ))}
                </select>
                {selectedSitioId && (
                  <>
                    <Grafica
                      type="bar"
                      data={{
                        labels: stockPorSitio.map(d => d.material),
                        datasets: [{
                          label: "Stock",
                          data: stockPorSitio.map(d => d.stock),
                          backgroundColor: "#ec4899"
                        }]
                      }}
                      options={{ responsive: true, plugins: { legend: { display: false } } }}
                    />
                    {stockPorSitio.length === 0 && (
                      <div className="text-center text-gray-500 mt-4">No hay inventario en este sitio.</div>
                    )}
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </AnimatedContainer>
  );
};

export default React.memo(Dashboard);
