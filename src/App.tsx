import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";

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

// Inventario Pages
import Materiales from "./components/pages/Materiales";
import Elementos from "./components/pages/Elementos";
import Stock from "./components/pages/Stock";
import TipoMaterial from "./components/pages/TipoMaterial";
import Movimientos from "./components/pages/Movimientos";
import TiposMovimiento from "./components/pages/TiposMovimiento";

// Ubicacion Pages
import Sedes from "./components/pages/Sedes";
import Centros from "./components/pages/Centros";
import Municipios from "./components/pages/Municipios";
import Areas from "./components/pages/Areas";
import Sitios from "./components/pages/Sitos";
import TiposSitio from "./components/pages/TiposSitio";

// Education Pages
import Programas from "./components/pages/programas";
import Fichas from "./components/pages/fichas";
import NotFound from "./components/templates/Not404";
import Configuraciones from "@/components/templates/Configuracion";

function App() {
  return (
    <AuthProvider>
      <Routes>
      {/* Auth Routes - No Layout */}
      <Route path="/" element={<Inicio />} />
      <Route path="/iniciosesion" element={<InicioSecion />} />
      <Route path="/registrarse" element={<Registrarse />} />

      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Administración */}
        <Route path="/modulos" element={<Modulos />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/roles" element={<Roles />} />
        <Route path="/permisos" element={<Permisos />} />
        
        {/* Inventario */}
        <Route path="/materiales" element={<Materiales />} />
        <Route path="/elementos" element={<Elementos />} />
        <Route path="/stock" element={<Stock />} />
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
        <Route path="/configuraciones" element={<Configuraciones />} />
      </Route>
       
      {/* Ruta 404 */}
      <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
