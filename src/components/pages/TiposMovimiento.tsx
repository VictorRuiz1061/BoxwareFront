import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Boton from '../atomos/Boton';
import Sidebar from '../organismos/Sidebar';
import Header from "../organismos/Header";
import GlobalTable, { Column } from "../organismos/Table";
import Form, { FormField } from "../organismos/Form";
import { useTiposMovimiento } from '../../hooks/useTiposMovimiento';
import { TipoMovimiento } from '../../types/tipoMovimiento';

const TiposMovimiento = () => {
  const navigate = useNavigate();
  const { tiposMovimiento, loading, crearTipoMovimiento, actualizarTipoMovimiento, eliminarTipoMovimiento } = useTiposMovimiento();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<TipoMovimiento>>({});

  const columns: Column<TipoMovimiento>[] = [
    { key: "id_tipo_movimiento", label: "ID" },
    { key: "tipo_movimiento", label: "Tipo de Movimiento" },
    { key: "fecha_creacion", label: "Fecha de Creación" },
    { key: "fecha_modificacion", label: "Fecha de Modificación" },
    {
      key: "acciones",
      label: "Acciones",
      render: (tipoMovimiento) => (
        <div className="flex gap-2">
          <Boton
            onClick={() => handleEdit(tipoMovimiento)}
            className="bg-yellow-500 text-white px-2 py-1"
          >
            Editar
          </Boton>
          <Boton
            onClick={() => handleDelete(tipoMovimiento.id_tipo_movimiento)}
            className="bg-red-500 text-white px-2 py-1"
          >
            Eliminar
          </Boton>
        </div>
      ),
    },
  ];

  const formFields: FormField[] = [
    { key: "tipo_movimiento", label: "Tipo de Movimiento", type: "text", required: true },
    { key: "fecha_creacion", label: "Fecha de Creación", type: "date", required: true },
    { key: "fecha_modificacion", label: "Fecha de Modificación", type: "date", required: true },
  ];

  // Crear o actualizar tipo de movimiento
  const handleSubmit = async (values: Record<string, any>) => {
    try {
      if (editingId) {
        await actualizarTipoMovimiento(editingId, values);
        alert("Tipo de movimiento actualizado con éxito");
      } else {
        await crearTipoMovimiento(values as Omit<TipoMovimiento, "id_tipo_movimiento">);
        alert("Tipo de movimiento creado con éxito");
      }
      
      // Cerrar modal y limpiar estado
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      console.error("Error al guardar el tipo de movimiento:", error);
      alert(`Error al guardar el tipo de movimiento: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  };

  // Eliminar tipo de movimiento
  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este tipo de movimiento?"))
      return;

    try {
      await eliminarTipoMovimiento(id);
      alert("Tipo de movimiento eliminado con éxito");
    } catch (error) {
      console.error("Error al eliminar el tipo de movimiento:", error);
      alert("Error al eliminar el tipo de movimiento");
    }
  };

  // Abrir modal para crear nuevo tipo de movimiento
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

  // Abrir modal para editar tipo de movimiento existente
  const handleEdit = (tipoMovimiento: TipoMovimiento) => {
    // Convertir fechas a formato string para los inputs date
    const formattedTipoMovimiento = {
      ...tipoMovimiento,
      fecha_creacion: tipoMovimiento.fecha_creacion ? new Date(tipoMovimiento.fecha_creacion).toISOString().split('T')[0] : '',
      fecha_modificacion: new Date().toISOString().split('T')[0] // Actualizar fecha de modificación
    };
    
    setFormData(formattedTipoMovimiento);
    setEditingId(tipoMovimiento.id_tipo_movimiento);
    setIsModalOpen(true);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          <h1 className="text-xl font-bold mb-4">Gestión de Tipos de Movimiento</h1>

          <Boton
            onClick={handleCreate}
            className="bg-blue-500 text-white px-4 py-2 mb-4"
          >
            Crear Nuevo Tipo de Movimiento
          </Boton>

          {/* Tabla de tipos de movimiento */}
          {loading ? (
            <p>Cargando tipos de movimiento...</p>
          ) : (
            <GlobalTable 
              columns={columns} 
              data={tiposMovimiento.map(tm => ({ ...tm, key: tm.id_tipo_movimiento }))} 
              rowsPerPage={6} 
            />
          )}

          {/* Modal para crear/editar */}
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
                  {editingId ? "Editar Tipo de Movimiento" : "Crear Nuevo Tipo de Movimiento"}
                </h2>
                <Form
                  fields={formFields}
                  onSubmit={handleSubmit}
                  buttonText={editingId ? "Actualizar" : "Crear"}
                  initialValues={{
                    tipo_movimiento: formData.tipo_movimiento || '',
                    fecha_creacion: formData.fecha_creacion || '',
                    fecha_modificacion: formData.fecha_modificacion || ''
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

export default TiposMovimiento;
