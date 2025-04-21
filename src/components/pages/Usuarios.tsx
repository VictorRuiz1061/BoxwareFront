import { useEffect, useState } from "react";
import Sidebar from "../organismos/Sidebar";
import Header from "../organismos/Header";
import GlobalTable, { Column } from "../organismos/Table";
import Form, { FormField } from "../organismos/Form";
import Boton from "../atomos/Boton";

type Usuario = {
  id_usuario: number;
  nombre: string;
  apellido: string;
  edad: number;
  cedula: string;
  email: string;
  contrasena: string;
  telefono: string;
  inicio_sesion: Date;
  esta_activo: boolean;
  fecha_registro: string;
  rol_id: number;
};

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
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

  // Fetch inicial de usuarios
  useEffect(() => {
    const fetchUsuarios = async () => { 
      try {
        const response = await fetch("http://localhost:3002/usuarios");
        if (!response.ok) {
          throw new Error("Error al obtener los usuarios");
        }
        const data = await response.json();
        setUsuarios(data);
      } catch (error) {
        console.error("Error al cargar los usuarios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  // Crear o actualizar usuario
  const handleSubmit = async (values: Record<string, string | number | boolean>) => {
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `http://localhost:3002/usuarios/actualizar/${editingId}`
        : "http://localhost:3002/usuarios/crear";

      // Agregar valores predeterminados para los campos ocultos
      const payload = {
        ...values,
        fecha_registro: new Date().toISOString(), // Fecha actual
        esta_activo: true, // Estado activo por defecto
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Error al guardar el usuario");
      }

      const message = editingId ? "actualizado" : "creado";
      alert(`Usuario ${message} con éxito`);

      // Refrescar la lista
      const updatedUsuarios = await fetch("http://localhost:3002/usuarios").then((res) =>
        res.json()
      );
      setUsuarios(updatedUsuarios);

      // Cerrar modal y limpiar estado
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      console.error("Error al guardar el usuario:", error);
    }
  };

  // Eliminar usuario
  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) return;

    try {
      const response = await fetch(`http://localhost:3002/usuarios/eliminar/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el usuario");
      }

      alert("Usuario eliminado con éxito");

      // Refrescar la lista
      setUsuarios(usuarios.filter((usuario) => usuario.id_usuario !== id));
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

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          <h1 className="text-xl font-bold mb-4">Gestión de Usuarios</h1>

          <Boton
            onClick={handleCreate}
            className="bg-blue-500 text-white px-4 py-2 mb-4"
          >
            Crear Nuevo Usuario
          </Boton>

          {/* Tabla de usuarios */}
          {loading ? (
            <p>Cargando usuarios...</p>
          ) : (
            <GlobalTable
              columns={columns}
              data={usuarios.map((usuario) => ({ ...usuario, key: usuario.id_usuario }))}
              rowsPerPage={6}
            />
          )}

          {/* Modal para crear/editar */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
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
                   inicio_sesion: formData.inicio_sesion
                     ? new Date(formData.inicio_sesion).toISOString()
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
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Usuarios;