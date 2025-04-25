import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import AnimatedContainer from '../atomos/AnimatedContainer';

const Registro = () => {
  const navigate = useNavigate();
  const { error, register } = useAuth();

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    edad: 0,
    cedula: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4 relative"
      style={{ backgroundImage: "url('/assets/interior-large-logistics-warehouse-ai-generative.jpg')" }}
    >
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
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Nombre</label>
                  <input 
                    type="text" 
                    name="nombre"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" 
                    value={formData.nombre}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Apellido</label>
                  <input 
                    type="text" 
                    name="apellido"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" 
                    value={formData.apellido}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Correo electrónico</label>
                  <input 
                    type="email" 
                    name="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" 
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Teléfono</label>
                  <input 
                    type="text" 
                    name="telefono"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" 
                    value={formData.telefono}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Edad</label>
                  <input 
                    type="number" 
                    name="edad"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" 
                    value={formData.edad}
                    onChange={(e) => setFormData({...formData, edad: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Cédula</label>
                  <input 
                    type="text" 
                    name="cedula"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" 
                    value={formData.cedula}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Contraseña</label>
                  <input 
                    type="password" 
                    name="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" 
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Confirmar contraseña</label>
                  <input 
                    type="password" 
                    name="confirmPassword"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" 
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <button 
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 mt-2"
                onClick={() => register(formData)}
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

export default Registro;
