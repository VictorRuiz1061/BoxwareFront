import { useState } from 'react';
import { Pencil } from 'lucide-react';
import { movimientoSchema } from '@/schemas/movimiento.schema';
import { useGetMovimientos } from '@/hooks/movimiento/useGetMovimientos';
import { usePostMovimiento } from '@/hooks/movimiento/usePostMovimiento';
import { usePutMovimiento } from '@/hooks/movimiento/usePutMovimiento';
import { Movimiento } from '@/types/movimiento';
import { useGetUsuarios } from '@/hooks/usuario/useGetUsuarios';
import { useGetTiposMovimiento } from '@/hooks/tipoMovimiento/useGetTiposMovimiento';
import AlertDialog from '@/components/atomos/AlertDialog';
import Boton from "@/components/atomos/Boton";
import ToggleEstadoBoton from "@/components/atomos/ToggleEstadoBoton";
import SuccessAlert from "@/components/atomos/SuccessAlert";
import Sidebar from "@/components/organismos/Sidebar";
import Header from "@/components/organismos/Header";
import GlobalTable, { Column } from "@/components/organismos/Table";
import Form, { FormField } from "@/components/organismos/Form";

const Movimientos = () => {
  const { movimientos, loading } = useGetMovimientos();
  const { crearMovimiento } = usePostMovimiento();
  const { actualizarMovimiento } = usePutMovimiento();
  const fetchMovimientos = () => {}; // Placeholder for fetchMovimientos function
  const { usuarios } = useGetUsuarios();
  const { tiposMovimiento } = useGetTiposMovimiento();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Movimiento>>({});
  const [alert, setAlert] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => setAlert(a => ({ ...a, isOpen: false })),
  });
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const columns: Column<Movimiento & { key: any }>[] = [
    { key: "id_movimiento", label: "ID", filterable: true },
    { key: "fecha_creacion", label: "Fecha de Creación", filterable: true },
    { key: "fecha_modificacion", label: "Fecha de Modificación", filterable: true },
    {
      key: "usuario_id",
      label: "Usuario",
      filterable: true,
      render: (movimiento) => {
        const usuario = usuarios.find(u => u.id_usuario === movimiento.usuario_id);
        return usuario ? `${usuario.nombre} ${usuario.apellido}` : movimiento.usuario_id;
      }
    },
    {
      key: "tipo_movimiento",
      label: "Tipo de Movimiento",
      filterable: true,
      render: (movimiento) => {
        const tipo = tiposMovimiento.find(t => t.id_tipo_movimiento === movimiento.tipo_movimiento);
        return tipo ? tipo.tipo_movimiento : movimiento.tipo_movimiento;
      }
    },
    {
      key: "estado",
      label: "Estado",
      render: (movimiento) => (
        <div className="flex items-center justify-center">
          {movimiento.estado ? 
            <span className="text-green-500 font-medium">Activo</span> : 
            <span className="text-red-500 font-medium">Inactivo</span>
          }
        </div>
      ),
    },
    {
      key: "acciones",
      label: "Acciones",
      render: (movimiento) => (
        <div className="flex gap-2">
          <Boton
            onPress={() => handleEdit(movimiento)}
            className="bg-yellow-500 text-white px-2 py-1 flex items-center justify-center"
            aria-label="Editar"
          >
            <Pencil size={18} />
          </Boton>
          <ToggleEstadoBoton
            estado={movimiento.estado}
            onToggle={() => handleToggleEstado(movimiento)}
            size={18}
          />
        </div>
      ),
    },
  ];

  // Definir campos del formulario dinámicamente
  const formFields: FormField[] = [
    {
      key: "usuario_id",
      label: "Usuario",
      type: "select",
      required: true,
      options: usuarios.map(u => ({ value: u.id_usuario, label: `${u.nombre} ${u.apellido}` }))
    },
    {
      key: "tipo_movimiento",
      label: "Tipo de Movimiento",
      type: "select",
      required: true,
      options: tiposMovimiento.map(t => ({ value: t.id_tipo_movimiento, label: t.tipo_movimiento }))
    },
    { key: "fecha_creacion", label: "Fecha de Creación", type: "date", required: true },
    { key: "fecha_modificacion", label: "Fecha de Modificación", type: "date", required: true },
    { key: "estado", label: "Estado", type: "checkbox", required: false },
  ];

  // Crear o actualizar movimiento
  const handleSubmit = async (values: Record<string, string | number | boolean>) => {
    try {
      // Validar con zod
      const parsedValues = {
        ...values,
        usuario_id: typeof values.usuario_id === 'string' 
          ? parseInt(values.usuario_id as string, 10) 
          : values.usuario_id as number,
        tipo_movimiento: typeof values.tipo_movimiento === 'string' 
          ? parseInt(values.tipo_movimiento as string, 10) 
          : values.tipo_movimiento as number,
      };
      
      const parsed = movimientoSchema.safeParse(parsedValues);
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
      const estado = typeof values.estado === 'boolean' ? values.estado : Boolean(values.estado);
      
      try {
        if (editingId) {
          // Para actualización, preparar los datos necesarios
          const updateData: Partial<Movimiento> = {
            usuario_id: parsedValues.usuario_id,
            tipo_movimiento: parsedValues.tipo_movimiento,
            fecha_modificacion: new Date().toISOString().split('T')[0],
            estado: estado
          };
          
          console.log('Actualizando movimiento:', editingId, updateData);
          await actualizarMovimiento(editingId, updateData);
          setSuccessMessage('El movimiento fue actualizado correctamente.');
          setShowSuccessAlert(true);
          fetchMovimientos(); // Actualizar la lista de movimientos
        } else {
          // Para creación, preparar todos los datos necesarios
          const createData: Omit<Movimiento, 'id_movimiento'> = {
            usuario_id: parsedValues.usuario_id,
            tipo_movimiento: parsedValues.tipo_movimiento,
            fecha_creacion: String(values.fecha_creacion),
            fecha_modificacion: new Date().toISOString().split('T')[0],
            estado: estado
          };
          
          console.log('Creando nuevo movimiento:', createData);
          await crearMovimiento(createData);
          setSuccessMessage('El movimiento fue creado correctamente.');
          setShowSuccessAlert(true);
          fetchMovimientos(); // Actualizar la lista de movimientos
        }
      } catch (error) {
        console.error('Error al guardar:', error);
        setAlert({
          isOpen: true,
          title: 'Error',
          message: `Error al ${editingId ? 'actualizar' : 'crear'} el movimiento: ${error instanceof Error ? error.message : 'Error desconocido'}`,
          onConfirm: () => setAlert(a => ({ ...a, isOpen: false })),
        });
        return;
      }
      
      // Cerrar modal y limpiar estado
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      console.error("Error al guardar el movimiento:", error);
      setAlert({
        isOpen: true,
        title: 'Error',
        message: 'Ocurrió un error al guardar el movimiento.',
        onConfirm: () => setAlert(a => ({ ...a, isOpen: false })),
      });
    }
  };

  // Cambiar el estado (activo/inactivo) de un movimiento
  const handleToggleEstado = async (movimiento: Movimiento) => {
    try {
      // Preparar los datos para actualizar solo el estado
      const nuevoEstado = !movimiento.estado;
      const updateData: Partial<Movimiento> = {
        estado: nuevoEstado,
        fecha_modificacion: new Date().toISOString().split('T')[0]
      };
      
      console.log(`Cambiando estado de movimiento ${movimiento.id_movimiento} a ${nuevoEstado ? 'Activo' : 'Inactivo'}`);
      await actualizarMovimiento(movimiento.id_movimiento, updateData);
      setSuccessMessage(`El movimiento fue ${nuevoEstado ? 'activado' : 'desactivado'} correctamente.`);
      setShowSuccessAlert(true);
      fetchMovimientos(); // Actualizar la lista de movimientos
    } catch (error) {
      console.error('Error al cambiar el estado:', error);
      setAlert({
        isOpen: true,
        title: 'Error',
        message: `Error al cambiar el estado del movimiento: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        onConfirm: () => setAlert(a => ({ ...a, isOpen: false })),
      });
    }
  };

  // Abrir modal para crear nuevo movimiento
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

  // Abrir modal para editar movimiento existente
  const handleEdit = (movimiento: Movimiento) => {
    // Convertir fechas a formato string para los inputs date
    const formattedMovimiento = {
      ...movimiento,
      fecha_creacion: movimiento.fecha_creacion ? movimiento.fecha_creacion.split('T')[0] : '',
      fecha_modificacion: new Date().toISOString().split('T')[0],
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
          {/* Alerta de éxito */}
          {showSuccessAlert && (
            <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50 animate-fade-in-out">
              {successMessage}
            </div>
          )}

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
              data={movimientos.map((m: Movimiento) => ({ ...m, key: m.id_movimiento }))} 
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
                    usuario_id: formData.usuario_id || '',
                    tipo_movimiento: formData.tipo_movimiento || '',
                    estado: formData.estado
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

          {/* Diálogo de alerta para errores */}
          <AlertDialog
            isOpen={alert.isOpen}
            title={alert.title}
            message={alert.message}
            onConfirm={alert.onConfirm}
            onCancel={() => setAlert(a => ({ ...a, isOpen: false }))}
          />
        </main>
      </div>
    </div>
  );
};

export default Movimientos;
