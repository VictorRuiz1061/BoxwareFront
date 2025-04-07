import { AuthLayout } from '../../layouts/AuthLayout';
import { LoginForm } from '../templates/LoginForm';

const InicioSesion = () => {
  return (
    <AuthLayout
      title="Iniciar Sesión"
      subtitle="Ingresa tus credenciales para acceder a tu cuenta"
    >
      <LoginForm />
    </AuthLayout>
  );
};

export default InicioSesion;
