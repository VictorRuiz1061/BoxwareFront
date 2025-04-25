import { useState } from "react";
import Sidebar from "../organismos/Sidebar";
import Header from "../organismos/Header";
import GlobalTable, { Column } from "../organismos/Table";
import Form, { FormField } from "../organismos/Form";
import Boton from "../atomos/Boton";
import { useProgramas } from '../../hooks/useProgramas';
import { Programa } from '../../types/programa';

const Programas = () => {
  const { programas, loading, crearPrograma, actualizarPrograma, eliminarPrograma } = useProgramas();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Programa>>({});

  const columns: Column<Programa>[] = [
    { key: "nombre_programa", label: "Nombre del Programa" },
    { key: "area_id", label: "ID del Área" },
    { key: "fecha_creacion", label: "Fecha de Creación" },
    { key: "fecha_modificacion", label: "Última Modificación" },
    {
      key: "acciones",
      label: "Acciones",
      render: (programa) => (
        <div className="flex gap-2">
          <Boton
            onClick={() => handleEdit(programa)}
            className="bg-yellow-500 text-white px-2 py-1"
          >
            Editar
          </Boton>
          <Boton
            onClick={() => handleDelete(programa.id_programa)}
            className="bg-red-500 text-white px-2 py-1"
          >
            Eliminar
          </Boton>
        </div>
      ),
    },
  ];

  const formFields: FormField[] = [
    { key: "nombre_programa", label: "Nombre del Programa", type: "text", required: true },
    { key: "area_id", label: "ID del Área", type: "number", required: true },
  ];



  const handleSubmit = async (values: Record<string, string>) => {
    try {
      if (editingId) {
        await actualizarPrograma(editingId, {
          ...values,
          nombre_programa: values.nombre_programa as string,
          area_id: parseInt(values.area_id as string, 10),
          fecha_modificacion: new Date().toISOString(),
        });
        alert('Programa actualizado con éxito');
      } else {
        await crearPrograma({
          ...values,
          nombre_programa: values.nombre_programa as string,
          area_id: parseInt(values.area_id as string, 10),
          fecha_creacion: new Date().toISOString(),
          fecha_modificacion: new Date().toISOString(),
        });
        alert('Programa creado con éxito');
      }
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      console.error('Error al guardar el programa:', error);
      alert('Error al guardar el programa');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este programa?')) return;
    try {
      await eliminarPrograma(id);
      alert('Programa eliminado con éxito');
    } catch (error) {
      console.error('Error al eliminar el programa:', error);
      alert('Error al eliminar el programa');
    }
  };

  const handleCreate = () => {
    setFormData({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (programa: Programa) => {
    setFormData(programa);
    setEditingId(programa.id_programa);
    setIsModalOpen(true);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          <h1 className="text-xl font-bold mb-4">Gestión de Programas</h1>

          <Boton
            onClick={handleCreate}
            className="bg-blue-500 text-white px-4 py-2 mb-4"
          >
            Crear Nuevo Programa
          </Boton>

          {loading ? (
            <p>Cargando programas...</p>
          ) : (
            <GlobalTable columns={columns as Column<any>[]} data={programas.map(programa => ({ ...programa, key: programa.id_programa }))} rowsPerPage={6} />
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
                  {editingId ? "Editar Programa" : "Crear Nuevo Programa"}
                </h2>
                <Form
                  fields={formFields}
                  onSubmit={handleSubmit}
                  buttonText={editingId ? "Actualizar" : "Crear"}
                  initialValues={{
                    nombre_programa: formData.nombre_programa || '',
                    area_id: formData.area_id?.toString() || ''
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

export default Programas;