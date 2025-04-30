import { Routes, Route } from "react-router-dom";
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import Inicio from "./components/pages/Inicio";
import InicioSecion from "./components/pages/inicioSesion";
import Registrarse from "./components/pages/Registrarse";
import Dashboard from "./components/pages/Dashboar";

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

function App() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/" element={<Inicio />} />
      <Route path="/iniciosesion" element={<InicioSecion />} />
      <Route path="/registrarse" element={<Registrarse />} />
      {/* Rutas protegidas */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/modulos" element={<ProtectedRoute><Modulos /></ProtectedRoute>} />
      <Route path="/usuarios" element={<ProtectedRoute><Usuarios /></ProtectedRoute>} />
      <Route path="/detalle-usuario/:id?" element={<ProtectedRoute><DetalleUsuario /></ProtectedRoute>} />
      <Route path="/roles" element={<ProtectedRoute><Roles /></ProtectedRoute>} />
      <Route path="/permisos" element={<ProtectedRoute><Permisos /></ProtectedRoute>} />
      <Route path="/materiales" element={<ProtectedRoute><Materiales /></ProtectedRoute>} />
      <Route path="/elementos" element={<ProtectedRoute><Elementos /></ProtectedRoute>} />
      <Route path="/tipo_materiales" element={<ProtectedRoute><TipoMaterial /></ProtectedRoute>} />
      <Route path="/movimientos" element={<ProtectedRoute><Movimientos /></ProtectedRoute>} />
      <Route path="/tipos_movimiento" element={<ProtectedRoute><TiposMovimiento /></ProtectedRoute>} />
      <Route path="/sedes" element={<ProtectedRoute><Sedes /></ProtectedRoute>} />
      <Route path="/centros" element={<ProtectedRoute><Centros /></ProtectedRoute>} />
      <Route path="/municipios" element={<ProtectedRoute><Municipios /></ProtectedRoute>} />
      <Route path="/area" element={<ProtectedRoute><Areas /></ProtectedRoute>} />
      <Route path="/sitios" element={<ProtectedRoute><Sitios /></ProtectedRoute>} />
      <Route path="/tipos_sitio" element={<ProtectedRoute><TiposSitio /></ProtectedRoute>} />
      <Route path="/programas" element={<ProtectedRoute><Programas /></ProtectedRoute>} />
      <Route path="/fichas" element={<ProtectedRoute><Fichas /></ProtectedRoute>} />
      {/* Ruta 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
