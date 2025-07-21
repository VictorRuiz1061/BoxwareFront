import { useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import { useAuth } from '@/hooks/auth';
import { AnimatedContainer, Botton } from '@/components/atomos';

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
    id_rol: 2
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const inputRefs = Array.from({ length: 7 }, () => useRef<HTMLInputElement>(null));

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
    setIsLoading(true);

    // Mapear los campos del formulario al formato esperado por la API
    const now = new Date().toISOString();
    const response = await registerUser({
      nombre: formData.nombre,
      apellido: formData.apellido,
      edad: formData.edad ? Number(formData.edad) : undefined,
      cedula: formData.cedula,
      email: formData.email,
      contrasena: formData.password,
      telefono: formData.telefono,
      estado: true,
      fecha_registro: now,
      rol_id: 2
    } as any);

    setIsLoading(false);

    if (response) {
      navigate('/iniciosesion');
    } else {
      setError('Error al registrar usuario. Intenta nuevamente.');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const formFields = [
    { label: 'Nombre', name: 'nombre', type: 'text', placeholder: 'Ingresa tu nombre' },
    { label: 'Apellido', name: 'apellido', type: 'text', placeholder: 'Ingresa tu apellido' },
    { label: 'Correo electrónico', name: 'email', type: 'email', placeholder: 'ejemplo@correo.com' },
    { label: 'Teléfono', name: 'telefono', type: 'tel', placeholder: '+57 300 123 4567' },
    { label: 'Edad', name: 'edad', type: 'number', placeholder: '18' },
    { label: 'Cédula', name: 'cedula', type: 'text', placeholder: '12345678' },
    { label: 'Contraseña', name: 'password', type: showPassword ? 'text' : 'password', placeholder: 'Mínimo 6 caracteres' }
  ];

  return (
    <div
      className="min-h-screen bg-cover bg-center flex justify-center py-2 relative"
      style={{ backgroundImage: "url('/assets/interior-large-logistics-warehouse-ai-generative.jpg')" }}>
      
      {/* Overlay mejorado con gradiente */}
      <div className="absolute inset-0 backdrop-blur-[2px]"></div>

      <AnimatedContainer>
        <div className="max-w-lg w-full bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden relative z-10 border border-white/20">
          
          {/* Header con logo mejorado */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-white rounded-full p-3 shadow-lg">
                <img src="/assets/logo.png" alt="Boxware Logo" className="w-full h-full object-contain" />
              </div>
            </div>
            <div className="text-center text-white">
              <h1 className="text-2xl font-bold">Crear Cuenta</h1>
              <p className="text-blue-100 text-sm mt-1">
                Únete a nuestra plataforma de gestión
              </p>
            </div>
          </div>

          {/* Formulario */}
          <div className="px-8 py-6">
            {error && (
              <div className="mb-6 p-4 text-center text-red-700 text-sm font-medium bg-red-50 rounded-lg border-l-4 border-red-400 shadow-sm">
                <div className="flex items-center justify-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formFields.map((field, idx) => (
                  <div key={field.name} className={idx >= 6 ? 'md:col-span-2' : ''}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {field.label}
                      {field.name === 'password' && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <div className="relative">
                      <input
                        type={field.type}
                        name={field.name}
                        placeholder={field.placeholder}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white placeholder-gray-400"
                        value={(formData as any)[field.name]}
                        onChange={handleChange}
                        ref={inputRefs[idx]}
                        onKeyDown={e => handleKeyDown(e, idx)}
                      />
                      
                      {/* Ícono del ojo para la contraseña */}
                      {field.name === 'password' && (
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                          onClick={togglePasswordVisibility}
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
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Botón de registro mejorado */}
              <Botton
                className="w-full py-3 px-6 font-semibold flex items-center justify-center"
                onClick={handleRegister}
                disabled={isLoading} >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Registrando...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Crear Cuenta
                  </>
                )}
              </Botton>
            </div>

            {/* Footer mejorado */}
            <div className="text-center mt-2 pt-2 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                ¿Ya tienes una cuenta?{' '}
                <button
                  className="font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200 hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/iniciosesion');
                  }}
                >
                  Inicia sesión aquí
                </button>
              </p>
            </div>
          </div>
        </div>
      </AnimatedContainer>
    </div>
  );
};

export default Registrarse;