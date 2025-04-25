import { useState } from "react";
import Sidebar from "../organismos/Sidebar";
import Header from "../organismos/Header";
import GlobalTable, { Column } from "../organismos/Table";
import Form, { FormField } from "../organismos/Form";
import Boton from "../atomos/Boton";
import { usePermisos } from '../../hooks/usePermisos';
import { Permiso } from '../../types/permiso';

const Permisos = () => {
  const { permisos, loading, crearPermiso, actualizarPermiso, eliminarPermiso } = usePermisos();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Permiso>>({});

  const columns: Column<Permiso>[] = [
    { key: "nombre", label: "Nombre" },
    { key: "codigo_nombre", label: "Código Nombre" },
    { key: "modulo_id", label: "ID Módulo" },
    { key: "rol_id", label: "ID Rol" },
    {
      key: "acciones",
      label: "Acciones",
      render: (permiso) => (
        <div className="flex gap-2">
          <Boton
            onPress={() => handleEdit(permiso)}
            className="bg-yellow-500 text-white px-2 py-1"
          >
            Editar
          </Boton>
          <Boton
            onPress={() => handleDelete(permiso.id_permiso)}
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
    { key: "codigo_nombre", label: "Código Nombre", type: "text", required: true },
    { key: "modulo_id", label: "ID Módulo", type: "number", required: true },
    { key: "rol_id", label: "ID Rol", type: "number", required: true },
  ];

  const handleSubmit = async (values: Record<string, string | number>) => {
    try {
      const datos = {
        id_permiso: parseInt(values.id_permiso as string),
        nombre: values.nombre as string,
        codigo_nombre: values.codigo_nombre as string,
        modulo_id: parseInt(values.modulo_id as string),
        rol_id: parseInt(values.rol_id as string)
      };

      if (editingId) {
        await actualizarPermiso(editingId, datos);
        alert('Permiso actualizado con éxito');
      } else {
        await crearPermiso(datos);
        alert('Permiso creado con éxito');
      }
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      console.error('Error al guardar el permiso:', error);
      alert('Error al guardar el permiso');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este permiso?')) return;
    try {
      await eliminarPermiso(id);
      alert('Permiso eliminado con éxito');
    } catch (error) {
      console.error('Error al eliminar el permiso:', error);
      alert('Error al eliminar el permiso');
    }
  };

  const handleCreate = () => {
    setFormData({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (permiso: Permiso) => {
    setFormData(permiso);
    setEditingId(permiso.id_permiso);
    setIsModalOpen(true);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          <h1 className="text-xl font-bold mb-4">Gestión de Permisos</h1>

          <Boton
            onPress={handleCreate}
            className="bg-blue-500 text-white px-4 py-2 mb-4"
          >
            Crear Nuevo Permiso
          </Boton>

          {loading ? (
            <p>Cargando permisos...</p>
          ) : (
            <GlobalTable
              columns={columns}
              data={permisos.map((permiso) => ({ ...permiso, key: permiso.id_permiso }))}
              rowsPerPage={6}
            />
          )}

          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
                {/* Botón X para cerrar en la esquina superior derecha */}
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                >
                  <span className="text-gray-800 font-bold">×</span>
                </button>
                
                <h2 className="text-lg font-bold mb-4 text-center">
                  {editingId ? "Editar Permiso" : "Crear Nuevo Permiso"}
                </h2>
                <Form
                  fields={formFields}
                  onSubmit={handleSubmit}
                  buttonText={editingId ? "Actualizar" : "Crear"}
                  initialValues={{
                    ...formData,
                    id_permiso: formData.id_permiso?.toString(),
                    modulo_id: formData.modulo_id?.toString(),
                    rol_id: formData.rol_id?.toString()
                  }}
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Permisos;