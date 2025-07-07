import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useAuth, useAuthStatus } from '@/hooks';
import { AnimatedContainer } from '@/components/atomos';
import { useAuthContext } from '@/context/AuthContext';
import { MoleculaModal as Modal } from '@/components/moleculas';
import { useForgotPassword, useVerifyCode, useResetPassword } from '@/hooks/auth/restablecerContraseña';
import { showSuccessToast, showErrorToast } from '@/components/atomos';
import axios from '@/api/axiosConfig';

// Componente integrado para recuperación de contraseña
const PasswordRecoveryFlow = ({ onClose }: { onClose: () => void }) => {
  const [step, setStep] = useState<'email' | 'code_password'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Paso 1: Solicitar código
  const handleRequestCode = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Por favor, ingresa tu correo electrónico');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:3000/recuperar', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    
    xhr.onload = function() {
      setIsLoading(false);
      if (xhr.status >= 200 && xhr.status < 300) {
        console.log('✅ Código enviado correctamente');
        showSuccessToast('Se ha enviado un código de verificación a tu correo');
        setStep('code_password');
      } else {
        let errorMsg = 'Error al enviar el código';
        try {
          const response = JSON.parse(xhr.responseText);
          errorMsg = response.message || errorMsg;
        } catch (e) {}
        console.error('❌ Error al solicitar código:', xhr.status, xhr.responseText);
        setError(errorMsg);
      }
    };
    
    xhr.onerror = function() {
      setIsLoading(false);
      console.error('❌ Error de red al solicitar código');
      setError('Error de conexión. Por favor, intenta nuevamente.');
    };
    
    xhr.send(JSON.stringify({ email }));
  };
  
  // Paso 2: Actualizar contraseña directamente con el código
  const handleUpdatePassword = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!code) {
      setError('Por favor, ingresa el código de verificación');
      return;
    }
    
    if (!newPassword) {
      setError('Por favor, ingresa la nueva contraseña');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    // Usar fetch en lugar de XMLHttpRequest para mayor claridad
    fetch('http://localhost:3000/restablecer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        codigo: code,
        nuevaContrasena: newPassword
      })
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(data => {
          throw new Error(data.message || 'Error al actualizar la contraseña');
        });
      }
      return response.json();
    })
    .then(data => {
      console.log('✅ Contraseña actualizada correctamente:', data);
      showSuccessToast('Contraseña actualizada correctamente');
      onClose();
    })
    .catch(error => {
      console.error('❌ Error:', error);
      setError(error.message || 'Error al actualizar la contraseña');
    })
    .finally(() => {
      setIsLoading(false);
    });
  };
  
  // Renderizar el paso actual
  const renderStep = () => {
    switch (step) {
      case 'email':
        return (
          <>
            <p className="text-sm text-gray-600 mb-4">
              Ingresa tu correo electrónico y te enviaremos un código de verificación.
            </p>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <button
              type="button"
              disabled={isLoading}
              className={`w-full text-white text-center py-2 px-4 rounded ${isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
              onClick={handleRequestCode}
            >
              {isLoading ? 'Enviando...' : 'Enviar Código'}
            </button>
          </>
        );
      
      case 'code_password':
        return (
          <>
            <p className="text-sm text-gray-600 mb-4">
              Ingresa el código de verificación que enviamos a {email} y tu nueva contraseña.
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código de verificación
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Ingresa el código"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nueva contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Mínimo 6 caracteres"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                type="button"
                className="flex-1 text-gray-600 text-center py-2 px-4 rounded border hover:bg-gray-100"
                onClick={() => setStep('email')}
              >
                Atrás
              </button>
              
              <button
                type="button"
                disabled={isLoading}
                className={`flex-1 text-white text-center py-2 px-4 rounded ${isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                onClick={handleUpdatePassword}
              >
                {isLoading ? 'Actualizando...' : 'Actualizar Contraseña'}
              </button>
            </div>
            
            <button
              type="button"
              className="w-full text-blue-600 text-center py-2 text-sm hover:underline mt-2"
              onClick={handleRequestCode}
            >
              Reenviar código
            </button>
          </>
        );
    }
  };
  
  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={step === 'email' ? 'Recuperar Contraseña' : 'Nueva Contraseña'}
    >
      <div className="space-y-4">
        {error && (
          <div className="p-2 bg-red-50 border border-red-200 text-red-600 rounded text-sm">
            {error}
          </div>
        )}
        
        {renderStep()}
      </div>
    </Modal>
  );
};

const InicioSesion = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const { isAuthenticated } = useAuthStatus();
  const { setUser } = useAuthContext();
  const { mutateAsync: forgotPassword } = useForgotPassword();
  const { mutateAsync: verifyCode } = useVerifyCode();
  const { mutateAsync: resetPasswordMutation } = useResetPassword();

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPasswordRecovery, setShowPasswordRecovery] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleLogin = async () => {
    setError(null);
    if (!email || !password) {
      showErrorToast('Por favor, ingresa tu correo y contraseña');
      return;
    }
    try {
      const result = await loginUser({ email, contrasena: password });
      if (!result || !result.token) {
        if (result && result.message && result.message.toLowerCase().includes('correo')) {
          showErrorToast('El correo no está registrado');
        } else {
          showErrorToast('Error al iniciar sesión: Credenciales inválidas');
        }
        return;
      }
      if (result.user) {
        setUser(result.user);
      }
    } catch (error: any) {
      if (error?.response?.data?.message && error.response.data.message.toLowerCase().includes('correo')) {
        showErrorToast('El correo no está registrado');
      } else {
        showErrorToast('Error al conectar con el servidor');
      }
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
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    ref={passwordRef}
                    onKeyDown={e => handleKeyDown(e, 'password')}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    onClick={(e) => {
                      e.preventDefault();
                      togglePasswordVisibility();
                    }}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <button 
                type="button"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 mt-2"
                onClick={(e) => {
                  e.preventDefault();
                  handleLogin();
                }}
              >
                Iniciar Sesión
              </button>
            </div>

            <div className="text-center mt-4 space-y-2">
              <p className="text-xs text-gray-500">
                ¿No tienes una cuenta? <a href="#" className="font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200" onClick={(e) => {
                  e.preventDefault();
                  navigate('/registrarse');
                }}>Regístrate</a>
              </p>
              <p className="text-xs text-gray-500">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200" onClick={(e) => {
                  e.preventDefault();
                  setShowPasswordRecovery(true);
                }}>¿Olvidaste tu contraseña?</a>
              </p>
            </div>
          </div>
        </div>
      </AnimatedContainer>

      {/* Flujo integrado de recuperación de contraseña */}
      {showPasswordRecovery && (
        <PasswordRecoveryFlow onClose={() => setShowPasswordRecovery(false)} />
      )}
    </div>
  );
};

export default InicioSesion;
