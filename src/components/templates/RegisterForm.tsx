import { useNavigate } from 'react-router-dom';
import Form, { FormField } from '../organismos/Form';
import { useAuth } from '../../hooks/useAuth';

export const RegisterForm = () => {
  const navigate = useNavigate();
  const { error, register } = useAuth();

  const formFields: FormField[] = [
    { key: 'nombre', label: 'Nombre completo', type: 'text', required: true },
    { key: 'apellido', label: 'Apellido', type: 'text', required: false },
    { key: 'email', label: 'Correo electrónico', type: 'email', required: true },
    { key: 'telefono', label: 'Teléfono', type: 'text', required: false },
    { key: 'edad', label: 'Edad', type: 'number', required: false },
    { key: 'cedula', label: 'Cédula', type: 'text', required: false },
    { key: 'password', label: 'Contraseña', type: 'password', required: true },
    { key: 'confirmPassword', label: 'Confirmar contraseña', type: 'password', required: true },
  ];

  return (
    <>
      {error && (
        <div className="mb-4 p-2 text-center text-red-600 text-sm font-medium bg-red-50 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Form
          fields={formFields}
          onSubmit={register}
          buttonText="Registrarse"
          className="grid grid-cols-2 gap-x-3 gap-y-2"
        />
      </div>

      <div className="text-center mt-4">
        <p className="text-sm text-gray-700">
          ¿Ya tienes una cuenta?{' '}
          <a
            href="#"
            className="font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200"
            onClick={(e) => {
              e.preventDefault();
              navigate('/iniciosecion');
            }}
          >
            Inicia sesión
          </a>
        </p>
      </div>
    </>
  );
};
