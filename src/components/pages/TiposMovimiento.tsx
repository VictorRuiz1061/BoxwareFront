import { useState } from 'react';
import { Pencil } from 'lucide-react';
import ToggleButton from '../atomos/ToggleButton';
import { tipoMovimientoSchema } from '@/schemas/tipoMovimiento.schema';
import { useGetTiposMovimiento } from '@/hooks/tipoMovimiento/useGetTiposMovimiento';
import { usePostTipoMovimiento } from '@/hooks/tipoMovimiento/usePostTipoMovimiento';
import { usePutTipoMovimiento } from '@/hooks/tipoMovimiento/usePutTipoMovimiento';
// La importación de useDeleteTipoMovimiento ha sido eliminada ya que no se utiliza más
import { TipoMovimiento } from '@/types/tipoMovimiento';
import AlertDialog from '@/components/atomos/AlertDialog';
import Boton from "@/components/atomos/Boton";
import Sidebar from "@/components/organismos/Sidebar";
import Header from "@/components/organismos/Header";
import GlobalTable, { Column } from "@/components/organismos/Table";
import Form, { FormField } from "@/components/organismos/Form";

const TiposMovimiento = () => {
  const { tiposMovimiento, loading } = useGetTiposMovimiento();
  const { crearTipoMovimiento } = usePostTipoMovimiento();
  const { actualizarTipoMovimiento } = usePutTipoMovimiento();
  // La declaración de eliminarTipoMovimiento ha sido eliminada ya que no se utiliza más
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<TipoMovimiento>>({});
  const [alert, setAlert] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => setAlert(a => ({ ...a, isOpen: false })),
  });
  // La variable deleteConfirm ha sido eliminada ya que no se utiliza más
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successAlertText, setSuccessAlertText] = useState('');

  const columns: Column<TipoMovimiento & { key: any }>[] = [
    { key: "id_tipo_movimiento", label: "ID", filterable: true },
    { key: "tipo_movimiento", label: "Tipo de Movimiento", filterable: true },
    { key: "fecha_creacion", label: "Fecha de Creación", filterable: true },
    { key: "fecha_modificacion", label: "Fecha de Modificación", filterable: true },
    {
      key: "estado",
      label: "Estado",
      render: (tipoMovimiento) => (
        <div className="flex items-center justify-center">
          <ToggleButton
            isActive={tipoMovimiento.estado || false}
            onChange={() => handleToggleEstado(tipoMovimiento)}
          />
        </div>
      ),
    },
    {
      key: "acciones",
      label: "Acciones",
      render: (tipoMovimiento) => (
        <div className="flex gap-2">
          <Boton
            onPress={() => handleEdit(tipoMovimiento)}
            className="bg-yellow-500 text-white px-2 py-1 flex items-center justify-center"
            aria-label="Editar"
          >
            <Pencil size={18} />
          </Boton>
        </div>
      ),
    },
  ];

  const formFields: FormField[] = [
    { key: "tipo_movimiento", label: "Tipo de Movimiento", type: "text", required: true },
    { key: "fecha_creacion", label: "Fecha de Creación", type: "date", required: true },
    { key: "fecha_modificacion", label: "Fecha de Modificación", type: "date", required: true },
    { key: "estado", label: "Estado", type: "checkbox", required: false },
  ];

  // Crear o actualizar tipo de movimiento
  const handleSubmit = async (values: Record<string, string | number | boolean>) => {
    try {
      // Validar con zod
      const parsed = tipoMovimientoSchema.safeParse(values);
      if (!parsed.success) {
        setAlert({
          isOpen: true,
          title: 'Error de validación',
          message: parsed.error.errors.map(e => e.message).join('\n'),
          onConfirm: () => setAlert(a => ({ ...a, isOpen: false })),
        });
        return;
      }
      
      // Asegurarse de que el campo estado sea booleano
      const estado = typeof values.estado === 'boolean' ? values.estado : 
                    values.estado === 'true' ? true : 
                    Boolean(values.estado);
      
      try {
        if (editingId) {
          // Para actualización, preparar los datos necesarios
          const updateData: Partial<TipoMovimiento> = {
            tipo_movimiento: String(values.tipo_movimiento),
            fecha_modificacion: new Date().toISOString().split('T')[0],
            estado: estado
          };
          
          console.log('Actualizando tipo de movimiento:', editingId, updateData);
          await actualizarTipoMovimiento(editingId, updateData);
          setSuccessAlertText('El tipo de movimiento fue actualizado correctamente.');
          setShowSuccessAlert(true);
          setTimeout(() => setShowSuccessAlert(false), 3000);
        } else {
          // Para creación, preparar todos los datos necesarios
          const createData: Omit<TipoMovimiento, 'id_tipo_movimiento'> = {
            tipo_movimiento: String(values.tipo_movimiento),
            fecha_creacion: String(values.fecha_creacion),
            fecha_modificacion: new Date().toISOString().split('T')[0],
            estado: estado
          };
          
          console.log('Creando nuevo tipo de movimiento:', createData);
          await crearTipoMovimiento(createData);
          setSuccessAlertText('El tipo de movimiento fue creado correctamente.');
          setShowSuccessAlert(true);
          setTimeout(() => setShowSuccessAlert(false), 3000);
        }
      } catch (error) {
        console.error('Error al guardar:', error);
        setAlert({
          isOpen: true,
          title: 'Error',
          message: `Error al ${editingId ? 'actualizar' : 'crear'} el tipo de movimiento: ${error instanceof Error ? error.message : 'Error desconocido'}`,
          onConfirm: () => setAlert(a => ({ ...a, isOpen: false })),
        });
        return;
      }
      
      // Cerrar modal y limpiar estado
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      console.error("Error al guardar el tipo de movimiento:", error);
      setAlert({
        isOpen: true,
        title: 'Error',
        message: 'Ocurrió un error al guardar el tipo de movimiento.',
        onConfirm: () => setAlert(a => ({ ...a, isOpen: false })),
      });
    }
  };

  // Cambiar el estado (activo/inactivo) de un tipo de movimiento
  const handleToggleEstado = async (tipoMovimiento: TipoMovimiento) => {
    try {
      // Preparar los datos para actualizar solo el estado
      const updateData: Partial<TipoMovimiento> = {
        estado: !tipoMovimiento.estado, // Invertir el estado actual
        fecha_modificacion: new Date().toISOString().split('T')[0]
      };
      
      console.log(`Cambiando estado de tipo de movimiento ${tipoMovimiento.id_tipo_movimiento} a ${!tipoMovimiento.estado ? 'Activo' : 'Inactivo'}`);
      await actualizarTipoMovimiento(tipoMovimiento.id_tipo_movimiento, updateData);
      setSuccessAlertText(`El tipo de movimiento fue ${!tipoMovimiento.estado ? 'activado' : 'desactivado'} correctamente.`);
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    } catch (error) {
      console.error('Error al cambiar el estado:', error);
      setAlert({
        isOpen: true,
        title: 'Error',
        message: `Error al cambiar el estado del tipo de movimiento: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        onConfirm: () => setAlert(a => ({ ...a, isOpen: false })),
      });
    }
  };

  // La función confirmDelete ha sido eliminada ya que no se utiliza más

  // Abrir modal para crear nuevo tipo de movimiento
  const handleCreate = () => {
    // Inicializar con fechas actuales
    const today = new Date().toISOString().split('T')[0];
    setFormData({
      fecha_creacion: today,
      fecha_modificacion: today,
      estado: true
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
    <div className="flex h-screen" style={{ backgroundColor: '#ECF5FF' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          {/* Alerta de éxito */}
          {showSuccessAlert && (
            <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50 animate-fade-in-out">
              {successAlertText}
            </div>
          )}

          <h1 className="text-xl font-bold mb-4">Gestión de Tipos de Movimiento</h1>

          <Boton
            onPress={handleCreate}
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
                    fecha_modificacion: formData.fecha_modificacion || '',
                    estado: formData.estado !== undefined ? formData.estado : true
                  }}
                />
              </div>
            </div>
          )}

          {/* Diálogo de alerta para errores */}
          <AlertDialog
            isOpen={alert.isOpen}
            title={alert.title}
            message={alert.message}
            onConfirm={alert.onConfirm}
            onCancel={() => setAlert(a => ({ ...a, isOpen: false }))}
          />

          {/* El diálogo de confirmación para eliminar ha sido eliminado */}
        </main>
      </div>
    </div>
  );
};

export default TiposMovimiento;
