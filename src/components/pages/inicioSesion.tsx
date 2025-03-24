import { useNavigate } from 'react-router-dom';
import Form, { FormField } from '../organismos/Form';

const InicioSesion = () => {
  const formFields: FormField[] = [
    { key: 'email', label: 'Correo electrónico', type: 'email', required: true },
    { key: 'password', label: 'Contraseña', type: 'password', required: true },
  ];

  const navigate = useNavigate();

  const handleFormSubmit = (values: Record<string, string>) => {
    const { email, password } = values;

    if (!email || !password) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }

    console.log('Iniciando sesión con:', values);
    console.log('Redirigiendo al dashboard...');

    navigate('/dashboard'); // Asegúrate de que esta línea se ejecuta
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4"
      style={{ backgroundImage: "url('/assets/image.png')" }} // Imagen de fondo
    >
      <div className="max-w-4xl w-full bg-white bg-opacity-90 rounded-lg shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Imagen opcional */}
        <div
          className="hidden md:block md:w-1/2 bg-cover bg-center"
          style={{ backgroundImage: "url('/assets/image.png')" }} 
        >
        </div>

        <div className="w-full md:w-1/2 py-10 px-8 md:px-10">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-gray-900">Iniciar Sesión</h1>
            <p className="mt-3 text-base text-gray-600">
              Ingresa tus credenciales para acceder a tu cuenta
            </p>
          </div>

          <Form
            fields={formFields}
            onSubmit={handleFormSubmit} // Aquí se llama a la función handleFormSubmit
            buttonText='Iniciar Sesión'
          />

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              ¿No tienes una cuenta?{' '}
              <a
                href="#"
                className="font-medium text-indigo-600 hover:text-indigo-800"
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