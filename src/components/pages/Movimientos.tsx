import { useState } from 'react';
import Boton from '../atomos/Boton';
import Sidebar from '../organismos/Sidebar';
import Header from "../organismos/Header";
import GlobalTable, { Column } from "../organismos/Table";
import Form, { FormField } from "../organismos/Form";
import { useMovimientos } from '../../hooks/useMovimientos';
import { Movimiento } from '../../types/movimiento';
import { useUsuarios } from '../../hooks/useUsuarios';
import { useTiposMovimiento } from '../../hooks/useTiposMovimiento';

const Movimientos = () => {
  const { movimientos, loading, crearMovimiento, actualizarMovimiento, eliminarMovimiento } = useMovimientos();
  const { usuarios } = useUsuarios();
  const { tiposMovimiento } = useTiposMovimiento();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Movimiento>>({});

  const columns: Column<Movimiento>[] = [
    { key: "id_movimiento", label: "ID", filterable: true },
    { key: "fecha_creacion", label: "Fecha de Creación", filterable: true },
    { key: "fecha_modificacion", label: "Fecha de Modificación", filterable: true },
    {
      key: "usuario_movimiento_id",
      label: "Usuario",
      filterable: true,
      render: (movimiento) => {
        const usuario = usuarios.find(u => u.id_usuario === movimiento.usuario_movimiento_id);
        return usuario ? `${usuario.nombre} ${usuario.apellido}` : movimiento.usuario_movimiento_id;
      }
    },
    {
      key: "tipo_movimiento_id",
      label: "Tipo de Movimiento",
      filterable: true,
      render: (movimiento) => {
        const tipo = tiposMovimiento.find(t => t.id_tipo_movimiento === movimiento.tipo_movimiento_id);
        return tipo ? tipo.tipo_movimiento : movimiento.tipo_movimiento_id;
      }
    },
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

  // Definir campos del formulario dinámicamente
  const formFields: FormField[] = [
    { key: "usuario_movimiento_id", label: "Usuario", type: "select", required: true, options: usuarios.map(u => `${u.nombre} ${u.apellido}`) },
    { key: "tipo_movimiento_id", label: "Tipo de Movimiento", type: "select", required: true, options: tiposMovimiento.map(t => t.tipo_movimiento) },
  ];
  if (editingId) {
    formFields.unshift({ key: "fecha_modificacion", label: "Fecha de Modificación", type: "date", required: true });
  } else {
    formFields.unshift({ key: "fecha_creacion", label: "Fecha de Creación", type: "date", required: true });
  }

  // Crear o actualizar movimiento
  const handleSubmit = async (values: Record<string, string | number | boolean>) => {
    try {
      const movimientoData = {
        usuario_movimiento_id: usuarios.find(u => `${u.nombre} ${u.apellido}` === values.usuario_movimiento_id)?.id_usuario || 0,
        tipo_movimiento_id: tiposMovimiento.find(t => t.tipo_movimiento === values.tipo_movimiento_id)?.id_tipo_movimiento || 0,
        fecha_modificacion: editingId
          ? String(values.fecha_modificacion)
          : String(values.fecha_creacion),
        fecha_creacion: editingId
          ? String(formData.fecha_creacion || "")
          : String(values.fecha_creacion),
      };
      if (editingId) {
        await actualizarMovimiento(editingId, movimientoData);
        alert('Movimiento actualizado con éxito');
      } else {
        await crearMovimiento(movimientoData as Omit<Movimiento, 'id_movimiento'>);
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
    // Inicializar con fecha actual
    const today = new Date().toISOString().split('T')[0];
    setFormData({
      fecha_creacion: today,
      usuario_movimiento_id: 0,
      tipo_movimiento_id: 0
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  // Abrir modal para editar movimiento existente
  const handleEdit = (movimiento: Movimiento) => {
    // Convertir fechas a formato string para los inputs date
    setFormData({
      ...movimiento,
      fecha_modificacion: new Date().toISOString().split('T')[0], // Actualizar fecha de modificación
    });
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
                  initialValues={{
                    ...formData,
                    usuario_movimiento_id: editingId
                      ? (usuarios.find(u => u.id_usuario === formData.usuario_movimiento_id) ? `${usuarios.find(u => u.id_usuario === formData.usuario_movimiento_id)?.nombre} ${usuarios.find(u => u.id_usuario === formData.usuario_movimiento_id)?.apellido}` : '')
                      : formData.usuario_movimiento_id,
                    tipo_movimiento_id: editingId
                      ? (tiposMovimiento.find(t => t.id_tipo_movimiento === formData.tipo_movimiento_id)?.tipo_movimiento || '')
                      : formData.tipo_movimiento_id,
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

export default Movimientos;
