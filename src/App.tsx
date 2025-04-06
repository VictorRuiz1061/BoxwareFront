import { Routes, Route } from "react-router-dom";

// Auth Pages
import Inicio from "./components/pages/Inicio";
import InicioSecion from "./components/pages/inicioSesion";
import Registrarse from "./components/pages/Registrarse";
import Dashboard from "./components/pages/Dashboar";

// Administration Pages
import Administrador from "./components/pages/Administrador";
import Usuarios from "./components/pages/Usuarios";
import Roles from "./components/pages/Roles";
import Permisos from "./components/pages/Permisos";

// Inventory Pages
import Materiales from "./components/pages/Materiales";
import Elementos from "./components/pages/Elementos";
import TipoMaterial from "./components/pages/TipoMaterial";
import Movimientos from "./components/pages/Movimientos";
import TiposMovimiento from "./components/pages/TiposMovimiento";

// Location Pages
import Sedes from "./components/pages/Sedes";
import Centros from "./components/pages/Centros";
import Municipios from "./components/pages/Municipios";
import Areas from "./components/pages/area";
import Sitios from "./components/pages/Sitos";
import TiposSitio from "./components/pages/TiposSitio";

// Education Pages
import Programas from "./components/pages/programas";
import Fichas from "./components/pages/fichas";

function App() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/" element={<Inicio />} />
      <Route path="/iniciosecion" element={<InicioSecion />} />
      <Route path="/registrarse" element={<Registrarse />} />
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Administration Routes */}
      <Route path="/administrador" element={<Administrador />} />
      <Route path="/usuarios" element={<Usuarios />} />
      <Route path="/roles" element={<Roles />} />
      <Route path="/permisos" element={<Permisos />} />

      {/* Inventory Routes */}
      <Route path="/materiales" element={<Materiales />} />
      <Route path="/elementos" element={<Elementos />} />
      <Route path="/tipo_materiales" element={<TipoMaterial />} />
      <Route path="/movimientos" element={<Movimientos />} />
      <Route path="/tipos_movimiento" element={<TiposMovimiento />} />

      {/* Location Routes */}
      <Route path="/sedes" element={<Sedes />} />
      <Route path="/centros" element={<Centros />} />
      <Route path="/municipios" element={<Municipios />} />
      <Route path="/area" element={<Areas />} />
      <Route path="/sitios" element={<Sitios />} />
      <Route path="/tipos_sitio" element={<TiposSitio />} />

      {/* Education Routes */}
      <Route path="/programas" element={<Programas />} />
      <Route path="/fichas" element={<Fichas />} />
    </Routes>
  );
}

export default App;
