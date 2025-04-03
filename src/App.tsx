import { Routes, Route } from "react-router-dom";
import Inicio from "./components/pages/Inicio";
import InicioSecion from "./components/pages/inicioSesion";
import Registrarse from "./components/pages/Registrarse";
import Dashboard from "./components/pages/Dashboar";
import Materiales from "./components/pages/Materiales";
import Elementos from "./components/pages/Elementos";
import Roles from "./components/pages/Roles";
import Movimientos from "./components/pages/Movimientos";
import TiposMovimiento from "./components/pages/TiposMovimiento";
import TiposSitio from "./components/pages/TiposSitio";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/iniciosecion" element={<InicioSecion />} />
      <Route path="/registrarse" element={<Registrarse />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/materiales" element={<Materiales />} />
      <Route path="/elementos" element={<Elementos />} />
      <Route path="/roles" element={<Roles />} />  
      <Route path="/movimientos" element={<Movimientos />} />
      <Route path="/tipos-movimiento" element={<TiposMovimiento />} />
      <Route path="/tipos-sitio" element={<TiposSitio />} />
    </Routes>
  );
}

export default App;
