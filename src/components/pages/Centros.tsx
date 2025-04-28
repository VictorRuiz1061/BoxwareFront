import { useState } from "react";
import Sidebar from "../organismos/Sidebar";
import Header from "../organismos/Header";
import GlobalTable, { Column } from "../organismos/Table";
import Form, { FormField } from "../organismos/Form";
import Boton from "../atomos/Boton";
import { useCentros } from '../../hooks/useCentros';
import { Centro } from '../../types/centro';
import { useMunicipios } from '../../hooks/useMunicipios';
import { centroSchema } from '@/schemas/centro.schema';

const Centros = () => {
  const { centros, loading, crearCentro, actualizarCentro, eliminarCentro } = useCentros();
  const { municipios } = useMunicipios();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Centro>>({});

  const columns: Column<Centro>[] = [
    { key: "nombre_centro", label: "Nombre del Centro", filterable: true },
    {
      key: "municipio_id",
      label: "Municipio",
      filterable: true,
      render: (centro) => {
        const municipio = municipios.find(m => m.id_municipio === centro.municipio_id);
        return municipio ? municipio.nombre_municipio : centro.municipio_id;
      }
    },
    { key: "fecha_creacion", label: "Fecha de Creación", filterable: true },
    { key: "fecha_modificacion", label: "Fecha de Modificación", filterable: true },
    {
      key: "acciones",
      label: "Acciones",
      render: (centro) => (
        <div className="flex gap-2">
          <Boton
            onClick={() => handleEdit(centro)}
            className="bg-yellow-500 text-white px-2 py-1"
          >
            Editar
          </Boton>
          <Boton
            onClick={() => handleDelete(centro.id_centro)}
            className="bg-red-500 text-white px-2 py-1"
          >
            Eliminar
          </Boton>
        </div>
      ),
    },
  ];

  const formFields: FormField[] = [
    { key: "nombre_centro", label: "Nombre del Centro", type: "text", required: true },
    { key: "municipio_id", label: "Municipio", type: "select", required: true, options: municipios.map(m => ({ label: m.nombre_municipio, value: m.id_municipio })) },
    { key: "fecha_modificacion", label: "Fecha de Modificación", type: "date", required: true },
  ];

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      const municipioSeleccionado = municipios.find(m => m.id_municipio === Number(values.municipio_id));
      if (!municipioSeleccionado) {
        throw new Error('Municipio no encontrado');
      }
      const hoy = new Date().toISOString().slice(0, 10);
      const datosParaEnviar = {
        id_centro: editingId ?? undefined,
        nombre_centro: values.nombre_centro,
        municipio_id: municipioSeleccionado.id_municipio,
        fecha_creacion: editingId ? values.fecha_creacion : hoy,
        fecha_modificacion: hoy
      };

      if (editingId) {
        await actualizarCentro(editingId, datosParaEnviar);
      } else {
        await crearCentro(datosParaEnviar);
      }
      alert(`Centro ${editingId ? "actualizado" : "creado"} con éxito`);
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      console.error("Error al guardar el centro:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este centro?')) return;
    try {
      await eliminarCentro(id);
      alert('Centro eliminado con éxito');
    } catch (error) {
      console.error('Error al eliminar el centro:', error);
      alert('Error al eliminar el centro');
    }
  };

  const handleCreate = () => {
    const hoy = new Date().toISOString().slice(0, 10);
    setFormData({ fecha_creacion: hoy, fecha_modificacion: hoy });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (centro: Centro) => {
    setFormData(centro);
    setEditingId(centro.id_centro);
    setIsModalOpen(true);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          <h1 className="text-xl font-bold mb-4">Gestión de Centros</h1>

          <Boton
            onClick={handleCreate}
            className="bg-blue-500 text-white px-4 py-2 mb-4"
          >
            Crear Nuevo Centro
          </Boton>

          {loading ? (
            <p>Cargando centros...</p>
          ) : (
            <GlobalTable columns={columns as Column<any>[]} data={centros.map(c => ({ ...c, key: c.id_centro }))} rowsPerPage={6} />
          )}

{isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
                {/* Botón X para cerrar en la esquina superior derecha */}
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                >
                  <span className="text-gray-800 font-bold">×</span>
                </button>
                
                <h2 className="text-lg font-bold mb-4 text-center">
                  {editingId ? "Editar Centro" : "Crear Nuevo Centro"}
                </h2>
                <Form
                  fields={formFields}
                  onSubmit={handleSubmit}
                  buttonText={editingId ? "Actualizar" : "Crear"}
                  initialValues={{
                    ...formData,
                    id_centro: formData.id_centro?.toString(),
                    municipio_id: formData.municipio_id ? String(formData.municipio_id) : '',
                    fecha_creacion: formData.fecha_creacion,
                    fecha_modificacion: formData.fecha_modificacion
                  }}
                  schema={centroSchema}
                />
                </div>
              </div> 
          )}
        </main>
      </div>
    </div>
  );
};

export default Centros;
