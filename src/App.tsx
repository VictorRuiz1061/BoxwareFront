import { Routes, Route } from "react-router-dom";
import Areas  from "./components/pages/area";
import Programas from "./components/pages/programas";
import Fichas from "./components/pages/fichas";

function App() {
  return (
    <Routes>
      <Route path="/area" element={<Areas/>} />
      <Route path="/programa" element={<Programas/>} />
      <Route path="/fichas" element={<Fichas/>} />
          
    </Routes>
  );
}

export default App;
