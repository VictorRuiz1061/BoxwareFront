import { useState } from "react";
import { useGetTiposMovimiento, usePostTipoMovimiento, usePutTipoMovimiento } from '@/hooks/tipoMovimiento';
import type { TipoMovimiento } from '@/types';
import { AnimatedContainer, Botton, showSuccessToast, showErrorToast } from "@/components/atomos";
import { createEntityTable, Form, Modal } from "@/components/organismos";
import type { Column, FormField } from "@/components/organismos";
import { tipoMovimientoSchema } from '@/schemas';

const TiposMovimiento = () => {
  const { tiposMovimiento, loading } = useGetTiposMovimiento();
  const { crearTipoMovimiento } = usePostTipoMovimiento();
  const { actualizarTipoMovimiento } = usePutTipoMovimiento();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [textoBoton] = useState();

  const columns: Column<TipoMovimiento>[] = [
    { key: "tipo_movimiento", label: "Tipo de Movimiento", filterable: true },
    { key: "estado", label: "Estado", filterable: true },
    { key: "fecha_creacion", label: "Fecha de Creación", filterable: true },
    { key: "fecha_modificacion", label: "Fecha de Modificación", filterable: true },
  ];

  const formFieldsCreate: FormField[] = [
    { key: "tipo_movimiento", label: "Tipo de Movimiento", type: "text", required: true }
  ];

  const formFieldsEdit: FormField[] = [
    { key: "tipo_movimiento", label: "Tipo de Movimiento", type: "text", required: true }
  ];

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      const currentDate = new Date().toISOString();
      
      if (editingId) {
        const original = tiposMovimiento.find(t => t.id_tipo_movimiento === editingId);
        if (!original) {
          throw new Error('No se encontró el tipo de movimiento original');
        }
        
        const updatePayload = {
          id_tipo_movimiento: editingId,
          tipo_movimiento: values.tipo_movimiento,
          estado: true,
          fecha_modificacion: currentDate,
          fecha_creacion: original.fecha_creacion
        } as TipoMovimiento;
        
        await actualizarTipoMovimiento(editingId, updatePayload);
        showSuccessToast('Tipo de movimiento actualizado con éxito');
      } else {
        const createPayload = {
          id_tipo_movimiento: 0, // Este valor será reemplazado por el backend
          tipo_movimiento: values.tipo_movimiento,
          estado: true,
          fecha_creacion: currentDate,
          fecha_modificacion: currentDate
        } as TipoMovimiento;

        await crearTipoMovimiento(createPayload);
        showSuccessToast('Tipo de movimiento creado con éxito');
      }
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      showErrorToast('Error al guardar el tipo de movimiento');
    }
  };

  const handleToggleEstado = async (tipoMovimiento: TipoMovimiento) => {
    try {
      const nuevoEstado = !tipoMovimiento.estado;
      const updateData = {
        id_tipo_movimiento: tipoMovimiento.id_tipo_movimiento,
        tipo_movimiento: tipoMovimiento.tipo_movimiento,
        estado: nuevoEstado,
        fecha_modificacion: new Date().toISOString(),
        fecha_creacion: tipoMovimiento.fecha_creacion
      } as TipoMovimiento;

      await actualizarTipoMovimiento(tipoMovimiento.id_tipo_movimiento, updateData);
      showSuccessToast(`El tipo de movimiento fue ${nuevoEstado ? 'activado' : 'desactivado'} correctamente.`);
    } catch (error) {
      showErrorToast("Error al cambiar el estado del tipo de movimiento.");
    }
  };

  const handleCreate = () => {
    setFormData({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (tipoMovimiento: TipoMovimiento) => {
    setFormData({
      tipo_movimiento: tipoMovimiento.tipo_movimiento,
    });
    setEditingId(tipoMovimiento.id_tipo_movimiento);
    setIsModalOpen(true);
  };

  return (
    <AnimatedContainer>
      <div className="w-full">
          <h1 className="text-xl font-bold mb-4">Gestión de Tipos de Movimiento</h1>
      
            <Botton className="mb-4" onClick={handleCreate} texto="Crear Nuevo Tipo de Movimiento">
              {textoBoton}
            </Botton>

        {loading ? (
          <p>Cargando tipos de movimiento...</p>
        ) : (
          <div className="w-full">
            {createEntityTable({
              columns: columns as Column<any>[],
              data: tiposMovimiento,
              idField: 'id_tipo_movimiento',
              handlers: {
                onToggleEstado: handleToggleEstado,
                onEdit: handleEdit
              }
            })}
          </div>
        )}

        {/* Modal para crear/editar tipo de movimiento usando el modal global */}
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => {
            setIsModalOpen(false);
            setFormData({});
            setEditingId(null);
          }} 
          title={editingId ? "Editar Tipo de Movimiento" : "Crear Nuevo Tipo de Movimiento"}
        >
          <Form
            fields={editingId ? formFieldsEdit : formFieldsCreate}
            onSubmit={handleSubmit}
            buttonText={editingId ? "Actualizar" : "Crear"}
            initialValues={formData}
            schema={tipoMovimientoSchema}
          />
        </Modal>
      </div>
    </AnimatedContainer>
  );
};

export default TiposMovimiento;
