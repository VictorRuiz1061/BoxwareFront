import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Boton from '../atomos/Boton';
import Sidebar from '../organismos/Sidebar';
import Header from "../organismos/Header";
import GlobalTable, { Column } from "../organismos/Table";
import Form, { FormField } from "../organismos/Form";

type Rol = {
  key: React.Key;
  id_rol: number;
  nombre_rol: string;
  descripcion: string;
  estado: boolean;
  fecha_creacion: string;
};

const Roles = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState<Rol[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Rol>>({});

  const columns: Column<Rol>[] = [
    { key: "id_rol", label: "ID" },
    { key: "nombre_rol", label: "Nombre del Rol" },
    { key: "descripcion", label: "Descripción" },
    { 
      key: "estado", 
      label: "Estado",
      render: (rol) => (
        <span className={rol.estado ? "text-green-600" : "text-red-600"}>
          {rol.estado ? "Activo" : "Inactivo"}
        </span>
      )
    },
    { key: "fecha_creacion", label: "Fecha de Creación" },
    {
      key: "acciones",
      label: "Acciones",
      render: (rol) => (
        <div className="flex gap-2">
          <Boton
            onClick={() => handleEdit(rol)}
            className="bg-yellow-500 text-white px-2 py-1"
          >
            Editar
          </Boton>
          <Boton
            onClick={() => handleDelete(rol.id_rol)}
            className="bg-red-500 text-white px-2 py-1"
          >
            Eliminar
          </Boton>
        </div>
      ),
    },
  ];

  const formFields: FormField[] = [
    { key: "nombre_rol", label: "Nombre del Rol", type: "text", required: true },
    { key: "descripcion", label: "Descripción", type: "text", required: true },
    { key: "fecha_creacion", label: "Fecha de Creación", type: "date", required: true },
  ];

  // Fetch inicial de roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch("http://localhost:3002/roles");
        if (!response.ok) {
          throw new Error("Error al obtener los roles");
        }
        const data = await response.json();
        const rolesWithKeys = data.map((rol: Rol) => ({
          ...rol,
          key: rol.id_rol || `temp-${Math.random()}`, // Genera una clave temporal si no existe
        }));
        setRoles(rolesWithKeys);
      } catch (error) {
        console.error("Error al cargar los roles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  // Crear o actualizar rol
  const handleSubmit = async (values: Record<string, string>) => {
    try {
      console.log("Form values:", values); // Para depuración
      
      // Asegurarse de que todos los campos requeridos estén presentes
      const dataToSubmit = {
        nombre_rol: values.nombre_rol,
        descripcion: values.descripcion,
        estado: true, // Siempre establecer el estado como true (activo)
        fecha_creacion: values.fecha_creacion
      };
      
      console.log("Data to submit:", dataToSubmit); // Para depuración
      
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `http://localhost:3002/roles/actualizar/${editingId}`
        : "http://localhost:3002/roles/crear";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSubmit),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        throw new Error(`Error al guardar el rol: ${errorData.message || response.statusText}`);
      }

      const responseData = await response.json();
      console.log("Success response:", responseData);
      
      const message = editingId ? "actualizado" : "creado";
      alert(`Rol ${message} con éxito`);

      // Refrescar la lista
      const updatedRoles = await fetch(
        "http://localhost:3002/roles"
      ).then((res) => res.json());
      
      const rolesWithKeys = updatedRoles.map((rol: Rol) => ({
        ...rol,
        key: rol.id_rol || `temp-${Math.random()}`,
      }));
      
      setRoles(rolesWithKeys);

      // Cerrar modal y limpiar estado
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      console.error("Error al guardar el rol:", error);
      alert(`Error al guardar el rol: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  };

  // Eliminar rol
  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este rol?"))
      return;

    try {
      const response = await fetch(
        `http://localhost:3002/roles/eliminar/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar el rol");
      }

      alert("Rol eliminado con éxito");

      // Refrescar la lista
      setRoles(roles.filter((rol) => rol.id_rol !== id));
    } catch (error) {
      console.error("Error al eliminar el rol:", error);
    }
  };

  // Abrir modal para crear nuevo rol
  const handleCreate = () => {
    // Inicializar con la fecha actual para fecha_creacion
    const today = new Date().toISOString().split('T')[0];
    setFormData({ fecha_creacion: today });
    setEditingId(null);
    setIsModalOpen(true);
  };

  // Abrir modal para editar rol existente
  const handleEdit = (rol: Rol) => {
    // Omitir la propiedad 'key' para evitar problemas de tipo
    const { key, ...rolWithoutKey } = rol;
    setFormData(rolWithoutKey);
    setEditingId(rol.id_rol);
    setIsModalOpen(true);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          <h1 className="text-xl font-bold mb-4">Gestión de Roles</h1>

          <Boton
            onClick={handleCreate}
            className="bg-blue-500 text-white px-4 py-2 mb-4"
          >
            Crear Nuevo Rol
          </Boton>

          {/* Tabla de roles */}
          {loading ? (
            <p>Cargando roles...</p>
          ) : (
            <GlobalTable columns={columns} data={roles} rowsPerPage={6} />
          )}

          {/* Modal para crear/editar */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <h2 className="text-lg font-bold mb-4 text-center">
                  {editingId ? "Editar Rol" : "Crear Nuevo Rol"}
                </h2>
                <Form
                  fields={formFields}
                  initialValues={{
                    nombre_rol: formData.nombre_rol || '',
                    descripcion: formData.descripcion || '',
                    fecha_creacion: formData.fecha_creacion || ''
                  }}
                  onSubmit={handleSubmit}
                  buttonText={editingId ? "Actualizar" : "Crear"}
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

export default Roles;
