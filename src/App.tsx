import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";

// Auth Pages
import Inicio from "./components/pages/Inicio";
import InicioSecion from "./components/pages/inicioSesion";
import Registrarse from "./components/pages/Registrarse";
import Dashboard from "./components/pages/Dashboard";

// Administracion Pages
import Modulos from "./components/pages/Modulos";
import Usuarios from "./components/pages/Usuarios";
import Roles from "./components/pages/Roles";
import Permisos from "./components/pages/Permisos";
import DetalleUsuario from "./components/pages/DetalleUsuario";

// Inventario Pages
import Materiales from "./components/pages/Materiales";
import Elementos from "./components/pages/Elementos";
import TipoMaterial from "./components/pages/TipoMaterial";
import Movimientos from "./components/pages/Movimientos";
import TiposMovimiento from "./components/pages/TiposMovimiento";

// Ubicacion Pages
import Sedes from "./components/pages/Sedes";
import Centros from "./components/pages/Centros";
import Municipios from "./components/pages/Municipios";
import Areas from "./components/pages/area";
import Sitios from "./components/pages/Sitos";
import TiposSitio from "./components/pages/TiposSitio";

// Education Pages
import Programas from "./components/pages/programas";
import Fichas from "./components/pages/fichas";
import NotFound from "./components/pages/Not404";

// // Informes Pages
// import Informes from "./components/pages/Informes";
// import MaterialesPorUsuario from "./components/pages/informes/MaterialesPorUsuario";
// import InventarioPorSedeArea from "./components/pages/informes/InventarioPorSedeArea";
// import MovimientosHistoricos from "./components/pages/informes/MovimientosHistoricos";
// import MaterialesStockMinimo from "./components/pages/informes/MaterialesStockMinimo";
// import MaterialesMasUtilizados from "./components/pages/informes/MaterialesMasUtilizados";
// import UsuariosConMasMateriales from "./components/pages/informes/UsuariosConMasMateriales";
// import EstadoInventario from "./components/pages/informes/EstadoInventario";
// import TransferenciasSedes from "./components/pages/informes/TransferenciasSedes";
// import HistorialPorUsuario from "./components/pages/informes/HistorialPorUsuario";
// import MaterialesBaja from "./components/pages/informes/MaterialesBaja";

function App() {
  return (
    <Routes>
      {/* Auth Routes - No Layout */}
      <Route path="/" element={<Inicio />} />
      <Route path="/iniciosesion" element={<InicioSecion />} />
      <Route path="/registrarse" element={<Registrarse />} />
      
      {/* Rutas protegidas con MainLayout (Header + Sidebar) */}
      <Route element={<MainLayout />}>
        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Administración */}
        <Route path="/modulos" element={<Modulos />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/detalle-usuario/:id?" element={<DetalleUsuario />} />
        <Route path="/roles" element={<Roles />} />
        <Route path="/permisos" element={<Permisos />} />
        
        {/* Inventario */}
        <Route path="/materiales" element={<Materiales />} />
        <Route path="/elementos" element={<Elementos />} />
        <Route path="/tipo_materiales" element={<TipoMaterial />} />
        <Route path="/movimientos" element={<Movimientos />} />
        <Route path="/tipos_movimiento" element={<TiposMovimiento />} />
        
        {/* Ubicaciones */}
        <Route path="/sedes" element={<Sedes />} />
        <Route path="/centros" element={<Centros />} />
        <Route path="/municipios" element={<Municipios />} />
        <Route path="/area" element={<Areas />} />
        <Route path="/sitios" element={<Sitios />} />
        <Route path="/tipos_sitio" element={<TiposSitio />} />
        
        {/* Educación */}
        <Route path="/programas" element={<Programas />} />
        <Route path="/fichas" element={<Fichas />} />
{/*         
        <Route path="/informes" element={<Informes />} />
        <Route path="/informes/materiales-por-usuario" element={<MaterialesPorUsuario />} />
        <Route path="/informes/inventario-por-sede-area" element={<InventarioPorSedeArea />} />
        <Route path="/informes/movimientos-historicos" element={<MovimientosHistoricos />} />
        <Route path="/informes/materiales-stock-minimo" element={<MaterialesStockMinimo />} />
        <Route path="/informes/materiales-mas-utilizados" element={<MaterialesMasUtilizados />} />
        <Route path="/informes/usuarios-con-mas-materiales" element={<UsuariosConMasMateriales />} />
        <Route path="/informes/estado-inventario" element={<EstadoInventario />} />
        <Route path="/informes/transferencias-sedes" element={<TransferenciasSedes />} />
        <Route path="/informes/historial-por-usuario" element={<HistorialPorUsuario />} />
        <Route path="/informes/materiales-baja" element={<MaterialesBaja />} />
        */}
      </Route>
       
      {/* Ruta 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
