import React, { useState } from "react";
import { Alert } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { Pencil, Eye } from "lucide-react";
import { usuarioSchema } from "@/schemas/usuario.schema";
import { useGetUsuarios } from "@/hooks/usuario/useGetUsuarios";
import { usePostUsuario } from "@/hooks/usuario/usePostUsuario";
import { usePutUsuario } from "@/hooks/usuario/usePutUsuario";
// Eliminamos la importación de useDeleteUsuario ya que no lo usamos más
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
  // Eliminamos el estado deleteConfirm ya que no lo necesitamos más
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successAlertText, setSuccessAlertText] = useState("");

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
      render: (usuario) => {
        const rol = roles.find((r) => r.id_rol === usuario.rol_id);
        return rol ? rol.nombre_rol : usuario.rol_id;
      },
    },
    { 
      key: "estado", 
      label: "Estado", 
      filterable: true,
      render: (usuario) => (
        <Toggle 
          isOn={usuario.estado} 
          onToggle={() => handleToggleEstado(usuario)}
        />
      )
    },
    {
      key: "acciones",
      label: "Acciones",
      render: (usuario) => (
        <div className="flex gap-2">
          <Boton
            onPress={() => handleEdit(usuario)}
            className="bg-yellow-500 text-white px-2 py-1 flex items-center justify-center"
            aria-label="Editar"
          >
            <Pencil size={18} />
          </Boton>
          <Boton
            onPress={() => handleViewDetails(usuario.id_usuario)}
            className="bg-blue-500 text-white px-2 py-1 flex items-center justify-center"
            aria-label="Detalles"
          >
            <Eye size={18} />
          </Boton>
        </div>
      ),
    },
  ];

  const formFields: FormField[] = [
    { key: "nombre", label: "Nombre", type: "text", required: true },
    { key: "apellido", label: "Apellido", type: "text", required: true },
    { key: "edad", label: "Edad", type: "number", required: true },
    { key: "cedula", label: "Cédula", type: "text", required: true },
    { key: "email", label: "Email", type: "email", required: true },
    {
      key: "contrasena",
      label: "Contraseña",
      type: "password",
      required: true,
    },
    { key: "telefono", label: "Teléfono", type: "text", required: true },
    {
      key: "rol_id",
      label: "Rol",
      type: "select",
      required: true,
      options: roles.map((r) => ({ label: r.nombre_rol, value: r.id_rol })),
    },
  ];

  // Crear o actualizar usuario
  const handleSubmit = async (
    values: Record<string, string | number | boolean>
  ) => {
    try {
      // Validar con zod
      const parsed = usuarioSchema.safeParse(values);
      if (!parsed.success) {
        setAlert({
          isOpen: true,
          title: "Error de validación",
          message: parsed.error.errors.map((e) => e.message).join("\n"),
          onConfirm: () => setAlert((a) => ({ ...a, isOpen: false })),
        });
        return;
      }
      // Buscar el rol seleccionado por id_rol
      const rolSeleccionado = roles.find(
        (r) => r.id_rol === Number(values.rol_id)
      );
      const payload = {
        ...values,
        rol_id: rolSeleccionado ? rolSeleccionado.id_rol : undefined,
        fecha_registro: new Date().toISOString(),
        estado: values.estado === "true" ? true : false,
      };
      if (editingId) {
        // Construir objeto Usuario completo para actualización
        const usuarioActualizado: Usuario = {
          id_usuario: editingId,
          nombre: String(values.nombre),
          apellido: String(values.apellido),
          edad: Number(values.edad),
          cedula: String(values.cedula),
          email: String(values.email),
          contrasena: String(values.contrasena),
          telefono: String(values.telefono),
          estado: values.estado === "true" ? true : false,
          fecha_registro: payload.fecha_registro,
          rol_id: Number(payload.rol_id),
        };
        await actualizarUsuario(editingId, usuarioActualizado);
        setSuccessAlertText("El usuario fue actualizado correctamente.");
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
      } else {
        await crearUsuario(payload as Omit<Usuario, "id_usuario">);
        setSuccessAlertText("El usuario fue creado correctamente.");
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
      }
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      console.error("Error al guardar el usuario:", error);
      setAlert({
        isOpen: true,
        title: "Error",
        message: "Ocurrió un error al guardar el usuario.",
        onConfirm: () => setAlert((a) => ({ ...a, isOpen: false })),
      });
    }
  };

  // Cambiar el estado (activo/inactivo) de un usuario
  const handleToggleEstado = async (usuario: Usuario) => {
    try {
      // Preparar los datos para actualizar solo el estado
      const nuevoEstado = !usuario.estado;
      
      // Crear un objeto Usuario completo con los datos mínimos necesarios
      // para la actualización, manteniendo los datos originales del usuario
      const updateData: Usuario = {
        ...usuario,
        estado: nuevoEstado
      };
      
      console.log(`Cambiando estado de usuario ${usuario.id_usuario} a ${nuevoEstado ? 'Activo' : 'Inactivo'}`);
      
      // Actualizar el usuario en el servidor
      await actualizarUsuario(usuario.id_usuario, updateData);
      
      // Mostrar mensaje de éxito
      setSuccessAlertText(`El usuario fue ${nuevoEstado ? 'activado' : 'desactivado'} correctamente.`);
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
      
          // No necesitamos hacer nada más aquí
      // La invalidación de la cache de React Query se maneja automáticamente 
      // en el hook usePutUsuario cuando se completa la mutación
      // Esto hará que la tabla se actualice automáticamente sin recargar la página
    } catch (error) {
      console.error('Error al cambiar el estado:', error);
      setAlert({
        isOpen: true,
        title: 'Error',
        message: `Error al cambiar el estado del usuario: ${error instanceof Error ? error.message : 'Error desconocido'}`,
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

  // Abrir modal para editar usuario existente
  const handleEdit = (usuario: Usuario) => {
    setFormData(usuario);
    setEditingId(usuario.id_usuario);
    setIsModalOpen(true);
  };

  // Ver detalles de usuario
  const handleViewDetails = (id: number) => {
    navigate(`/detalle-usuario/${id}`);
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

export default React.memo(Usuarios);
