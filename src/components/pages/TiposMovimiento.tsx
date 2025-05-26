import { useState } from 'react';
import { Pencil } from 'lucide-react';
import { Alert } from "@heroui/react";
import { useGetTiposMovimiento } from '@/hooks/tipoMovimiento/useGetTiposMovimiento';
import { usePostTipoMovimiento } from '@/hooks/tipoMovimiento/usePostTipoMovimiento';
import { usePutTipoMovimiento } from '@/hooks/tipoMovimiento/usePutTipoMovimiento';
import Boton from "@/components/atomos/Boton";
import Toggle from "@/components/atomos/Toggle";
import { TipoMovimiento } from '@/types/tipoMovimiento';
import GlobalTable, { Column } from "@/components/organismos/Table";
import Form, { FormField } from "@/components/organismos/Form";
import { tipoMovimientoSchema } from '@/schemas/tipoMovimiento.schema';

const TiposMovimiento = () => {
  const { tiposMovimiento, loading } = useGetTiposMovimiento();
  const { crearTipoMovimiento } = usePostTipoMovimiento();
  const { actualizarTipoMovimiento } = usePutTipoMovimiento();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<TipoMovimiento>>({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successAlertText, setSuccessAlertText] = useState('');
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorAlertText, setErrorAlertText] = useState('');

  const columns: Column<TipoMovimiento & { key: number }>[] = [
    { key: "id_tipo_movimiento", label: "ID", filterable: true },
    { key: "tipo_movimiento", label: "Tipo de Movimiento", filterable: true },
    { key: "fecha_creacion", label: "Fecha de Creación", filterable: true },
    { key: "fecha_modificacion", label: "Fecha de Modificación", filterable: true },
    {
      key: "estado",
      label: "Estado",
      filterable: true,
      render: (tipoMovimiento) => (
        <Toggle 
          isOn={tipoMovimiento.estado || false} 
          onToggle={() => handleToggleEstado(tipoMovimiento)}
        />
      ),
    },
    {
      key: "acciones",
      label: "Acciones",
      render: (tipoMovimiento) => (
        <div className="flex gap-2">
          <Boton
            onClick={() => handleEdit(tipoMovimiento)}
            className="bg-yellow-500 text-white px-2 py-1 flex items-center justify-center"
            aria-label="Editar"
          >
            <Pencil size={18} />
          </Boton>
        </div>
      ),
    },
  ];
 
  const formFieldsCreate: FormField[] = [
    { key: "tipo_movimiento", label: "Tipo de Movimiento", type: "text", required: true },
    { key: "fecha_creacion", label: "Fecha de Creación", type: "date", required: true },
  ];

  const formFieldsEdit: FormField[] = [
    { key: "tipo_movimiento", label: "Tipo de Movimiento", type: "text", required: true },
    { key: "fecha_modificacion", label: "Fecha de Modificación", type: "date", required: true },
  ];

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      const parsed = tipoMovimientoSchema.safeParse(values);
      if (!parsed.success) {
        setSuccessAlertText(parsed.error.errors.map(e => e.message).join('\n'));
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
        return;
      }
      
      const hoy = new Date().toISOString().slice(0, 10);
      if (editingId) {
        const payload = {
          tipo_movimiento: String(values.tipo_movimiento),
          estado: true,
          fecha_modificacion: hoy,
        };
        
        await actualizarTipoMovimiento(editingId, payload);
        setSuccessAlertText('Tipo de movimiento actualizado con éxito');
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
      } else {
        // Para creación, preparar todos los datos necesarios
        const payload = {
          tipo_movimiento: String(values.tipo_movimiento),
          fecha_creacion: String(values.fecha_creacion),
          fecha_modificacion: new Date().toISOString().split('T')[0],
          estado: true
        };
        await crearTipoMovimiento(payload);
        setSuccessAlertText('Tipo de movimiento creado con éxito');
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
      }
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      setErrorAlertText("Ocurrió un error al guardar el tipo de movimiento.");
      setShowErrorAlert(true);
      setTimeout(() => setShowErrorAlert(false), 3000);
    }
  };

  const handleToggleEstado = async (tipoMovimiento: TipoMovimiento) => {
    try {
      const nuevoEstado = !tipoMovimiento.estado;

      const updateData = {
        id_tipo_movimiento: tipoMovimiento.id_tipo_movimiento,
        estado: nuevoEstado,
        fecha_modificacion: new Date().toISOString().split('T')[0]
      };
      
      await actualizarTipoMovimiento(tipoMovimiento.id_tipo_movimiento, updateData);
      setSuccessAlertText(`El tipo de movimiento fue ${nuevoEstado ? 'activado' : 'desactivado'} correctamente.`);
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    } catch (error) {
      setErrorAlertText("Error al cambiar el estado del tipo de movimiento.");
      setShowErrorAlert(true);
      setTimeout(() => setShowErrorAlert(false), 3000);
    }
  };

  const handleCreate = () => {
    setFormData({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (tipoMovimiento: TipoMovimiento) => {    
    setFormData(tipoMovimiento);
    setEditingId(tipoMovimiento.id_tipo_movimiento);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="w-full">
        <h1 className="text-xl font-bold mb-4">Gestión de Tipos de Movimiento</h1>

        <Boton
          onClick={handleCreate}
          className="bg-blue-500 text-white px-4 py-2 mb-4"
        >
          Crear Nuevo Tipo de Movimiento
        </Boton>

        {loading ? (
          <p>Cargando tipos de movimiento...</p>
        ) : (
          <GlobalTable 
            columns={columns as Column<any>[]} 
            data={tiposMovimiento
              .map(tm => ({ ...tm, key: tm.id_tipo_movimiento }))
              .sort((a, b) => {
                if (a.estado === b.estado) return 0;
                return a.estado ? -1 : 1;
              })
            }
            rowsPerPage={6}
            defaultSortColumn="estado"
            defaultSortDirection="desc"
          />
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="p-6 rounded-lg shadow-lg w-full max-h-[90vh] overflow-y-auto relative">
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
                fields={editingId ? formFieldsEdit : formFieldsCreate}
                onSubmit={handleSubmit}
                buttonText={editingId ? "Actualizar" : "Crear"}
                initialValues={{
                  ...Object.entries(formData).reduce((acc, [key, value]) => {
                    acc[key] = value !== undefined ? String(value) : '';
                    return acc;
                  }, {} as Record<string, string>),
                }}
                schema={tipoMovimientoSchema}
              />
            </div>
          </div> 
        )}
      </div>

      {showSuccessAlert && (
        <div className="fixed top-4 right-4 z-50">
          <Alert
            hideIconWrapper
            color="success"
            description={successAlertText}
            title="¡Éxito!"
            variant="solid"
            onClose={() => setShowSuccessAlert(false)}
          />
        </div>
      )}
      
      {showErrorAlert && (
        <div className="fixed top-4 right-4 z-50">
          <Alert
            hideIconWrapper
            color="danger"
            description={errorAlertText}
            title="Error"
            variant="solid"
            onClose={() => setShowErrorAlert(false)}
          />
        </div>
      )}
    </>
  );
};

export default TiposMovimiento;
