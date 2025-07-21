import { useNavigate } from 'react-router-dom';
import { Botton, Card, AnimatedContainer } from '@/components/atomos';

const Inicio = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-screen bg-cover bg-center flex items-center justify-center overflow-hidden" style={{ backgroundImage: "url('/assets/interior-large-logistics-warehouse-ai-generative.jpg')" }}>
      <AnimatedContainer animation="slideUp">
        <Card className="flex flex-col items-center justify-center px-8 py-10 text-center">
            <h1 className="md:text-6xl font-extrabold text-white m-6">
              ¡Bienvenido a nuestra plataforma Boxware!
            </h1>
          
            <div className="flex items-center space-x-4">
              <Botton texto='Iniciar Sesión' onClick={() => navigate('/iniciosesion')}/>

              <Botton texto='Registrarse' onClick={() => navigate('/registrarse')}/>
            </div>
        </Card>
      </AnimatedContainer>
  </div>
  );
};

export default Inicio;
