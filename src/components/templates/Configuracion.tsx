import { useState, useEffect } from "react";
import { useGetUsuariosVer, usePutUsuario } from "@/hooks/usuario";
import { useGetAuth } from "@/hooks/auth/useGetAuth";
import { useGetRoles } from "@/hooks/roles";
import { AnimatedContainer, Botton, showSuccessToast, showErrorToast } from "@/components/atomos";
import { ImageSelector } from "@/components/moleculas";
import { Form, FormField } from "@/components/organismos";
import { usuarioEditSchema } from "@/schemas";

const Configuraciones = () => {
  const { user } = useGetAuth();
  // Corregido: 'id' puede no existir en 'user', así que verificamos su existencia
  const idUsuario = (user && "id" in user) ? (user as any).id : undefined;
  const { usuario: usuarioActual, loading } = idUsuario ? useGetUsuariosVer(idUsuario) : { usuario: null, loading: true };

  const { actualizarUsuario } = usePutUsuario();
  const { roles } = useGetRoles();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'perfil' | 'seguridad' | 'preferencias'>('perfil');
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [] = useState();

  useEffect(() => {
    if (usuarioActual) {
      setFormData({
        nombre: usuarioActual.nombre || '',
        apellido: usuarioActual.apellido || '',
        edad: usuarioActual.edad ? usuarioActual.edad.toString() : '',
        cedula: usuarioActual.cedula || '',
        email: usuarioActual.email || '',
        telefono: usuarioActual.telefono || '',
        imagen: usuarioActual.imagen || '',
      });
    }
  }, [usuarioActual]);

  const renderRol = (rol_id: number) => {
    const rol = roles.find(r => r.id_rol === rol_id);
    return rol ? rol.nombre_rol : 'Sin rol asignado';
  };

  const formFieldsPerfil: FormField[] = [
    { key: "nombre", label: "Nombre", type: "text", required: true },
    { key: "apellido", label: "Apellido", type: "text", required: true },
    { key: "edad", label: "Edad", type: "number", required: true },
    { key: "cedula", label: "Cédula", type: "text", required: true },
    { key: "email", label: "Email", type: "email", required: true },
    { key: "telefono", label: "Teléfono", type: "text", required: true },
  ];

  const formFieldsSeguridad: FormField[] = [
    { key: "contrasena_actual", label: "Contraseña Actual", type: "password", required: true },
    { key: "contrasena_nueva", label: "Nueva Contraseña", type: "password", required: true },
    { key: "confirmar_contrasena", label: "Confirmar Nueva Contraseña", type: "password", required: true },
  ];

  const handleSubmitPerfil = async (values: Record<string, string>) => {
    if (!usuarioActual) return;
    
    try {
      const userData = {
        nombre: values.nombre,
        apellido: values.apellido,
        edad: parseInt(values.edad),
        cedula: values.cedula,
        email: values.email,
        telefono: values.telefono,
        imagen: formData.imagen === null ? undefined : formData.imagen,
        fecha_modificacion: new Date().toISOString().split('T')[0]
      };

      await actualizarUsuario(usuarioActual.id_usuario, userData);
      showSuccessToast("Perfil actualizado correctamente");
    } catch (error) {
      showErrorToast('Error al actualizar el perfil');
    }
  };

  const handleSubmitSeguridad = async (values: Record<string, string>) => {
    if (!usuarioActual) return;
    
    if (values.contrasena_nueva !== values.confirmar_contrasena) {
      showErrorToast("Las contraseñas no coinciden");
      return;
    }

    try {
      const updateData = {
        contrasena_actual: values.contrasena_actual,
        contrasena: values.contrasena_nueva,
        fecha_modificacion: new Date().toISOString().split('T')[0]
      };

      await actualizarUsuario(usuarioActual.id_usuario, updateData);
      showSuccessToast("Contraseña actualizada correctamente");
      setIsEditingPassword(false);
    } catch (error) {
      showErrorToast('Error al actualizar la contraseña');
    }
  };

  const TabButton = ({ label, isActive, onClick }: {
    tab: string;
    label: string;
    isActive: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`px-6 py-3 font-medium text-sm rounded-lg transition-all duration-200 ${
        isActive
          ? 'bg-blue-600 text-white shadow-lg transform scale-105'
          : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-blue-600 shadow-sm'
      }`}
    >
      {label}
    </button>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!usuarioActual) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-gray-500">No se pudo cargar la información del usuario</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <AnimatedContainer animation="fadeIn" duration={400}>
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="flex items-center space-x-6">
            <div className="relative">
              {usuarioActual.imagen ? (
                <img
                  src={usuarioActual.imagen.startsWith('http') ? usuarioActual.imagen : `https://${usuarioActual.imagen}`}
                  alt={`${usuarioActual.nombre} ${usuarioActual.apellido}`}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-white bg-opacity-20 flex items-center justify-center border-4 border-white shadow-lg">
                  <span className="text-2xl font-bold">
                    {usuarioActual.nombre.charAt(0)}{usuarioActual.apellido.charAt(0)}
                  </span>
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {usuarioActual.nombre} {usuarioActual.apellido}
              </h1>
              <div className="flex items-center space-x-4 text-blue-100">
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                  {renderRol(
                    Array.isArray(usuarioActual.rol_id)
                      ? usuarioActual.rol_id[0]
                      : usuarioActual.rol_id
                  )}
                </span>
                <span className="text-sm">
                  Miembro desde {new Date(usuarioActual.fecha_registro).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </AnimatedContainer>

      {/* Navigation Tabs */}
      <AnimatedContainer animation="slideUp" delay={100} duration={400}>
        <div className="flex space-x-2 bg-gray-100 p-2 rounded-xl">
          <TabButton
            tab="perfil"
            label="Mi Perfil"
            isActive={activeTab === 'perfil'}
            onClick={() => setActiveTab('perfil')}
          />
          <TabButton
            tab="seguridad"
            label="Seguridad"
            isActive={activeTab === 'seguridad'}
            onClick={() => setActiveTab('seguridad')}
          />
          <TabButton
            tab="preferencias"
            label="Preferencias"
            isActive={activeTab === 'preferencias'}
            onClick={() => setActiveTab('preferencias')}
          />
        </div>
      </AnimatedContainer>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {activeTab === 'perfil' && (
            <AnimatedContainer animation="slideUp" delay={200} duration={500}>
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Información Personal</h2>
                  <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                </div>

                {/* Image Selector */}
                <div className="mb-8">
                  <ImageSelector
                    label="Foto de Perfil"
                    value={formData.imagen || ''}
                    onChange={(imagePath: string) => {
                      setFormData(prev => ({ ...prev, imagen: imagePath }));
                    }}
                  />
                </div>

                <Form
                  fields={formFieldsPerfil}
                  onSubmit={handleSubmitPerfil}
                  buttonText="Actualizar Perfil"
                  initialValues={formData}
                  schema={usuarioEditSchema}
                />
              </div>
            </AnimatedContainer>
          )}

          {activeTab === 'seguridad' && (
            <AnimatedContainer animation="slideUp" delay={200} duration={500}>
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Seguridad de la Cuenta</h2>
                  <div className="h-1 w-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full"></div>
                </div>

                {!isEditingPassword ? (
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-800 mb-2">Contraseña</h3>
                          <p className="text-gray-600 text-sm">
                            Tu contraseña fue actualizada por última vez hace 30 días
                          </p>
                        </div>
                        <Botton
                          onClick={() => setIsEditingPassword(true)}
                        >
                          Cambiar Contraseña
                        </Botton>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-bold">!</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-yellow-800">Recomendaciones de Seguridad</h4>
                          <p className="text-yellow-700 text-sm">
                            Usa una contraseña fuerte con al menos 8 caracteres, incluyendo mayúsculas, minúsculas y números.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="mb-4">
                      <Botton
                        onClick={() => setIsEditingPassword(false)}
                        color="default"
                        variant="solid"
                      >
                        ← Cancelar
                      </Botton>
                    </div>
                    <Form
                      fields={formFieldsSeguridad}
                      onSubmit={handleSubmitSeguridad}
                      buttonText="Actualizar Contraseña"
                      initialValues={{}}
                      schema={usuarioEditSchema}
                    />
                  </div>
                )}
              </div>
            </AnimatedContainer>
          )}

          {activeTab === 'preferencias' && (
            <AnimatedContainer animation="slideUp" delay={200} duration={500}>
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Preferencias del Sistema</h2>
                  <div className="h-1 w-20 bg-gradient-to-r from-green-500 to-teal-500 rounded-full"></div>
                </div>

                <div className="space-y-6">
                  {/* Notificaciones */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Notificaciones</h3>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between">
                        <span className="text-gray-700">Notificaciones por email</span>
                        <input type="checkbox" className="toggle" defaultChecked />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-gray-700">Notificaciones del sistema</span>
                        <input type="checkbox" className="toggle" defaultChecked />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-gray-700">Alertas de seguridad</span>
                        <input type="checkbox" className="toggle" defaultChecked />
                      </label>
                    </div>
                  </div>

                  {/* Tema */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Apariencia</h3>
                    <div className="flex space-x-4">
                      <button className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-4 py-3 hover:bg-gray-50">
                        <div className="w-4 h-4 bg-white border border-gray-300 rounded-full"></div>
                        <span>Claro</span>
                      </button>
                      <button className="flex items-center space-x-2 bg-gray-800 text-white rounded-lg px-4 py-3 hover:bg-gray-700">
                        <div className="w-4 h-4 bg-gray-800 rounded-full"></div>
                        <span>Oscuro</span>
                      </button>
                    </div>
                  </div>

                  {/* Idioma */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Idioma</h3>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="es">Español</option>
                      <option value="en">English</option>
                      <option value="fr">Français</option>
                    </select>
                  </div>
                </div>
              </div>
            </AnimatedContainer>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <AnimatedContainer animation="slideUp" delay={300} duration={500}>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-gray-800 mb-4">Información de la Cuenta</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">ID de Usuario:</span>
                  <span className="font-medium">#{usuarioActual.id_usuario}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cédula:</span>
                  <span className="font-medium">{usuarioActual.cedula}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estado:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    usuarioActual.estado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {usuarioActual.estado ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rol:</span>
                  <span className="font-medium">
                    {Array.isArray(usuarioActual.rol_id)
                      ? usuarioActual.rol_id.map((rol, idx) => (
                          <span key={rol}>
                            {renderRol(rol)}
                            {idx < usuarioActual.rol_id.length - 1 ? ', ' : ''}
                          </span>
                        ))
                      : renderRol(usuarioActual.rol_id)}
                  </span>
                </div>
              </div>
            </div>
          </AnimatedContainer>

        </div>
      </div>
    </div>
  );
};

export default Configuraciones;