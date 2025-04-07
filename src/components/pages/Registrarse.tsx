import { AuthLayout } from '../../layouts/AuthLayout';
import { RegisterForm } from '../templates/RegisterForm';

const Registro = () => {
  return (
    <AuthLayout
      title="Crear Cuenta"
      subtitle="Completa el formulario para registrarte"
    >
      <RegisterForm />
    </AuthLayout>
  );
};

export default Registro;
