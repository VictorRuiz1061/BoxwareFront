import { Routes, Route } from "react-router-dom";
import Inicio from "./components/pages/Inicio";
import InicioSecion from "./components/pages/inicioSesion";
import Registrarse from "./components/pages/Registrarse";
import Dashboard from "./components/pages/Dashboar";
import Materiales from "./components/pages/Materiales";
import Elementos from "./components/pages/Elementos";
import Sitios from "./components/pages/Sitos";
import TipoMaterial from "./components/pages/TipoMaterial";
import Usuarios from "./components/pages/Usuarios";
import Roles from "./components/pages/Roles";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/iniciosecion" element={<InicioSecion />} />
      <Route path="/registrarse" element={<Registrarse />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/usuarios" element={<Usuarios />} />
      <Route path="/materiales" element={<Materiales />} />
      <Route path="/elementos" element={<Elementos />} />
      <Route path="/sitios" element={<Sitios />} />
      <Route path="/tipo_materiales" element={<TipoMaterial />} />
      <Route path="/roles" element={<Roles />} />
          
    </Routes>
  );
}

export default App;
