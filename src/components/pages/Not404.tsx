import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 2000);
    return () => clearTimeout(timer);
  }, []);
  
  const triggerAnimation = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#181A20] overflow-hidden relative">
      {/* Fondo de matriz numérica */}
      <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none select-none">
        {Array.from({ length: 100 }).map((_, index) => (
          <div
            key={index}
            className="absolute text-[#6EE7B7] font-mono animate-float-random"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.2,
              fontSize: `${Math.random() * 14 + 8}px`,
              animationDuration: `${Math.random() * 20 + 10}s`,
              animationDelay: `${Math.random() * 5}s`,
              textShadow: '0 0 6px #0ea5e9, 0 0 2px #fff',
            }}
          >
            {Math.floor(Math.random() * 10)}
          </div>
        ))}
      </div>
      
      {/* Elemento principal */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 text-center"
        onClick={triggerAnimation}
      >
        {/* Números 404 GIGANTES */}
        <div className="relative mb-4 select-none cursor-pointer">
          <div className={`w-full flex justify-center items-center transition-all duration-1000 ${isAnimating ? 'scale-105' : ''}`}
            style={{
              minHeight: '40vh',
              height: 'min(60vw, 70vh)',
              maxHeight: '80vh',
            }}
          >
            <span className="inline-block animate-float-slow"
              style={{
                fontSize: 'min(30vw, 30vh)',
                lineHeight: 1,
                textShadow: '0 0 80px #fff, 0 0 40px #fff, 0 0 10px #fff, 0 0 2px #fff',
                color: '#fff',
              }}
            >4</span>
            <span className="inline-block relative mx-2 text-[#7C3AED]"
              style={{
                fontSize: 'min(30vw, 30vh)',
                lineHeight: 1,
                textShadow: '0 0 80px #7C3AED, 0 0 20px #fff',
                filter: 'drop-shadow(0 0 10px #7C3AED)',
                transform: `translate3d(${isAnimating ? 0 : -30}px, ${isAnimating ? 0 : -30}px, 0) scale(${isAnimating ? 1.2 : 1})`,
              }}
            >
              <span className="animate-pulse">0</span>
              {/* Círculos orbitando el 0 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full animate-spin-slow">
                  <div className="absolute top-0 left-1/2 w-3 h-3 bg-[#F472B6] rounded-full shadow-lg border border-white/80 transform -translate-x-1/2"></div>
                </div>
                <div className="w-full h-full animate-spin-slow-reverse">
                  <div className="absolute bottom-0 left-1/2 w-3 h-3 bg-[#6EE7B7] rounded-full shadow-lg border border-white/80 transform -translate-x-1/2"></div>
                </div>
              </div>
            </span>
            <span className="inline-block animate-float-slow"
              style={{
                fontSize: 'min(30vw, 30vh)',
                lineHeight: 1,
                textShadow: '0 0 60px #fff, 0 0 20px #0ea5e9, 0 0 2px #fff',
                color: '#fff',
              }}
            >4</span>
          </div>
          {/* Líneas de falla digital */}
          <div className={`absolute left-0 right-0 h-2 bg-[#7C3AED] top-1/2 opacity-80 transform -translate-y-1/2 rounded-full shadow-lg ${isAnimating ? 'animate-glitch' : ''}`}></div>
          <div className={`absolute left-0 right-0 h-1 bg-[#F472B6] top-1/3 opacity-60 transform -translate-y-1/2 rounded-full shadow-lg ${isAnimating ? 'animate-glitch-delay' : ''}`}></div>
          <div className={`absolute left-0 right-0 h-1 bg-[#38BDF8] bottom-1/3 opacity-60 transform -translate-y-1/2 rounded-full shadow-lg ${isAnimating ? 'animate-glitch-delay-2' : ''}`}></div>
        </div>
        {/* Mensaje con mejor UI/UX */}
        <div className="mb-6 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
          <h2 className="text-2xl font-bold mb-2 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]" style={{ color: '#fff', textShadow: '0 0 8px #000, 0 0 2px #fff', WebkitTextStroke: '0.5px #fff' }}>La página no existe en esta dimensión</h2>
          <p className="max-w-md mx-auto opacity-100 text-base" style={{ color: '#fff', textShadow: '0 0 8px #000, 0 0 2px #fff', WebkitTextStroke: '0.5px #fff' }}>
            El recurso que buscas ha sido eliminado, movido o nunca existió.
          </p>
        </div>
        
        {/* Botones de navegación */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/')}
            className="group relative px-6 py-2 bg-white hover:bg-[#6D28D9] text-[#7C3AED] hover:text-white rounded-md overflow-hidden transition-all duration-300 font-semibold shadow-lg border border-white/10"
            style={{ textShadow: '0 0 8px #000', fontWeight: 700 }}
          >
            <div className="absolute inset-0 w-2 bg-[#7C3AED] opacity-30 group-hover:animate-glitch-button"></div>
            <span className="relative">Página principal</span>
          </button>
        </div>
        
        {/* Contador binario */}
        <div className="mt-6 font-mono text-xs text-[#6EE7B7] drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
          <p className="animate-typing overflow-hidden whitespace-nowrap">
            {Math.random().toString(2).substring(2, 42)}
          </p>
        </div>
      </div>
      
      {/* Estilo global para animaciones y contraste */}
      <style>{`
        @keyframes float-random {
          0% { transform: translate(0, 0); }
          20% { transform: translate(10px, 10px); }
          40% { transform: translate(-10px, 15px); }
          60% { transform: translate(10px, -10px); }
          80% { transform: translate(-10px, -10px); }
          100% { transform: translate(0, 0); }
        }
        
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes spin-slow-reverse {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes glitch {
          0%, 100% { transform: translateX(0) translateY(-50%); }
          20% { transform: translateX(-10px) translateY(-50%); }
          40% { transform: translateX(10px) translateY(-50%); }
          60% { transform: translateX(-5px) translateY(-50%); }
          80% { transform: translateX(5px) translateY(-50%); }
        }
        
        @keyframes glitch-delay {
          0%, 100% { transform: translateX(0) translateY(-50%); }
          20% { transform: translateX(10px) translateY(-50%); }
          40% { transform: translateX(-10px) translateY(-50%); }
          60% { transform: translateX(5px) translateY(-50%); }
          80% { transform: translateX(-5px) translateY(-50%); }
        }
        
        @keyframes glitch-delay-2 {
          0%, 100% { transform: translateX(0) translateY(-50%); }
          20% { transform: translateX(-15px) translateY(-50%); }
          40% { transform: translateX(15px) translateY(-50%); }
          60% { transform: translateX(-7px) translateY(-50%); }
          80% { transform: translateX(7px) translateY(-50%); }
        }
        
        @keyframes glitch-button {
          0%, 100% { transform: translateX(-100%); }
          50%, 90% { transform: translateX(100%); }
        }
        
        @keyframes typing {
          from { width: 0 }
          to { width: 100% }
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        
        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 6s linear infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 3s ease-in-out infinite;
        }
        
        .animate-float-random {
          animation: float-random 15s ease-in-out infinite;
        }
        
        .animate-glitch {
          animation: glitch 0.5s ease-in-out;
        }
        
        .animate-glitch-delay {
          animation: glitch-delay 0.5s ease-in-out 0.1s;
        }
        
        .animate-glitch-delay-2 {
          animation: glitch-delay-2 0.5s ease-in-out 0.2s;
        }
        
        .animate-typing {
          animation: typing 5s steps(40) infinite alternate;
        }
        
        body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
          background-color: #181A20;
        }
        
        @media (max-width: 600px) {
          .text-[16rem], .text-[22rem] { font-size: 4rem !important; }
          .max-w-5xl { max-width: 98vw !important; }
        }
      `}</style>
    </div>
  );
};

export default React.memo(NotFound);
