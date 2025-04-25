import { useState } from "react";
import { useUsuarios } from '../../hooks/useUsuarios';
import { Usuario } from '../../types/usuario';
import Sidebar from "../organismos/Sidebar";
import Header from "../organismos/Header";
import GlobalTable, { Column } from "../organismos/Table";
import Form, { FormField } from "../organismos/Form";
import Boton from "../atomos/Boton";
import AnimatedContainer from "../atomos/AnimatedContainer";
import { useNavigate } from "react-router-dom";
const Usuarios = () => {
  const navigate = useNavigate();
  const { usuarios, loading, crearUsuario, actualizarUsuario, eliminarUsuario } = useUsuarios();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Usuario>>({});

  const columns: Column<Usuario>[] = [
    { key: "nombre", label: "Nombre" },
    { key: "apellido", label: "Apellido" },
    { key: "email", label: "Email" },
    { key: "telefono", label: "Teléfono" },
    { key: "rol_id", label: "Rol" },
    {
      key: "acciones",
      label: "Acciones",
      render: (usuario) => (
        <div className="flex gap-2">
          <Boton
            onClick={() => handleEdit(usuario)}
            className="bg-yellow-500 text-white px-2 py-1"
          >
            Editar
          </Boton>
          <Boton
            onClick={() => handleDelete(usuario.id_usuario)}
            className="bg-red-500 text-white px-2 py-1"
          >
            Eliminar
          </Boton>
          <Boton
            onClick={() => handleViewDetails(usuario.id_usuario)}
            className="bg-blue-500 text-white px-2 py-1"
          >
            Detalles
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
    { key: "contrasena", label: "Contraseña", type: "password", required: true },
    { key: "telefono", label: "Teléfono", type: "text", required: true },
    { key: "rol_id", label: "Rol ID", type: "number", required: true },
  ];


  // Crear o actualizar usuario
  const handleSubmit = async (values: Record<string, string | number | boolean>) => {
    try {
      const payload = {
        ...values,
        fecha_registro: new Date().toISOString(),
        esta_activo: true,
      };
      if (editingId) {
        await actualizarUsuario(editingId, payload);
        alert('Usuario actualizado con éxito');
      } else {
        await crearUsuario(payload as Omit<Usuario, 'id_usuario'>);
        alert('Usuario creado con éxito');
      }
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      console.error('Error al guardar el usuario:', error);
    }
  };

  // Eliminar usuario
  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) return;
    try {
      await eliminarUsuario(id);
      alert("Usuario eliminado con éxito");
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
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
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          <AnimatedContainer animation="fadeIn" duration={400} className="w-full">
            <h1 className="text-xl font-bold mb-4">Gestión de Usuarios</h1>
          </AnimatedContainer>

          <AnimatedContainer animation="slideUp" delay={100} duration={400}>
            <Boton
              onClick={handleCreate}
              className="bg-blue-600 text-white px-4 py-2 mb-4 hover:bg-blue-700"
            >
              Crear Nuevo Usuario
            </Boton>
            <Boton
              onClick={() => navigate('/detalle-usuario')}
              className="bg-green-500 text-white px-4 py-2"
            >
              Generar Informe de Usuario
            </Boton>
          </AnimatedContainer>

          {/* Tabla de usuarios */}
          <AnimatedContainer animation="slideUp" delay={200} duration={500} className="w-full">
            {loading ? (
              <p>Cargando usuarios...</p>
            ) : (
              <GlobalTable
                columns={columns}
                data={usuarios.map((usuario) => ({ ...usuario, key: usuario.id_usuario }))}
                rowsPerPage={6}
              />
            )}
          </AnimatedContainer>

          {/* Modal para crear/editar */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <AnimatedContainer animation="scaleIn" duration={300} className="w-full max-w-lg">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-h-[90vh] overflow-y-auto">
                  <h2 className="text-lg font-bold mb-4 text-center">
                    {editingId ? "Editar Usuario" : "Crear Nuevo Usuario"}
                  </h2>
                  <Form
                   fields={formFields}
                   onSubmit={handleSubmit}
                   buttonText={editingId ? "Actualizar" : "Crear"}
                   initialValues={{
                     ...formData,
                     esta_activo: formData.esta_activo ? "true" : "false",
                     ultima_sesion: formData.ultima_sesion as string
                       ? new Date(formData.ultima_sesion as string).toISOString() 
                       : undefined,
                   }}
                 />
                  <div className="flex justify-end mt-4">
                    <Boton
                      onClick={() => setIsModalOpen(false)}
                      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                      Cerrar
                    </Boton>
                  </div>
                </div>
              </AnimatedContainer>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Usuarios;