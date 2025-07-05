import React, { useState, useEffect } from 'react';
import { Home, Star, Sparkles } from 'lucide-react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  color: string;
  rotation: number;
}

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  twinkle: number;
}

export default function Beautiful404() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [stars, setStars] = useState<Star[]>([]);
  const [colorShift, setColorShift] = useState(0);

  useEffect(() => {
    // Generar partículas más dinámicas
    const newParticles = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 2,
      speed: Math.random() * 3 + 0.5,
      opacity: Math.random() * 0.8 + 0.2,
      color: Math.random() > 0.5 ? 'blue' : Math.random() > 0.5 ? 'purple' : 'green',
      rotation: Math.random() * 360
    }));
    setParticles(newParticles);

    // Generar estrellas de fondo
    const newStars = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      twinkle: Math.random() * 2 + 1
    }));
    setStars(newStars);

    // Animar partículas
    const particleInterval = setInterval(() => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        y: particle.y > 100 ? -5 : particle.y + particle.speed * 0.15,
        rotation: particle.rotation + 2
      })));
    }, 50);

    // Cambio de colores dinámico
    const colorInterval = setInterval(() => {
      setColorShift(prev => (prev + 1) % 360);
    }, 100);

    return () => {
      clearInterval(particleInterval);
      clearInterval(colorInterval);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100
    });
  };

  const getParticleColor = (color: string) => {
    switch(color) {
      case 'blue': return 'from-blue-400 via-cyan-400 to-blue-600';
      case 'purple': return 'from-purple-400 via-pink-400 to-purple-600';
      case 'green': return 'from-green-400 via-emerald-400 to-green-600';
      default: return 'from-blue-400 to-cyan-400';
    }
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden flex items-center justify-center"
      onMouseMove={handleMouseMove}
      style={{
        background: `linear-gradient(135deg, 
          hsl(${colorShift}, 70%, 15%) 0%, 
          hsl(${(colorShift + 60) % 360}, 60%, 10%) 25%,
          hsl(${(colorShift + 120) % 360}, 65%, 12%) 50%,
          hsl(${(colorShift + 180) % 360}, 60%, 8%) 75%,
          hsl(${(colorShift + 240) % 360}, 70%, 15%) 100%)`
      }}
    >
      {/* Campo de estrellas de fondo */}
      <div className="absolute inset-0 opacity-60">
        {stars.map(star => (
          <div
            key={star.id}
            className="absolute bg-white rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animation: `twinkle ${star.twinkle}s ease-in-out infinite alternate`
            }}
          />
        ))}
      </div>

      {/* Partículas mejoradas */}
      <div className="absolute inset-0 opacity-40">
        {particles.map(particle => (
          <div
            key={particle.id}
            className={`absolute bg-gradient-to-r ${getParticleColor(particle.color)} rounded-full shadow-lg`}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              transform: `rotate(${particle.rotation}deg)`,
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color === 'blue' ? '#3b82f6' : particle.color === 'purple' ? '#a855f7' : '#10b981'}40`,
              animation: `float ${3 + particle.speed}s ease-in-out infinite alternate, glow 2s ease-in-out infinite alternate`
            }}
          />
        ))}
      </div>

      {/* Múltiples gradientes que siguen al mouse */}
      <div 
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          background: `radial-gradient(800px circle at ${mousePosition.x}% ${mousePosition.y}%, 
            hsla(${colorShift}, 80%, 60%, 0.3), 
            hsla(${(colorShift + 120) % 360}, 70%, 50%, 0.2) 30%, 
            transparent 70%)`
        }}
      />
      
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          background: `radial-gradient(400px circle at ${100 - mousePosition.x}% ${100 - mousePosition.y}%, 
            hsla(${(colorShift + 180) % 360}, 85%, 65%, 0.4), 
            transparent 50%)`
        }}
      />

      {/* Ondas de color de fondo */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="absolute w-full h-full"
          style={{
            background: `conic-gradient(from ${colorShift}deg at 50% 50%, 
              hsla(${colorShift}, 60%, 50%, 0.3) 0deg,
              hsla(${(colorShift + 60) % 360}, 60%, 50%, 0.2) 60deg,
              hsla(${(colorShift + 120) % 360}, 60%, 50%, 0.3) 120deg,
              hsla(${(colorShift + 180) % 360}, 60%, 50%, 0.2) 180deg,
              hsla(${(colorShift + 240) % 360}, 60%, 50%, 0.3) 240deg,
              hsla(${(colorShift + 300) % 360}, 60%, 50%, 0.2) 300deg,
              hsla(${colorShift}, 60%, 50%, 0.3) 360deg)`,
            transform: `rotate(${colorShift * 0.5}deg) scale(1.5)`,
            filter: 'blur(100px)'
          }}
        />
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Número 404 ultra mejorado y más visible */}
        <div className="relative mb-8">
          {/* Efectos de brillo para el 404 */}
          <div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-60"
            style={{
              background: `conic-gradient(from ${colorShift * 2}deg, 
                hsla(${colorShift}, 80%, 60%, 0.4),
                hsla(${(colorShift + 120) % 360}, 80%, 60%, 0.3),
                hsla(${(colorShift + 240) % 360}, 80%, 60%, 0.4))`,
              animation: 'spin 15s linear infinite'
            }}
          />
          
          {/* Número 404 grande y destacado */}
          <h1 
            className="text-9xl md:text-[12rem] font-black text-blue-500 animate-pulse select-none relative z-10"
            style={{
              WebkitTextStroke: '4px white',
              color: 'transparent',
              textShadow: `0 0 80px hsla(${colorShift}, 80%, 60%, 0.8), 0 0 120px hsla(${(colorShift + 120) % 360}, 80%, 60%, 0.6)`,
              transform: isHovered ? 'scale(1.08) rotateY(10deg)' : 'scale(1)',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              filter: `drop-shadow(0 0 30px hsla(${colorShift}, 80%, 60%, 0.7))`
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            404
          </h1>
          
          <div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-2xl opacity-40"
            style={{
              background: `radial-gradient(circle, 
                hsla(${(colorShift + 60) % 360}, 90%, 70%, 0.6),
                hsla(${(colorShift + 180) % 360}, 90%, 70%, 0.3),
                transparent)`,
              animation: 'pulse 3s ease-in-out infinite'
            }}
          />

          <h2 className="text-4xl font-bold text-white text-center mb-2 mt-16">¡Página No Encontrada!</h2>
          
          <p 
            className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
            style={{ animation: 'fade-in 2.5s ease-out' }}
          >
            Parece que te has perdido en el espacio digital. Esta página está navegando por otras dimensiones.
          </p>
        </div>

        {/* Botones mejorados */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
          <button 
            className="group relative px-8 py-4 rounded-xl text-white font-semibold text-lg transition-all duration-500 hover:scale-110 flex items-center gap-3 overflow-hidden"
            style={{
              background: `linear-gradient(135deg, 
                hsla(${colorShift}, 70%, 50%, 0.9),
                hsla(${(colorShift + 60) % 360}, 70%, 50%, 0.8))`,
              boxShadow: `0 8px 32px hsla(${colorShift}, 70%, 50%, 0.4), 0 0 60px hsla(${colorShift}, 70%, 50%, 0.2)`,
              border: `2px solid hsla(${colorShift}, 80%, 60%, 0.3)`
            }}
          >
            <Home className="w-5 h-5 transition-transform group-hover:rotate-12 relative z-10" />
            <span className="relative z-10">Volver al Inicio</span>
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: `linear-gradient(135deg, 
                  hsla(${(colorShift + 180) % 360}, 80%, 60%, 0.8),
                  hsla(${(colorShift + 240) % 360}, 80%, 60%, 0.6))`
              }}
            />
            <Sparkles className="w-4 h-4 absolute top-2 right-2 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:animate-spin" />
          </button>

        </div>
      </div>

      {/* Elementos decorativos mejorados */}
      <div 
        className="absolute top-10 left-10 w-32 h-32 rounded-full blur-2xl opacity-60"
        style={{
          background: `radial-gradient(circle, hsla(${colorShift}, 80%, 60%, 0.6), transparent)`,
          animation: 'float 4s ease-in-out infinite alternate'
        }}
      />
      
      <div 
        className="absolute bottom-20 right-20 w-40 h-40 rounded-full blur-3xl opacity-50"
        style={{
          background: `radial-gradient(circle, hsla(${(colorShift + 120) % 360}, 80%, 60%, 0.5), transparent)`,
          animation: 'bounce 3s ease-in-out infinite'
        }}
      />
      
      <div 
        className="absolute top-1/3 left-5 w-24 h-24 rounded-full blur-xl opacity-70"
        style={{
          background: `radial-gradient(circle, hsla(${(colorShift + 240) % 360}, 80%, 60%, 0.7), transparent)`,
          animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite'
        }}
      />

      {/* Rayos de luz */}
      <div 
        className="absolute top-0 left-1/2 w-1 h-full opacity-20 transform -translate-x-1/2"
        style={{
          background: `linear-gradient(to bottom, 
            hsla(${colorShift}, 80%, 60%, 0.8) 0%,
            transparent 50%,
            hsla(${(colorShift + 180) % 360}, 80%, 60%, 0.8) 100%)`,
          animation: 'pulse 4s ease-in-out infinite'
        }}
      />

      {/* Estilos CSS personalizados */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes glow {
          0%, 100% { filter: brightness(1) saturate(1); }
          50% { filter: brightness(1.5) saturate(1.5); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </div>
  );
}