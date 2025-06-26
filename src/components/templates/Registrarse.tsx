import { useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import { useAuth } from '@/hooks/auth';
import { AnimatedContainer } from '@/components/atomos';

const Registrarse = () => {
  const navigate = useNavigate();
  const { registerUser } = useAuth();

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    edad: '',
    cedula: '',
    password: '',
    confirmPassword: '',
    id_rol: 1
  });
  const [error, setError] = useState('');

  const inputRefs = Array.from({ length: 8 }, () => useRef<HTMLInputElement>(null));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (idx < inputRefs.length - 1) inputRefs[idx + 1].current?.focus();
      else {
        (document.activeElement as HTMLElement).blur();
        handleRegister();
      }
    }
  };

  const handleRegister = async () => {
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    // Mapear los campos del formulario al formato esperado por la API
    // Solo incluir los campos que están en la interfaz RegisterData
    const response = await registerUser({
      nombre: formData.nombre,
      apellido: formData.apellido,
      edad: formData.edad ? Number(formData.edad) : null,
      cedula: formData.cedula,
      email: formData.email,
      contrasena: formData.password, // Cambio de password a contrasena
      telefono: formData.telefono
      // Nota: rol_id, estado y fecha_registro se manejan en el backend
    });

    if (response) {
      navigate('/iniciosesion');
    } else {
      setError('Error al registrar usuario. Intenta nuevamente.');
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
              <h1 className="text-2xl font-bold text-gray-900">Crear Cuenta</h1>
              <p className="mt-1 text-sm text-gray-500">
                Completa el formulario para registrarte
              </p>
            </div>

            {error && (
              <div className="mb-4 p-2 text-center text-red-600 text-sm font-medium bg-red-50 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-x-3 gap-y-4">
                {[
                  ['Nombre', 'nombre'],
                  ['Apellido', 'apellido'],
                  ['Correo electrónico', 'email'],
                  ['Teléfono', 'telefono'],
                  ['Edad', 'edad'],
                  ['Cédula', 'cedula'],
                  ['Contraseña', 'password'],
                  ['Confirmar contraseña', 'confirmPassword']
                ].map(([label, name], idx) => (
                  <div key={name} className={idx >= 6 ? 'col-span-2' : ''}>
                    <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
                    <input
                      type={name.includes('password') ? 'password' : name === 'edad' ? 'number' : 'text'}
                      name={name}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={(formData as any)[name]}
                      onChange={handleChange}
                      ref={inputRefs[idx]}
                      onKeyDown={e => handleKeyDown(e, idx)}
                    />
                  </div>
                ))}
              </div>
              <button
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 mt-2"
                onClick={handleRegister}
              >
                Registrarse
              </button>
            </div>

            <div className="text-center mt-4">
              <p className="text-xs text-gray-500">
                ¿Ya tienes una cuenta?{' '}
                <a
                  href="#"
                  className="font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/iniciosesion');
                  }}
                >
                  Inicia sesión
                </a>
              </p>
            </div>
          </div>
        </div>
      </AnimatedContainer>
    </div>
  );
};

export default Registrarse;
