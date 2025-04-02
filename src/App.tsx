import { Routes, Route } from "react-router-dom";
import Areas  from "./components/pages/area";
import Programas from "./components/pages/programas";
import Fichas from "./components/pages/fichas";
import Usuarios from "./components/pages/Usuarios";
import Inicio from "./components/pages/Inicio";
import InicioSesion from "./components/pages/inicioSesion";
import Registro from "./components/pages/Registrarse";
import PaginaInicio from "./components/pages/Dashboar";
import Elementos from "./components/pages/Elementos";
import Materiales from "./components/pages/Materiales";
import Sitios from "./components/pages/Sitos";
import TipoMaterial from "./components/pages/TipoMaterial";



function App() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/iniciosecion" element={<InicioSesion />} />
      <Route path="/registrarse" element={<Registro />} />
      <Route path="/dashboard" element={<PaginaInicio />} />
      <Route path="/usuarios" element={<Usuarios />} />
      <Route path="/materiales" element={<Materiales />} />
      <Route path="/elementos" element={<Elementos />} />
      <Route path="/sitios" element={<Sitios />} />
      <Route path="/tipo_materiales" element={<TipoMaterial />} />
      <Route path="/area" element={<Areas/>} />
      <Route path="/programa" element={<Programas/>} />
      <Route path="/fichas" element={<Fichas/>} />
          
    </Routes>
  );
}

export default App;
