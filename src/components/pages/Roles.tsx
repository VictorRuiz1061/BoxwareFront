import { useState } from 'react';
import Boton from '../atomos/Boton';
import Sidebar from '../organismos/Sidebar';
import Header from "../organismos/Header";
import GlobalTable, { Column } from "../organismos/Table";
import Form, { FormField } from "../organismos/Form";
import { useRoles } from '../../hooks/useRoles';
import { Rol } from '../../types/rol';
import AnimatedContainer from "../atomos/AnimatedContainer";

const Roles = () => {
  const { roles, loading, crearRol, actualizarRol, eliminarRol } = useRoles();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Rol>>({});

  const columns: Column<Rol>[] = [
    { key: "nombre_rol", label: "Nombre del Rol", filterable: true },
    { key: "descripcion", label: "Descripción", filterable: true },
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
            onPress={() => handleEdit(rol)}
            className="bg-blue-600 text-white px-2 py-1 hover:bg-blue-700"
          >
            Editar
          </Boton>
          <Boton
            onPress={() => handleDelete(rol.id_rol)}
            className="bg-red-500 text-white px-2 py-1 hover:bg-red-600"
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
    { key: "estado", label: "Estado", type: "select", required: true, options: ["Activo", "Inactivo"] },
    { key: "fecha_creacion", label: "Fecha de Creación", type: "date", required: true },
  ];

  // Crear o actualizar rol
  const handleSubmit = async (values: Record<string, string>) => {
    try {
      // Convertir estado a booleano
      let estadoBool = true;
      if (values.estado === "Inactivo" || values.estado === "false") {
        estadoBool = false;
      }
      // Asegurarse de que todos los campos requeridos estén presentes
      const dataToSubmit = {
        nombre_rol: values.nombre_rol,
        descripcion: values.descripcion,
        estado: estadoBool,
        fecha_creacion: values.fecha_creacion
      };
      
      if (editingId) {
        await actualizarRol(editingId, dataToSubmit);
        alert("Rol actualizado con éxito");
      } else {
        await crearRol(dataToSubmit);
        alert("Rol creado con éxito");
      }
      
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
      await eliminarRol(id);
      alert("Rol eliminado con éxito");
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
    setFormData(rol);
    setEditingId(rol.id_rol);
    setIsModalOpen(true);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          <AnimatedContainer animation="fadeIn" duration={400} className="w-full">
            <h1 className="text-xl font-bold mb-4">Gestión de Roles</h1>
          </AnimatedContainer>

          <AnimatedContainer animation="slideUp" delay={100} duration={400}>
            <Boton
              onPress={handleCreate}
              className="bg-blue-600 text-white px-4 py-2 mb-4 hover:bg-blue-700"
            >
              Crear Nuevo Rol
            </Boton>
          </AnimatedContainer>

          {/* Tabla de roles */}
          <AnimatedContainer animation="slideUp" delay={200} duration={500} className="w-full">
            {loading ? (
              <p>Cargando roles...</p>
            ) : (
              <GlobalTable columns={columns} data={roles.map(rol => ({ ...rol, key: rol.id_rol }))} rowsPerPage={6} />
            )}
          </AnimatedContainer>

          {/* Modal para crear/editar */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <AnimatedContainer animation="scaleIn" duration={300} className="w-full max-w-lg">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-h-[90vh] overflow-y-auto">
                  <h2 className="text-lg font-bold mb-4 text-center">
                    {editingId ? "Editar Rol" : "Crear Nuevo Rol"}
                  </h2>
                  <Form
                    fields={formFields}
                    initialValues={{
                      nombre_rol: formData.nombre_rol || '',
                      descripcion: formData.descripcion || '',
                      estado: typeof formData.estado === 'boolean' ? (formData.estado ? "Activo" : "Inactivo") : "Activo",
                      fecha_creacion: formData.fecha_creacion || ''
                    }}
                    onSubmit={handleSubmit}
                    buttonText={editingId ? "Actualizar" : "Crear"}
                  />
                  <div className="flex justify-end mt-4">
                    <Boton
                      onPress={() => setIsModalOpen(false)}
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

export default Roles;
