import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuth, useAuthStatus } from '@/hooks';
import { AnimatedContainer } from '@/components/atomos';
import { useAuthContext } from '@/context/AuthContext';

const InicioSesion = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const { isAuthenticated } = useAuthStatus();
  const { setUser } = useAuthContext();

  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, field: 'email' | 'password') => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (field === 'email') passwordRef.current?.focus();
      else handleLogin();
    }
  };

  const handleLogin = async () => {
    setError(null);
    if (!email || !password) {
      setError('Por favor, ingresa tu correo y contraseña');
      return;
    }

    try {
      // Enviar las credenciales con el nombre de campo correcto (contrasena en lugar de password)
      const result = await loginUser({ email, contrasena: password });
      
      if (!result || !result.token) {
        setError('Error al iniciar sesión: Credenciales inválidas');
        return;
      }
      
      // Si llegamos aquí, el login fue exitoso
      if (result.user) {
        setUser(result.user);
      }
      
      // La redirección se maneja en useEffect cuando isAuthenticated cambia
    } catch (error) {
      setError('Error al conectar con el servidor');
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4 relative"
      style={{ backgroundImage: "url('/assets/interior-large-logistics-warehouse-ai-generative.jpg')" }}>
        
      <div className="absolute inset-0 backdrop-blur-sm bg-black/30"></div>

      <AnimatedContainer animation="slideUp" duration={800}>
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden flex flex-col relative z-10">
          <div className="flex justify-center py-6">
            <div className="w-32 h-32 relative">
              <img src="/assets/logo.png" alt="Boxware Logo" className="w-full h-full object-contain" />
            </div>
          </div>

          <div className="w-full px-8 pb-6">
            <div className="text-center mb-4">
              <h1 className="text-2xl font-bold text-gray-900">Iniciar Sesión</h1>
              <p className="mt-1 text-sm text-gray-500">
                Ingresa tus credenciales para acceder a tu cuenta
              </p>
            </div>

            {error && (
              <div className="mb-4 p-2 text-center text-red-600 text-sm font-medium bg-red-50 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Correo electrónico</label>
                <input 
                  type="email"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  ref={emailRef}
                  onKeyDown={e => handleKeyDown(e, 'email')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Contraseña</label>
                <input 
                  type="password"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  ref={passwordRef}
                  onKeyDown={e => handleKeyDown(e, 'password')}
                />
              </div>
              <button 
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 mt-2"
                onClick={handleLogin}
              >
                Iniciar Sesión
              </button>
            </div>

            <div className="text-center mt-4">
              <p className="text-xs text-gray-500">
                ¿No tienes una cuenta? <a href="#" className="font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200" onClick={() => navigate('/registrarse')}>Regístrate</a>
              </p>
            </div>
          </div>
        </div>
      </AnimatedContainer>
    </div>
  );
};

export default InicioSesion;
