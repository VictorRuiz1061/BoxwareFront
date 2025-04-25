import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Boton from '../atomos/Boton';
import Sidebar from '../organismos/Sidebar';
import Header from "../organismos/Header";
import GlobalTable, { Column } from "../organismos/Table";
import Form, { FormField } from "../organismos/Form";
import { useMovimientos } from '../../hooks/useMovimientos';
import { Movimiento } from '../../types/movimiento';

const Movimientos = () => {
  const navigate = useNavigate();
  const { movimientos, loading, crearMovimiento, actualizarMovimiento, eliminarMovimiento } = useMovimientos();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Movimiento>>({});

  const columns: Column<Movimiento>[] = [
    { key: "id_movimiento", label: "ID" },
    { key: "fecha_creacion", label: "Fecha de Creación" },
    { key: "fecha_modificacion", label: "Fecha de Modificación" },
    { key: "usuario_movimiento_id", label: "ID Usuario" },
    { key: "tipo_movimiento_id", label: "Tipo de Movimiento" },
    {
      key: "acciones",
      label: "Acciones",
      render: (movimiento) => (
        <div className="flex gap-2">
          <Boton
            onPress={() => handleEdit(movimiento)}
            className="bg-yellow-500 text-white px-2 py-1"
          >
            Editar
          </Boton>
          <Boton
            onPress={() => handleDelete(movimiento.id_movimiento)}
            className="bg-red-500 text-white px-2 py-1"
          >
            Eliminar
          </Boton>
        </div>
      ),
    },
  ];

  const formFields: FormField[] = [
    { key: "fecha_creacion", label: "Fecha de Creación", type: "date", required: true },
    { key: "fecha_modificacion", label: "Fecha de Modificación", type: "date", required: true },
    { key: "usuario_movimiento_id", label: "ID Usuario", type: "number", required: true },
    { key: "tipo_movimiento_id", label: "Tipo de Movimiento", type: "number", required: true },
  ];

  // Crear o actualizar movimiento
  const handleSubmit = async (values: Record<string, string | number | boolean>) => {
    try {
      if (editingId) {
        await actualizarMovimiento(editingId, values);
        alert('Movimiento actualizado con éxito');
      } else {
        await crearMovimiento(values as Omit<Movimiento, 'id_movimiento'>);
        alert('Movimiento creado con éxito');
      }
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      console.error('Error al guardar el movimiento:', error);
    }
  };

  // Eliminar movimiento
  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este movimiento?")) return;
    try {
      await eliminarMovimiento(id);
      alert("Movimiento eliminado con éxito");
    } catch (error) {
      console.error("Error al eliminar el movimiento:", error);
    }
  };

  // Abrir modal para crear nuevo movimiento
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

  // Abrir modal para editar movimiento existente
  const handleEdit = (movimiento: Movimiento) => {
    // Convertir fechas a formato string para los inputs date
    const formattedMovimiento = {
      ...movimiento,
      fecha_creacion: movimiento.fecha_creacion ? new Date(movimiento.fecha_creacion).toISOString().split('T')[0] : '',
      fecha_modificacion: new Date().toISOString().split('T')[0] // Actualizar fecha de modificación
    };
    
    setFormData(formattedMovimiento);
    setEditingId(movimiento.id_movimiento);
    setIsModalOpen(true);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          <h1 className="text-xl font-bold mb-4">Gestión de Movimientos</h1>

          <Boton
            onPress={handleCreate}
            className="bg-blue-500 text-white px-4 py-2 mb-4"
          >
            Crear Nuevo Movimiento
          </Boton>

          {/* Tabla de movimientos */}
          {loading ? (
            <p>Cargando movimientos...</p>
          ) : (
            <GlobalTable 
              columns={columns} 
              data={movimientos.map(m => ({ ...m, key: m.id_movimiento }))} 
              rowsPerPage={6} 
            />
          )}

          {/* Modal para crear/editar */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <h2 className="text-lg font-bold mb-4 text-center">
                  {editingId ? "Editar Movimiento" : "Crear Nuevo Movimiento"}
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

export default Movimientos;
