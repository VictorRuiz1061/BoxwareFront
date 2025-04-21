import { useNavigate } from 'react-router-dom';
import Form, { FormField } from '../organismos/Form';
import { LoginFormValues } from '../../types/auth';
import { useAuth } from '../../hooks/useAuth';

export const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const formFields: FormField[] = [
    { key: 'email', label: 'Correo electrónico', type: 'email', required: true },
    { key: 'password', label: 'Contraseña', type: 'password', required: true },
  ];

  return (
    <>
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
    </>
  );
};
