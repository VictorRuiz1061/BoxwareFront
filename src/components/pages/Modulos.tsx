import { useState } from "react";
import Sidebar from "../organismos/Sidebar";
import Header from "../organismos/Header";
import GlobalTable, { Column } from "../organismos/Table";
import Form, { FormField } from "../organismos/Form";
import Boton from "../atomos/Boton";
import { useModulos } from '../../hooks/useModulos';
import { Modulo } from '../../types/modulo';

type ModuloInput = Omit<Modulo, 'id_modulo'>;

const ModulosPage = () => {
  const { modulos, loading, crear, actualizar, eliminar } = useModulos();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Modulo>>({});

  const handleSubmit = async (values: ModuloInput) => {
    try {
      if (editingId) {
        await actualizar(editingId, values);
        alert('Módulo actualizado con éxito');
      } else {
        await crear(values);
        alert('Módulo creado con éxito');
      }
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      console.error('Error al guardar el módulo:', error);
      alert('Error al guardar el módulo');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este registro?")) return;
    try {
      await eliminar(id);
      alert("Módulo eliminado con éxito");
    } catch (error) {
      console.error("Error al eliminar el módulo:", error);
      alert("Error al eliminar el módulo");
    }
  };

  const handleCreate = () => {
    setFormData({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (modulo: Modulo) => {
    setFormData(modulo);
    setEditingId(modulo.id_modulo);
    setIsModalOpen(true);
  };

  const formFields: FormField[] = [
    { key: "fecha_accion", label: "Fecha", type: "date", required: true },
    { key: "rutas", label: "Ruta", type: "text", required: true },
    { key: "descripcion_ruta", label: "Descripción", type: "text", required: true },
    { key: "bandera_accion", label: "Estado", type: "number", required: true },
    { key: "mensaje_cambio", label: "Mensaje", type: "text", required: true },
  ];

  const columns: Column<Modulo>[] = [
    { key: 'id_modulo', label: 'ID' },
    { key: 'fecha_accion', label: 'Fecha' },
    { key: 'rutas', label: 'Ruta' },
    { key: 'descripcion_ruta', label: 'Descripción' },
    { key: 'bandera_accion', label: 'Estado' },
    { key: 'mensaje_cambio', label: 'Mensaje' },

    {
      key: 'acciones',
      label: 'Acciones',
      render: (row: Modulo) => (
        <div className="flex gap-2">
          <Boton onPress={() => handleEdit(row)} className="bg-yellow-500 text-white px-2 py-1">
            Editar
          </Boton>
          <Boton onPress={() => handleDelete(row.id_modulo)} className="bg-red-500 text-white px-2 py-1">
            Eliminar
          </Boton>
        </div>
      )
    }
  ];

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          <h1 className="text-xl font-bold mb-4">Gestión de Módulos</h1>

          <Boton
            onPress={handleCreate}
            className="bg-blue-500 text-white px-4 py-2 mb-4"
          >
            Crear Nuevo Módulo
          </Boton>

          {/* Tabla de administradores */}
          {loading ? (
            <p>Cargando módulos...</p>
          ) : (
            <GlobalTable
              columns={columns}
              data={modulos.map((modulo) => ({ ...modulo, key: modulo.id_modulo }))}
              rowsPerPage={6}
            />
          )}

          {/* Modal para crear/editar */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <h2 className="text-lg font-bold mb-4 text-center">
                  {editingId ? "Editar Módulo" : "Crear Nuevo Módulo"}
                </h2>
                <Form
                  fields={formFields}
                  onSubmit={handleSubmit}
                  buttonText={editingId ? "Actualizar" : "Crear"}
                  initialValues={{
                    ...formData,
                  }}
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
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ModulosPage;
