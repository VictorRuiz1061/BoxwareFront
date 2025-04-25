import { useState } from "react";
import Sidebar from "../organismos/Sidebar";
import Header from "../organismos/Header";
import GlobalTable, { Column } from "../organismos/Table";
import Form, { FormField } from "../organismos/Form";
import Boton from "../atomos/Boton";
import { useSedes } from '../../hooks/useSedes';
import { Sede } from '../../types/sede';

const Sedes = () => {
  const { sedes, loading, crearSede, actualizarSede, eliminarSede } = useSedes();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Sede>>({});

  const columns: Column<Sede>[] = [
    { key: "nombre_sede", label: "Nombre de la Sede" },
    { key: "direccion_sede", label: "Dirección de la sede" },
    { key: "fecha_creacion", label: "Fecha de Creación" },
    { key: "fecha_modificacion", label: "Fecha de Modificación" },
    { key: "centro_sede_id", label: "Centro ID" },
    {
      key: "acciones",
      label: "Acciones",
      render: (sede) => (
        <div className="flex gap-2">
          <Boton
            onClick={() => handleEdit(sede)}
            className="bg-yellow-500 text-white px-2 py-1"
          >
            Editar
          </Boton>
          <Boton
            onClick={() => handleDelete(sede.id_sede)}
            className="bg-red-500 text-white px-2 py-1"
          >
            Eliminar
          </Boton>
        </div>
      ),
    },
  ];

  const formFields: FormField[] = [
    { key: "id_sede", label: "ID", type: "number", required: true },
    { key: "nombre_sede", label: "Nombre de la Sede", type: "text", required: true },
    { key: "direccion_sede", label: "Dirección de la sede", type: "text", required: true },
    { key: "fecha_creacion", label: "Fecha de Creación", type: "date", required: true },
    { key: "fecha_modificacion", label: "Fecha de Modificación", type: "date", required: true },
    { key: "centro_sede_id", label: "Centro ID", type: "number", required: true },
  ];

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      if (editingId) {
        await actualizarSede(editingId, {
          id_sede: Number(values.id_sede),
          nombre_sede: values.nombre_sede,
          direccion_sede: values.direccion_sede,
          fecha_creacion: values.fecha_creacion,
          fecha_modificacion: values.fecha_modificacion,
          centro_sede_id: Number(values.centro_sede_id),
        });
        alert('Sede actualizada con éxito');
      } else {
        await crearSede({
          id_sede: Number(values.id_sede),
          nombre_sede: values.nombre_sede,
          direccion_sede: values.direccion_sede,
          fecha_creacion: values.fecha_creacion,
          fecha_modificacion: values.fecha_modificacion,
          centro_sede_id: Number(values.centro_sede_id),
        });
        alert('Sede creada con éxito');
      }
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      console.error('Error al guardar la sede:', error);
      alert('Error al guardar la sede');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta sede?')) return;
    try {
      await eliminarSede(id);
      alert('Sede eliminada con éxito');
    } catch (error) {
      console.error('Error al eliminar la sede:', error);
      alert('Error al eliminar la sede');
    }
  };

  const handleCreate = () => {
    setFormData({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (sede: Sede) => {
    setFormData(sede);
    setEditingId(sede.id_sede);
    setIsModalOpen(true);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          <h1 className="text-xl font-bold mb-4">Gestión de Sedes</h1>

          <Boton
            onClick={handleCreate}
            className="bg-blue-500 text-white px-4 py-2 mb-4"
          >
            Crear Nueva Sede
          </Boton>

          {loading ? (
            <p>Cargando sedes...</p>
          ) : (
            <GlobalTable columns={columns as Column<any>[]} data={sedes.map(sede => ({ ...sede, key: sede.id_sede }))} rowsPerPage={6} />
          )}

          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                >
                  <span className="text-gray-800 font-bold">×</span>
                </button>
                
                <h2 className="text-lg font-bold mb-4 text-center">
                  {editingId ? "Editar Sede" : "Crear Nueva Sede"}
                </h2>
                <Form
                  fields={formFields}
                  onSubmit={handleSubmit}
                  buttonText={editingId ? "Actualizar" : "Crear"}
                  initialValues={{
                    id_sede: formData.id_sede?.toString() || '',
                    nombre_sede: formData.nombre_sede || '',
                    direccion_sede: formData.direccion_sede || '',
                    fecha_creacion: formData.fecha_creacion || '',
                    fecha_modificacion: formData.fecha_modificacion || '',
                    centro_sede_id: formData.centro_sede_id?.toString() || ''
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

export default Sedes;
