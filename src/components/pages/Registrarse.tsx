import { useNavigate } from 'react-router-dom';
import Form, { FormField } from '@/components/organismos/Form';

const Registro = () => {
  const navigate = useNavigate();

  const formFields: FormField[] = [
    { key: 'nombre', label: 'Nombre completo', type: 'text', required: true },
    { key: 'email', label: 'Correo electrónico', type: 'email', required: true },
    { key: 'password', label: 'Contraseña', type: 'password', required: true },
    { key: 'confirmPassword', label: 'Confirmar contraseña', type: 'password', required: true },
  ];

  const handleFormSubmit = (values: Record<string, string>) => {
    console.log('Registrando usuario:', values);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4"
      style={{ backgroundImage: "url('/assets/image.png')" }} // Imagen de fondo
    >
      <div className="max-w-md w-full bg-white bg-opacity-90 rounded-lg shadow-2xl overflow-hidden">
        <div className="py-8 px-6 md:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900">Crear Cuenta</h1>
            <p className="mt-2 text-sm text-gray-600">
              Completa el formulario para registrarte
            </p>
          </div>

          <Form
            fields={formFields}
            onSubmit={handleFormSubmit}
            buttonText="Registrarse"
          />

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <a
                href="#"
                className="font-medium text-indigo-600 hover:text-indigo-800"
                onClick={() => navigate('/iniciosecion')}
              >
                Inicia sesión
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registro; 