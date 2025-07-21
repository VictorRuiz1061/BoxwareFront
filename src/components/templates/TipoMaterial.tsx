import { useState } from "react";
import { useGetTipoMateriales, usePostTipoMaterial, usePutTipoMaterial } from '@/hooks/tipoMaterial';
import type { TipoMaterial as TipoMaterialType } from '@/types';
import { AnimatedContainer, Botton, showSuccessToast, showErrorToast } from "@/components/atomos";
import { createEntityTable, Form, Modal } from "@/components/organismos";
import type { Column, FormField } from "@/components/organismos";
import { tipoMaterialSchema } from '@/schemas';

interface TipoMaterialProps {
  isInModal?: boolean;
  onTipoMaterialCreated?: () => void;
}

const TipoMaterial = ({ isInModal, onTipoMaterialCreated }: TipoMaterialProps) => {
  const { tipoMateriales, loading } = useGetTipoMateriales();
  const { crearTipoMaterial } = usePostTipoMaterial();
  const { actualizarTipoMaterial } = usePutTipoMaterial();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [textoBoton] = useState();

  const columns: Column<TipoMaterialType>[] = [
    { key: "tipo_elemento", label: "Tipo de Elemento", filterable: true },
    { key: "fecha_creacion", label: "Fecha de Creación", filterable: true },
    { key: "fecha_modificacion", label: "Fecha de Modificación", filterable: true },
  ];

  const formFieldsCreate: FormField[] = [
    { key: "tipo_elemento", label: "Tipo de Elemento", type: "text", required: true }
  ];
  const formFieldsEdit: FormField[] = [
    { key: "tipo_elemento", label: "Tipo de Elemento", type: "text", required: true }
  ];

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      const currentDate = new Date().toISOString();
      
      if (editingId) {
        const original = tipoMateriales.find((t: TipoMaterialType) => t.id_tipo_material === editingId);
        const updatePayload: Partial<TipoMaterialType> = {
          id_tipo_material: editingId,
          tipo_elemento: values.tipo_elemento,
          estado: true,
          fecha_modificacion: currentDate,
          fecha_creacion: original?.fecha_creacion || currentDate
        };
        await actualizarTipoMaterial(editingId, updatePayload);
        showSuccessToast('Tipo de material actualizado con éxito');
      } else {
        const createPayload: Omit<TipoMaterialType, 'id_tipo_material'> = {
          tipo_elemento: values.tipo_elemento,
          estado: true,
          fecha_creacion: currentDate,
          fecha_modificacion: currentDate
        };
        await crearTipoMaterial(createPayload);
        showSuccessToast('Tipo de material creado con éxito');
        
        // Si estamos en modo modal y hay callback, lo llamamos
        if (isInModal && onTipoMaterialCreated) {
          onTipoMaterialCreated();
        }
      }
      
      if (!isInModal) {
        setIsModalOpen(false);
        setFormData({});
        setEditingId(null);
      }
    } catch (error) {
      showErrorToast('Error al guardar el tipo de material');
    }
  };

  const handleToggleEstado = async (tipoMaterial: TipoMaterialType) => {
    try {
      const nuevoEstado = !tipoMaterial.estado;
      const updateData = {
        id_tipo_material: tipoMaterial.id_tipo_material,
        tipo_elemento: tipoMaterial.tipo_elemento,
        estado: nuevoEstado,
        fecha_modificacion: new Date().toISOString()
      } as TipoMaterialType;

      await actualizarTipoMaterial(tipoMaterial.id_tipo_material, updateData);
      showSuccessToast(`El tipo de material fue ${nuevoEstado ? 'activado' : 'desactivado'} correctamente.`);
    } catch (error) {
      showErrorToast("Error al cambiar el estado del tipo de material.");
    }
  };

  const handleCreate = () => {
    setFormData({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (tipoMaterial: TipoMaterialType) => {
    setFormData({
      tipo_elemento: tipoMaterial.tipo_elemento,
    });
    setEditingId(tipoMaterial.id_tipo_material);
    setIsModalOpen(true);
  };

  return (
    <AnimatedContainer>
      <div className="w-full">
        {!isInModal && (
          <>
            <h1 className="text-xl font-bold mb-4">Gestión de Tipos de Material</h1>
            
            <Botton className="mb-4" onClick={handleCreate} texto="Crear Nuevo Tipo de Material">
              {textoBoton}
            </Botton> 

            {loading ? (
              <p>Cargando tipos de material...</p>
            ) : (
              <div className="w-full">
                {createEntityTable({
                  columns: columns as Column<any>[],
                  data: tipoMateriales,
                  idField: 'id_tipo_material',
                  handlers: {
                    onToggleEstado: handleToggleEstado,
                    onEdit: handleEdit
                  }
                })}
              </div>
            )}
          </>
        )}

        {/* Modal para crear/editar tipo de material usando el modal global */}
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => {
            setIsModalOpen(false);
            setFormData({});
            setEditingId(null);
          }} 
          title={editingId ? "Editar Tipo de Material" : "Crear Nuevo Tipo de Material"}
        >
          <Form
            fields={editingId ? formFieldsEdit : formFieldsCreate}
            onSubmit={handleSubmit}
            buttonText={editingId ? "Actualizar" : "Crear"}
            initialValues={{
              ...formData,
              ...(editingId 
                ? { fecha_modificacion: new Date().toISOString().split('T')[0] }
                : { fecha_creacion: new Date().toISOString().split('T')[0] })
            }}
            schema={tipoMaterialSchema}
          />
        </Modal>
      </div>
    </AnimatedContainer>
  );
};

export default TipoMaterial;
