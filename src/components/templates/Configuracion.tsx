import { useState, useEffect } from "react";
import { useGetUsuariosVer, usePutUsuario } from "@/hooks/usuario";
import { useGetAuth } from "@/hooks/auth";
import { useCambiarContrasena } from "@/hooks/auth";
import { useGetRoles } from "@/hooks/roles";
import { useTheme } from "@/context/ThemeContext";
import {
  AnimatedContainer,
  Botton,
  showSuccessToast,
  showErrorToast,
  Input
} from "@/components/atomos";
import { ImageSelector } from "@/components/moleculas";
import { Form, FormField } from "@/components/organismos";
import { usuarioEditSchema } from "@/schemas";
import { ChangePasswordData } from "@/types/auth";

const Configuraciones = () => {
  const { darkMode } = useTheme();
  const { user } = useGetAuth();
  const idUsuario = user && "id" in user ? (user as any).id : undefined;
  const { usuario: usuarioActual, loading } = idUsuario
    ? useGetUsuariosVer(idUsuario)
    : { usuario: null, loading: true };

  const { actualizarUsuario } = usePutUsuario();
  const { roles } = useGetRoles();
  const { cambiarContrasena } = useCambiarContrasena();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<"perfil" | "seguridad">("perfil");
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordFormValues, setPasswordFormValues] = useState({
    contrasena_actual: "",
    contrasena_nueva: "",
    confirmar_contrasena: ""
  });

  useEffect(() => {
    if (usuarioActual) {
      setFormData({
        nombre: usuarioActual.nombre || "",
        apellido: usuarioActual.apellido || "",
        edad: usuarioActual.edad ? usuarioActual.edad.toString() : "",
        cedula: usuarioActual.cedula || "",
        email: usuarioActual.email || "",
        telefono: usuarioActual.telefono || "",
        imagen: usuarioActual.imagen || "",
      });
    }
  }, [usuarioActual]);

  const renderRol = (rol_id: number) => {
    const rol = roles.find((r) => r.id_rol === rol_id);
    return rol ? rol.nombre_rol : "Sin rol asignado";
  };

  const formFieldsPerfil: FormField[] = [
    { key: "nombre", label: "Nombre", type: "text", required: true },
    { key: "apellido", label: "Apellido", type: "text", required: true },
    { key: "edad", label: "Edad", type: "number", required: true },
    { key: "cedula", label: "Cédula", type: "text", required: true },
    { key: "email", label: "Email", type: "email", required: true },
    { key: "telefono", label: "Teléfono", type: "text", required: true },
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
        fecha_modificacion: new Date().toISOString().split("T")[0],
      };

      await actualizarUsuario(usuarioActual.id_usuario, userData);
      showSuccessToast("Perfil actualizado correctamente");
    } catch (error) {
      showErrorToast("Error al actualizar el perfil");
    }
  };

  const handleSubmitSeguridad = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuarioActual) return;

    try {
      const passwordData: ChangePasswordData = {
        contrasenaActual: passwordFormValues.contrasena_actual,
        nuevaContrasena: passwordFormValues.contrasena_nueva,
        confirmarContrasena: passwordFormValues.confirmar_contrasena,
      };
      
      const result = await cambiarContrasena(passwordData);
      
      if (result) {
        showSuccessToast("Contraseña actualizada correctamente");
        setIsEditingPassword(false);
        setPasswordFormValues({
          contrasena_actual: "",
          contrasena_nueva: "",
          confirmar_contrasena: ""
        });
      }
    } catch (error: any) {
      showErrorToast(error.message || "Error al actualizar la contraseña");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const TabButton = ({
    label,
    isActive,
    onClick,
  }: {
    tab: string;
    label: string;
    isActive: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`px-6 py-3 font-medium text-sm rounded-lg transition-all duration-200 ${
        isActive
          ? "bg-blue-600 text-white shadow-lg transform scale-105"
          : "bg-white text-gray-600 hover:bg-gray-50 hover:text-blue-600 shadow-sm"
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
        <p className="text-gray-500">
          No se pudo cargar la información del usuario
        </p>
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
                  src={
                    usuarioActual.imagen.startsWith("http")
                      ? usuarioActual.imagen
                      : `https://${usuarioActual.imagen}`
                  }
                  alt={`${usuarioActual.nombre} ${usuarioActual.apellido}`}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-white bg-opacity-20 flex items-center justify-center border-4 border-white shadow-lg">
                  <span className="text-2xl font-bold">
                    {usuarioActual.nombre.charAt(0)}
                    {usuarioActual.apellido.charAt(0)}
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
                  Miembro desde{" "}
                  {new Date(usuarioActual.fecha_registro).toLocaleDateString()}
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
            isActive={activeTab === "perfil"}
            onClick={() => setActiveTab("perfil")}
          />
          <TabButton
            tab="seguridad"
            label="Seguridad"
            isActive={activeTab === "seguridad"}
            onClick={() => setActiveTab("seguridad")}
          />
        </div>
      </AnimatedContainer>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {activeTab === "perfil" && (
            <AnimatedContainer animation="slideUp" delay={200} duration={500}>
              <div className={`${darkMode ? 'bg-slate-800 text-white' : 'bg-white text-gray-800'} rounded-2xl shadow-lg p-8 transition-colors duration-300`}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Información Personal
                  </h2>
                  <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                </div>

                {/* Image Selector */}
                <div className="mb-8">
                  <ImageSelector
                    label="Foto de Perfil"
                    value={formData.imagen || ""}
                    onChange={(imagePath) => {
                      setFormData((prev) => ({
                        ...prev,
                        imagen: imagePath as string,
                      }));
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

          {activeTab === "seguridad" && (
            <AnimatedContainer animation="slideUp" delay={200} duration={500}>
              <div className={`${darkMode ? 'bg-slate-800 text-white' : 'bg-white text-gray-800'} rounded-2xl shadow-lg p-8 transition-colors duration-300`}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Seguridad
                  </h2>
                  <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                </div>

                {!isEditingPassword ? (
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-800 mb-2">
                            Contraseña
                          </h3>
                          <p className="text-gray-600 text-sm">
                            Tu contraseña fue actualizada por última vez hace 30
                            días
                          </p>
                        </div>
                        <Botton onClick={() => setIsEditingPassword(true)}>
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
                          <h4 className="font-semibold text-yellow-800">
                            Recomendaciones de Seguridad
                          </h4>
                          <p className="text-yellow-700 text-sm">
                            Usa una contraseña fuerte con al menos 8 caracteres,
                            incluyendo mayúsculas, minúsculas y números.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Cambiar Contraseña</h3>
                      <Botton
                        onClick={() => setIsEditingPassword(false)}
                        color="default"
                        variant="solid"
                      >
                        ← Cancelar
                      </Botton>
                    </div>
                    <form onSubmit={handleSubmitSeguridad} className="space-y-4">
                      {/* Contraseña Actual */}
                      <Input
                        label="Contraseña Actual"
                        type={showCurrentPassword ? "text" : "password"}
                        name="contrasena_actual"
                        value={passwordFormValues.contrasena_actual}
                        onChange={handlePasswordChange}
                        isRequired
                        rightContent={
                          <button
                            type="button"
                            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                            onClick={(e) => {
                              e.preventDefault();
                              setShowCurrentPassword(!showCurrentPassword);
                            }}
                            tabIndex={-1}
                          >
                            {showCurrentPassword ? (
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
                        }
                      />

                      {/* Nueva Contraseña */}
                      <Input
                        label="Nueva Contraseña"
                        type={showNewPassword ? "text" : "password"}
                        name="contrasena_nueva"
                        value={passwordFormValues.contrasena_nueva}
                        onChange={handlePasswordChange}
                        isRequired
                        rightContent={
                          <button
                            type="button"
                            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                            onClick={(e) => {
                              e.preventDefault();
                              setShowNewPassword(!showNewPassword);
                            }}
                            tabIndex={-1}
                          >
                            {showNewPassword ? (
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
                        }
                      />

                      {/* Confirmar Nueva Contraseña */}
                      <Input
                        label="Confirmar Nueva Contraseña"
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmar_contrasena"
                        value={passwordFormValues.confirmar_contrasena}
                        onChange={handlePasswordChange}
                        isRequired
                        rightContent={
                          <button
                            type="button"
                            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                            onClick={(e) => {
                              e.preventDefault();
                              setShowConfirmPassword(!showConfirmPassword);
                            }}
                            tabIndex={-1}
                          >
                            {showConfirmPassword ? (
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
                        }
                      />

                      <div className="flex justify-end">
                        <Botton
                          color="primary"
                          variant="solid"
                          texto="Actualizar Contraseña"
                        />
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </AnimatedContainer>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <AnimatedContainer>
            <div className={`${darkMode ? 'bg-slate-800 text-white' : 'bg-white text-gray-800'} rounded-2xl shadow-lg p-8 transition-colors duration-300`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Perfil
                </h2>
                <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">ID de Usuario:</span>
                  <span className="font-medium">
                    #{usuarioActual.id_usuario}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cédula:</span>
                  <span className="font-medium">{usuarioActual.cedula}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estado:</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      usuarioActual.estado
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {usuarioActual.estado ? "Activo" : "Inactivo"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rol:</span>
                  <span className="font-medium">
                    {Array.isArray(usuarioActual.rol_id)
                      ? usuarioActual.rol_id.map((rol, idx) => (
                          <span key={rol}>
                            {renderRol(rol)}
                            {idx < usuarioActual.rol_id.length - 1 ? ", " : ""}
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
