import { useState } from "react";
import Sidebar from "../organismos/Sidebar";
import Header from "../organismos/Header";
import GlobalTable, { Column } from "../organismos/Table";
import Form, { FormField } from "../organismos/Form";
import Boton from "../atomos/Boton";
import { useMunicipios } from '../../hooks/useMunicipios';
import { Municipio } from '../../types/municipio';

const Municipios = () => {
  const { municipios, loading, crearMunicipio, actualizarMunicipio, eliminarMunicipio } = useMunicipios();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Municipio>>({});

  const columns: Column<Municipio>[] = [
    { key: "nombre_municipio", label: "Nombre del Municipio" },
    { key: "fecha_creacion", label: "Fecha de Creación" },
    { key: "fecha_modificacion", label: "Fecha de Modificación" },
    {
      key: "acciones",
      label: "Acciones",
      render: (municipio) => (
        <div className="flex gap-2">
          <Boton
            onPress={() => handleEdit(municipio)}
            className="bg-yellow-500 text-white px-2 py-1"
          >
            Editar
          </Boton>
          <Boton
            onPress={() => handleDelete(municipio.id_municipio)}
            className="bg-red-500 text-white px-2 py-1"
          >
            Eliminar
          </Boton>
        </div>
      ),
    },
  ];

  const formFields: FormField[] = [
    { key: "id_municipio", label: "ID", type: "number", required: true },
    { key: "nombre_municipio", label: "Nombre del Municipio", type: "text", required: true },
    { key: "fecha_creacion", label: "Fecha de Creación", type: "date", required: true },
    { key: "fecha_modificacion", label: "Fecha de Modificación", type: "date", required: true },
  ];

  const handleSubmit = async (values: Partial<Municipio>) => {
    try {
      // Asegurarse de que todos los campos requeridos estén presentes
      if (!values.nombre_municipio || !values.fecha_creacion || !values.fecha_modificacion) {
        alert('Por favor complete todos los campos requeridos');
        return;
      }
      const datosMunicipio = {
        id_municipio: editingId?.toString() || values.id_municipio,
        nombre_municipio: values.nombre_municipio,
        fecha_creacion: values.fecha_creacion,
        fecha_modificacion: values.fecha_modificacion
      };

      if (editingId) {
        if (values.nombre_municipio && values.fecha_creacion && values.fecha_modificacion) {
          await actualizarMunicipio(editingId, {
            nombre_municipio: values.nombre_municipio,
            fecha_creacion: values.fecha_creacion,
            fecha_modificacion: values.fecha_modificacion,
          });
        } else {
          throw new Error("Campos requeridos faltantes");
        }
      } else {
        await crearMunicipio(datosMunicipio);
      }
      alert(`Municipio ${editingId ? "actualizado" : "creado"} con éxito`);
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      console.error("Error al guardar el Municipio:", error);
      alert('Error al guardar el municipio');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este municipio?')) return;
    try {
      await eliminarMunicipio(id);
      alert('Municipio eliminado con éxito');
    } catch (error) {
      console.error('Error al eliminar el municipio:', error);
      alert('Error al eliminar el municipio');
    }
  };

  const handleCreate = () => {
    // Inicializar con fechas actuales
    const today = new Date().toISOString().split('T')[0];
    setFormData({
      fecha_creacion: today,
      fecha_modificacion: today
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (municipio: Municipio) => {
    // Convertir fechas a formato string para los inputs date
    const formattedMunicipio = {
      ...municipio,
      fecha_creacion: municipio.fecha_creacion ? new Date(municipio.fecha_creacion).toISOString().split('T')[0] : '',
      fecha_modificacion: new Date().toISOString().split('T')[0] // Actualizar fecha de modificación
    };
    
    setFormData(formattedMunicipio);
    setEditingId(municipio.id_municipio);
    setIsModalOpen(true);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          <h1 className="text-xl font-bold mb-4">Gestión de Municipios</h1>

          <Boton
            onPress={handleCreate}
            className="bg-blue-500 text-white px-4 py-2 mb-4"
          >
            Crear Nuevo Municipio
          </Boton>

          {loading ? (
            <p>Cargando municipios...</p>
          ) : (
            <GlobalTable 
              columns={columns} 
              data={municipios.map(m => ({ ...m, key: m.id_municipio }))} 
              rowsPerPage={6} 
            />
          )}

          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <h2 className="text-lg font-bold mb-4 text-center">
                  {editingId ? "Editar Municipio" : "Crear Nuevo Municipio"}
                </h2>
                <Form
                  fields={formFields}
                  onSubmit={handleSubmit}
                  buttonText={editingId ? "Actualizar" : "Crear"}
                  initialValues={formData}
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

export default Municipios;
