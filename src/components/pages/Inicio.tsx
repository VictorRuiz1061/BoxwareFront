import { useNavigate } from 'react-router-dom'; // Cambiado a useNavigate
import Boton from '../atomos/Boton';
import Card from '../atomos/Card';
import AnimatedContainer from '../atomos/AnimatedContainer';

const Inicio = () => {
  const navigate = useNavigate(); // Hook para manejar la navegación

  return (
    
    <div className="relative w-full h-screen bg-cover bg-center flex items-center justify-center overflow-hidden" style={{ backgroundImage: "url('/assets/interior-large-logistics-warehouse-ai-generative.jpg')" }}>
      <AnimatedContainer animation="slideUp" duration={800}>
        <Card className="flex flex-col items-center justify-center px-8 py-10 text-center">
          <AnimatedContainer animation="slideUp" delay={300} duration={800}>
            <h1 className="md:text-6xl font-extrabold text-white m-6">
              ¡Bienvenido a nuestra plataforma Boxware!
            </h1>
          </AnimatedContainer>
          
          <AnimatedContainer animation="slideUp" delay={600} duration={800}>
            <div className="flex items-center space-x-4">
              <Boton color="primary" variant="shadow" onClick={() => navigate('/iniciosesion')}>
                Iniciar Sesión
              </Boton>
                  
              <Boton color="primary" variant="shadow" onClick={() => navigate('/registrarse')}>
                Registrarse
              </Boton>
            </div>
          </AnimatedContainer>
        </Card>
      </AnimatedContainer>
  </div>
  );
};

export default Inicio;
