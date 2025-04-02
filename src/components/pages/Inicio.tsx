import { useNavigate } from 'react-router-dom'; // Cambiado a useNavigate
import Boton from '../atomos/Boton';

const Inicio = () => {
  const navigate = useNavigate(); // Hook para manejar la navegación

  return (
    
    <div className="relative w-full h-screen bg-cover bg-center flex items-center justify-center overflow-hidden" style={{ backgroundImage: "url('/assets/image.png')" }}>
      <div className="flex flex-col items-center justify-center px-4 text-center h-[calc(100vh-64px)]">
        <h1 className="md:text-6xl font-extrabold text-gray-900 m-6">
          ¡Bienvenido a nuestra plataforma Boxware!
        </h1>
        
        <div className="flex items-center space-x-4">
          <Boton color="primary" variant="shadow" onClick={() => navigate('/iniciosecion')}>
            Iniciar Sesión
          </Boton>
              
          <Boton color="primary" variant="shadow" onClick={() => navigate('/registrarse')}>
            Registrarse
          </Boton>
        </div>
      </div>
  </div>
  );
};

export default Inicio;
