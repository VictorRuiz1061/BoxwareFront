import { useState } from "react";
import { Alert } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";
import { usuarioSchema } from "@/schemas/usuario.schema";
import { useGetUsuarios } from "@/hooks/usuario/useGetUsuarios";
import { usePostUsuario } from "@/hooks/usuario/usePostUsuario";
import { usePutUsuario } from "@/hooks/usuario/usePutUsuario";
import { useGetRoles } from "@/hooks/roles/useGetRoles";
import { Usuario } from "@/types/usuario";
import AnimatedContainer from "@/components/atomos/AnimatedContainer";
import AlertDialog from "@/components/atomos/AlertDialog";
import Boton from "@/components/atomos/Boton";
import GlobalTable, { Column } from "@/components/organismos/Table";
import Form, { FormField } from "@/components/organismos/Form";
import Toggle from "@/components/atomos/Toggle";

const Usuarios = () => {
  const navigate = useNavigate();
  const { usuarios, loading } = useGetUsuarios();
  const { crearUsuario } = usePostUsuario();
  const { actualizarUsuario } = usePutUsuario();
  const { roles } = useGetRoles();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Usuario>>({});
  const [alert, setAlert] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => setAlert((a) => ({ ...a, isOpen: false })),
  });
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successAlertText, setSuccessAlertText] = useState("");

  const renderRol = (rol_id: number) => {
    const rol = roles.find(r => r.id_rol === rol_id);
    return rol ? rol.nombre_rol : rol_id;
  };
  const renderAcciones = (usuario: Usuario) => (
    <div className="flex gap-2">
      <Boton
        onPress={() => openModal(usuario)}
        className="bg-yellow-500 text-white px-2 py-1 flex items-center justify-center"
        aria-label="Editar"
      >
        <Pencil size={18} />
      </Boton>
    </div>
  );

  // Columnas centralizadas y limpias
  const columns: Column<Usuario>[] = [
    { key: "nombre", label: "Nombre", filterable: true },
    { key: "apellido", label: "Apellido", filterable: true },
    { key: "edad", label: "Edad", filterable: true },
    { key: "cedula", label: "Cédula", filterable: true },
    { key: "email", label: "Email", filterable: true },
    { key: "telefono", label: "Teléfono", filterable: true },
    {
      key: "rol_id",
      label: "Rol",
      filterable: true,
      render: usuario => renderRol(usuario.rol_id)
    },
    {
      key: "estado",
      label: "Estado",
      filterable: true,
      render: usuario => (
        <Toggle isOn={usuario.estado} onToggle={() => handleToggleEstado(usuario)} />
      )
    },
    {
      key: "acciones",
      label: "Acciones",
      render: usuario => renderAcciones(usuario)
    }
  ];

  // Campos de formulario centralizados
  const formFields: FormField[] = [
    { key: "nombre", label: "Nombre", type: "text", required: true },
    { key: "apellido", label: "Apellido", type: "text", required: true },
    { key: "edad", label: "Edad", type: "number", required: true },
    { key: "cedula", label: "Cédula", type: "text", required: true },
    { key: "email", label: "Email", type: "email", required: true },
    { key: "contrasena", label: "Contraseña", type: "password", required: true },
    { key: "telefono", label: "Teléfono", type: "text", required: true },
    {
      key: "rol_id",
      label: "Rol",
      type: "select",
      required: true,
      options: roles.map(r => ({ label: r.nombre_rol, value: r.id_rol }))
    }
  ];

  // Modal genérico para crear/editar usuario
  const openModal = (usuario?: Usuario) => {
    setFormData(usuario || {});
    setEditingId(usuario ? usuario.id_usuario : null);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({});
    setEditingId(null);
  };

  // Crear o actualizar usuario (handler único y limpio)
  // Función auxiliar para mostrar alertas de validación
  const showValidationAlert = (title: string, message: string) => {
    setAlert({
      isOpen: true,
      title,
      message,
      onConfirm: () => setAlert((a) => ({ ...a, isOpen: false })),
    });
  };

  // Función auxiliar para preparar datos de usuario
  const buildUsuarioPayload = (values: Record<string, string | number | boolean>, id?: number): Usuario => ({
    id_usuario: id ?? 0,
    nombre: String(values.nombre),
    apellido: String(values.apellido),
    edad: Number(values.edad),
    cedula: String(values.cedula),
    email: String(values.email),
    contrasena: String(values.contrasena),
    telefono: String(values.telefono),
    estado: values.estado !== undefined ? Boolean(values.estado) : true,
    fecha_registro: typeof values.fecha_registro === 'string' ? values.fecha_registro : (values.fecha_registro ? String(values.fecha_registro) : new Date().toISOString().split('T')[0]),
    rol_id: Number(values.rol_id)
  });

  const handleSubmit = async (values: Record<string, string | number | boolean>) => {
    try {
      // Validación con zod
      const parsed = usuarioSchema.safeParse(values);
      if (!parsed.success) {
        showValidationAlert("Error de validación", parsed.error.errors.map((e) => e.message).join("\n"));
        return;
      }
      // Validación de campos requeridos
      const requiredFields = ["nombre", "apellido", "edad", "cedula", "email", "contrasena", "telefono", "rol_id"];
      const missing = requiredFields.find(
        field => values[field] === undefined || values[field] === null || (typeof values[field] === "string" && values[field] === "")
      );
      if (missing) {
        showValidationAlert("Campo requerido", `El campo '${missing}' es obligatorio.`);
        return;
      }
      // Validar rol
      if (!roles.some(r => r.id_rol === Number(values.rol_id))) {
        showValidationAlert("Rol inválido", "Por favor selecciona un rol válido.");
        return;
      }
      // Crear o actualizar
      if (editingId) {
        await actualizarUsuario(Number(editingId), buildUsuarioPayload(values, Number(editingId)));
        setSuccessAlertText("El usuario fue actualizado correctamente.");
      } else {
        await crearUsuario(buildUsuarioPayload(values));
        setSuccessAlertText("El usuario fue creado correctamente.");
      }
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
      closeModal();
    } catch (error: any) {
      console.error("Error al guardar el usuario:", error);
      setAlert({
        isOpen: true,
        title: "Error",
        message: "Ocurrió un error al guardar el usuario.",
        onConfirm: () => setAlert((a) => ({ ...a, isOpen: false })),
      });
    }
  };

  // Cambiar estado de usuario (más simple)
  const handleToggleEstado = async (usuario: Usuario) => {
    try {
      const nuevoEstado = !usuario.estado;
      await actualizarUsuario(usuario.id_usuario, { ...usuario, estado: nuevoEstado });
      setSuccessAlertText(`El usuario fue ${nuevoEstado ? 'activado' : 'desactivado'} correctamente.`);
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    } catch (error: any) {
      setAlert({
        isOpen: true,
        title: 'Error',
        message: `Error al cambiar el estado del usuario: ${error?.message || 'Error desconocido'}`,
        onConfirm: () => setAlert(a => ({ ...a, isOpen: false })),
      });
    }
  };

  // Abrir modal para crear nuevo usuario
  const handleCreate = () => {
    setFormData({});
    setEditingId(null);
    setIsModalOpen(true);
  };
  
  return (
    <>
      <div className="w-full">
        <AnimatedContainer
            animation="fadeIn"
            duration={400}
            className="w-full"
          >
            <h1 className="text-xl font-bold mb-4">Gestión de Usuarios</h1>
          </AnimatedContainer>

          <AnimatedContainer animation="slideUp" delay={100} duration={400}>
            <Boton
              onPress={handleCreate}
              className="bg-blue-600 text-white px-4 py-2 mb-4 hover:bg-blue-700"
            >
              Crear Nuevo Usuario
            </Boton>
            <Boton
              onPress={() => navigate("/detalle-usuario")}
              className="bg-green-500 text-white px-4 py-2"
            >
              Generar Informe de Usuario
            </Boton>
          </AnimatedContainer>

          {/* Tabla de usuarios */}
          <AnimatedContainer
            animation="slideUp"
            delay={200}
            duration={500}
            className="w-full"
          >
            {loading ? (
              <p>Cargando usuarios...</p>
            ) : (
              <GlobalTable
                columns={columns}
                data={usuarios
                  .map((usuario) => ({
                    ...usuario,
                    key: usuario.id_usuario,
                  }))
                  // Ordenar por estado: activos primero, inactivos después
                  .sort((a, b) => {
                    if (a.estado === b.estado) return 0;
                    return a.estado ? -1 : 1; // -1 pone a los activos primero
                  })
                }
                rowsPerPage={6}
                defaultSortColumn="estado"
                defaultSortDirection="desc"
              />
            )}
          </AnimatedContainer>

          {/* Modal para crear/editar */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <AnimatedContainer
                animation="scaleIn"
                duration={300}
                className="w-full max-w-lg"
              >
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-h-[90vh] overflow-y-auto relative">
                  {/* Botón X para cerrar en la esquina superior derecha */}
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                  >
                    <span className="text-gray-800 font-bold">×</span>
                  </button>
                  <h2 className="text-lg font-bold mb-4 text-center">
                    {editingId ? "Editar Usuario" : "Crear Nuevo Usuario"}
                  </h2>
                  {roles.length === 0 ? (
                    <div className="text-center py-8">Cargando roles...</div>
                  ) : (
                    <Form
                      fields={formFields}
                      onSubmit={handleSubmit}
                      buttonText={editingId ? "Actualizar" : "Crear"}
                      initialValues={{
                        ...formData,
                        rol_id: formData.rol_id ?? "",
                      }}
                      schema={usuarioSchema}
                    />
                  )}
                  <div className="flex justify-end mt-4"></div>
                </div>
              </AnimatedContainer>
            </div>
          )}
      </div>
      {showSuccessAlert && (
        <div className="fixed top-4 right-4 z-50">
          <Alert
            hideIconWrapper
            color="success"
            description={successAlertText}
            title="¡Éxito!"
            variant="solid"
            onClose={() => setShowSuccessAlert(false)}
          />
        </div>
      )}
      <AlertDialog
        isOpen={alert.isOpen}
        title={alert.title}
        message={alert.message}
        onConfirm={alert.onConfirm}
        onCancel={alert.onConfirm}
        confirmText="Aceptar"
        cancelText=""
      />
    </>
  );
};

export default Usuarios;
