import { useState } from "react";
import { useGetTiposSitio, usePostTipoSitio, usePutTipoSitio } from '@/hooks/tipoSitio';
import type { TipoSitio } from '@/types';
import { AnimatedContainer, Botton, showSuccessToast, showErrorToast } from "@/components/atomos";
import { createEntityTable, Form, Modal } from "@/components/organismos";
import type { Column, FormField } from "@/components/organismos";
import { tipoSitioSchema } from '@/schemas';

interface TiposSitioProps {
  isInModal?: boolean;
  onTipoSitioCreated?: () => void;
}

const TiposSitio = ({ isInModal = false, onTipoSitioCreated }: TiposSitioProps) => {
  const { tiposSitio, loading } = useGetTiposSitio();
  const { crearTipoSitio } = usePostTipoSitio();
  const { actualizarTipoSitio } = usePutTipoSitio();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [textoBoton] = useState();

  const columns: Column<TipoSitio>[] = [
    { key: "nombre_tipo_sitio", label: "Nombre del Tipo de Sitio", filterable: true },
    { key: "fecha_creacion", label: "Fecha de Creación", filterable: true },
    { key: "fecha_modificacion", label: "Fecha de Modificación", filterable: true },
  ];


  const formFieldsCreate: FormField[] = [
    { key: "nombre_tipo_sitio", label: "Nombre del Tipo de Sitio", type: "text", required: true }
  ];
  const formFieldsEdit: FormField[] = [
    { key: "nombre_tipo_sitio", label: "Nombre del Tipo de Sitio", type: "text", required: true }
  ];


  const handleSubmit = async (values: Record<string, string>) => {
    try {
      const currentDate = new Date().toISOString();

      if (editingId) {
        const updatePayload = {
          id_tipo_sitio: editingId,
          nombre_tipo_sitio: values.nombre_tipo_sitio,
          estado: true,
          fecha_creacion: values.fecha_creacion || currentDate,
          fecha_modificacion: currentDate,
        } as TipoSitio;

        await actualizarTipoSitio(editingId, updatePayload);
        showSuccessToast('Tipo de sitio actualizado con éxito');
      } else {
        const createPayload = {
          nombre_tipo_sitio: values.nombre_tipo_sitio,
          estado: true,
          fecha_creacion: currentDate,
          fecha_modificacion: currentDate,
        } as TipoSitio;

        await crearTipoSitio(createPayload);
        showSuccessToast('Tipo de sitio creado con éxito');

        if (onTipoSitioCreated) {
          onTipoSitioCreated();
        }
      }

      if (!isInModal) {
        setIsModalOpen(false);
      }
      setFormData({});
      setEditingId(null);
    } catch (error) {
      showErrorToast('Error al guardar el tipo de sitio');
    }
  };

  const handleToggleEstado = async (tipoSitio: TipoSitio) => {
    try {
      const nuevoEstado = !tipoSitio.estado;
      const updateData = {
        id_tipo_sitio: tipoSitio.id_tipo_sitio,
        nombre_tipo_sitio: tipoSitio.nombre_tipo_sitio,
        estado: nuevoEstado,
        fecha_modificacion: new Date().toISOString()
      } as TipoSitio;

      await actualizarTipoSitio(tipoSitio.id_tipo_sitio, updateData);
      showSuccessToast(`El tipo de sitio fue ${nuevoEstado ? 'activado' : 'desactivado'} correctamente.`);
    } catch (error) {
      showErrorToast("Error al cambiar el estado del tipo de sitio.");
    }
  };

  const handleCreate = () => {
    setFormData({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (tipoSitio: TipoSitio) => {
    setFormData({
      nombre_tipo_sitio: tipoSitio.nombre_tipo_sitio,
    });
    setEditingId(tipoSitio.id_tipo_sitio);
    setIsModalOpen(true);
  };

  if (isInModal) {
    return (
      <div className="w-full">
        <Form
          fields={formFieldsCreate}
          onSubmit={async (values) => {
            try {
              const currentDate = new Date().toISOString();
              const createPayload = {
                nombre_tipo_sitio: values.nombre_tipo_sitio,
                estado: true,
                fecha_creacion: currentDate,
                fecha_modificacion: currentDate,
              } as TipoSitio;

              await crearTipoSitio(createPayload);
              showSuccessToast('Tipo de sitio creado con éxito');
              if (onTipoSitioCreated) {
                onTipoSitioCreated();
              }
            } catch (error) {
              showErrorToast('Error al crear el tipo de sitio');
            }
          }}
          buttonText="Crear"
          schema={tipoSitioSchema}
        />
      </div>
    );
  }

  return (
    <AnimatedContainer>
      <div className="w-full">
        <h1 className="text-xl font-bold mb-4">Gestión de Tipos de Sitio</h1>

        <Botton className="mb-4" onClick={handleCreate} texto="Crear Nuevo Tipo de Sitio">
          {textoBoton}
        </Botton>

        {loading ? (
          <p>Cargando tipos de sitio...</p>
        ) : (
          <div className="w-full">
            {createEntityTable({
              columns: columns as Column<any>[],
              data: tiposSitio,
              idField: 'id_tipo_sitio',
              handlers: {
                onToggleEstado: handleToggleEstado,
                onEdit: handleEdit
              }
            })}
          </div>)}

        {/* Modal para crear/editar tipo de sitio usando el modal global */}
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => {
            setIsModalOpen(false);
            setFormData({});
            setEditingId(null);
          }} 
          title={editingId ? "Editar Tipo de Sitio" : "Crear Nuevo Tipo de Sitio"}
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
            schema={tipoSitioSchema}
          />
        </Modal>
      </div>
    </AnimatedContainer>
  );
};

export default TiposSitio;
