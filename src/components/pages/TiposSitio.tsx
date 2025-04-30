import { useState } from 'react';
import Sidebar from '../organismos/Sidebar';
import Header from "../organismos/Header";
import GlobalTable, { Column } from "../organismos/Table";
import Form, { FormField } from "../organismos/Form";
import Boton from '../atomos/Boton';
import { useTiposSitio } from '../../hooks/useTiposSitio';
import { TipoSitio } from '../../types/tipoSitio';

const TiposSitio = () => {
  const { tiposSitio, loading, crearTipoSitio, actualizarTipoSitio, eliminarTipoSitio } = useTiposSitio();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<TipoSitio>>({});

  const columns: Column<TipoSitio>[] = [
    { key: "id_tipo_sitio", label: "ID", filterable: true },
    { key: "nombre_tipo_sitio", label: "Nombre del Tipo de Sitio", filterable: true },
    { key: "fecha_creacion", label: "Fecha de Creación", filterable: true },
    { key: "fecha_modificacion", label: "Fecha de Modificación", filterable: true },
    {
      key: "acciones",
      label: "Acciones",
      render: (tipoSitio) => (
        <div className="flex gap-2">
          <Boton
            onClick={() => handleEdit(tipoSitio)}
            className="bg-yellow-500 text-white px-2 py-1"
          >
            Editar
          </Boton>
          <Boton
            onClick={() => handleDelete(tipoSitio.id_tipo_sitio)}
            className="bg-red-500 text-white px-2 py-1"
          >
            Eliminar
          </Boton>
        </div>
      ),
    },
  ];

  const formFields: FormField[] = [
    { key: "nombre_tipo_sitio", label: "Nombre del Tipo de Sitio", type: "text", required: true },
    { key: "fecha_creacion", label: "Fecha de Creación", type: "date", required: true },
  ];

  const editFormFields: FormField[] = [
    { key: "nombre_tipo_sitio", label: "Nombre del Tipo de Sitio", type: "text", required: true },
    { key: "fecha_modificacion", label: "Fecha de Modificación", type: "date", required: true },
  ];

  // Crear o actualizar tipo de sitio
  const handleSubmit = async (values: Record<string, string>) => {
    try {
      if (editingId) {
        await actualizarTipoSitio(editingId, values);
        alert('Tipo de sitio actualizado con éxito');
      } else {
        await crearTipoSitio({
          nombre_tipo_sitio: values.nombre_tipo_sitio,
          fecha_creacion: values.fecha_creacion,
          fecha_modificacion: values.fecha_modificacion,
        });
        alert('Tipo de sitio creado con éxito');
      }
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      console.error('Error al guardar el tipo de sitio:', error);
      alert('Error al guardar el tipo de sitio');
    }
  };

  // Eliminar tipo de sitio
  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este tipo de sitio?')) return;
    try {
      await eliminarTipoSitio(id);
      alert('Tipo de sitio eliminado con éxito');
    } catch (error) {
      console.error('Error al eliminar el tipo de sitio:', error);
      alert('Error al eliminar el tipo de sitio');
    }
  };

  // Abrir modal para crear nuevo tipo de sitio
  const handleCreate = () => {
    setFormData({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  // Abrir modal para editar tipo de sitio existente
  const handleEdit = (tipoSitio: TipoSitio) => {
    setFormData(tipoSitio);
    setEditingId(tipoSitio.id_tipo_sitio);
    setIsModalOpen(true);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          <h1 className="text-xl font-bold mb-4">Gestión de Tipos de Sitio</h1>

          <Boton
            onClick={handleCreate}
            className="bg-blue-500 text-white px-4 py-2 mb-4"
          >
            Crear Nuevo Tipo de Sitio
          </Boton>

          {/* Tabla de tipos de sitio */}
          {loading ? (
            <p>Cargando tipos de sitio...</p>
          ) : (
            <GlobalTable columns={columns as Column<any>[]} data={tiposSitio.map(ts => ({ ...ts, key: ts.id_tipo_sitio }))} rowsPerPage={6} />
          )}

          {/* Modal para crear/editar */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <h2 className="text-lg font-bold mb-4 text-center">
                  {editingId ? "Editar Tipo de Sitio" : "Crear Nuevo Tipo de Sitio"}
                </h2>
                <Form
                  fields={editingId ? editFormFields : formFields}
                  onSubmit={handleSubmit}
                  buttonText={editingId ? "Actualizar" : "Crear"}
                  initialValues={formData as Record<string, string>}
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

export default TiposSitio;
