import { useNavigate } from 'react-router-dom';
import Form, { FormField } from '../organismos/Form';
import { useAuth } from '../../hooks/useAuth';

const InicioSesion = () => {
  const navigate = useNavigate();
  const { login, error } = useAuth();

  const formFields: FormField[] = [
    { key: 'email', label: 'Correo electrónico', type: 'email', required: true },
    { key: 'password', label: 'Contraseña', type: 'password', required: true },
  ];

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4 relative"
      style={{ backgroundImage: "url('/assets/image.png')" }}>
        
      <div className="absolute inset-0 backdrop-blur-sm bg-black/30"></div>

      <div className="max-w-4xl w-full bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-10 border border-white/20">
        <div
          className="hidden md:block md:w-1/2 bg-cover bg-center relative overflow-hidden"
          style={{ backgroundImage: "url('/assets/image.png')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30 mix-blend-overlay"></div>
        </div>

        {/* Right side - Content */}
        <div className="w-full md:w-1/2 py-12 px-8 md:px-12 backdrop-blur-md bg-white/40">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-gray-900 drop-shadow-sm">Iniciar Sesión</h1>
            <p className="mt-3 text-base text-gray-700">
              Ingresa tus credenciales para acceder a tu cuenta
            </p>
          </div>

          {error && (
            <div className="mb-4 p-2 text-center text-red-600 text-sm font-medium bg-red-50 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <Form
            fields={formFields}
            onSubmit={login}
            buttonText='Iniciar Sesión'
          />

          <div className="text-center mt-8">
            <p className="text-sm text-gray-700">
              ¿No tienes una cuenta?{' '}
              <a
                href="#"
                className="font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200"
                onClick={() => navigate('/registrarse')}
              >
                Regístrate
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InicioSesion;