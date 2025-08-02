import { useState } from "react";
import { useGetSitios, usePostSitio, usePutSitio } from '@/hooks/sitio';
import { useGetTiposSitio } from '@/hooks/tipoSitio';
import type { Sitio as SitioType } from '@/types';
import { AnimatedContainer, Botton, showSuccessToast, showErrorToast } from "@/components/atomos";
import { createEntityTable, Form, Modal } from "@/components/organismos";
import type { Column, FormField } from "@/components/organismos";
import { sitioSchema } from '@/schemas';
import TiposSitio from './TiposSitio';

interface SitioProps {
  isInModal?: boolean;
  onSitioCreated?: () => void;
}

const Sitio = ({ isInModal = false }: SitioProps) => {
  const { sitios, loading } = useGetSitios();
  const { crearSitio } = usePostSitio();
  const { actualizarSitio } = usePutSitio();
  const { tiposSitio } = useGetTiposSitio();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTipoSitioModalOpen, setIsTipoSitioModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [textoBoton] = useState();

  const columns: Column<SitioType>[] = [
    { key: "nombre_sitio", label: "Nombre del Sitio", filterable: true },
    { key: "ubicacion", label: "Ubicación", filterable: true },
    { key: "ficha_tecnica", label: "Ficha Técnica", filterable: true },
    { key: "tipo_sitio_id", label: "Tipo de Sitio", filterable: true },
    { key: "fecha_creacion", label: "Fecha de Creación", filterable: true },
    { key: "fecha_modificacion", label: "Fecha de Modificación", filterable: true },
  ];

  const formFieldsCreate: FormField[] = [
    { key: "nombre_sitio", label: "Nombre del Sitio", type: "text", required: true },
    { key: "ubicacion", label: "Ubicación", type: "text", required: true },
    { key: "ficha_tecnica", label: "Ficha Técnica", type: "text", required: true },
    {
      key: "tipo_sitio_id",
      label: "Tipo de Sitio",
      type: "select",
      required: true,
      options: tiposSitio.map(tipo => ({ label: tipo.nombre_tipo_sitio, value: tipo.id_tipo_sitio })),
      extraButton: {
        icon: "+",
        onClick: () => setIsTipoSitioModalOpen(true),
      }
    }
  ];

  const formFieldsEdit: FormField[] = [
    { key: "nombre_sitio", label: "Nombre del Sitio", type: "text", required: true },
    { key: "ubicacion", label: "Ubicación", type: "text", required: true },
    { key: "ficha_tecnica", label: "Ficha Técnica", type: "text", required: true },
    {
      key: "tipo_sitio_id",
      label: "Tipo de Sitio",
      type: "select",
      required: true,
      options: tiposSitio.map(tipo => ({ label: tipo.nombre_tipo_sitio, value: tipo.id_tipo_sitio })),
      extraButton: {
        icon: "+",
        onClick: () => setIsTipoSitioModalOpen(true),
      }
    }
  ];

  const handleSubmit = async (values: Record<string, any>) => {
    try {
      const currentDate = new Date().toISOString();
      const tipo_sitio_id = parseInt(values.tipo_sitio_id);

      if (editingId) {
        const updatePayload = {
          id_sitio: editingId,
          nombre_sitio: values.nombre_sitio,
          ubicacion: values.ubicacion,
          ficha_tecnica: values.ficha_tecnica,
          tipo_sitio_id: tipo_sitio_id,
          estado: true,
          fecha_modificacion: currentDate,
        };

        await actualizarSitio(editingId, updatePayload as any);
        showSuccessToast('Sitio actualizado con éxito');
      } else {
        const createPayload = {
          nombre_sitio: values.nombre_sitio,
          ubicacion: values.ubicacion,
          ficha_tecnica: values.ficha_tecnica,
          tipo_sitio_id: tipo_sitio_id,
          estado: true,
          fecha_creacion: currentDate,
          fecha_modificacion: currentDate
        };

        await crearSitio(createPayload as any);
        showSuccessToast('Sitio creado con éxito');
        if (onSitioCreated) {
          onSitioCreated();
        }
      }
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      showErrorToast('Error al guardar el centro');
    }
  };

  const handleToggleEstado = async (sitio: SitioType) => {
    try {
      const nuevoEstado = !sitio.estado;
      const updateData = {
        id_sitio: sitio.id_sitio,
        nombre_sitio: sitio.nombre_sitio,
        ubicacion: sitio.ubicacion,
        ficha_tecnica: sitio.ficha_tecnica,
        tipo_sitio_id: sitio.tipo_sitio_id,
        estado: nuevoEstado,
        fecha_modificacion: new Date().toISOString()
      };

      await actualizarSitio(sitio.id_sitio, updateData as any);
      showSuccessToast(`El sitio fue ${nuevoEstado ? 'activado' : 'desactivado'} correctamente.`);
    } catch (error) {
      showErrorToast("Error al cambiar el estado del sitio.");
    }
  };

  const handleCreate = () => {
    setFormData({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (sitio: SitioType) => {
    setFormData({
      nombre_sitio: sitio.nombre_sitio,
      ubicacion: sitio.ubicacion,
      ficha_tecnica: sitio.ficha_tecnica,
      tipo_sitio_id: sitio.tipo_sitio_id.toString()
    });
    setEditingId(sitio.id_sitio);
    setIsModalOpen(true);
  };

  // Si está en modo modal, mostrar directamente el formulario
  if (isInModal) {
    return (
      <div className="w-full">
        <Form
          fields={formFieldsCreate}
          onSubmit={handleSubmit}
          buttonText="Crear"
          initialValues={{
            fecha_creacion: new Date().toISOString().split('T')[0]
          }}
          schema={sitioSchema}
        />
      </div>
    );
  }

  return (
    <AnimatedContainer>
      <div className="w-full">
            <h1 className="text-xl font-bold mb-4">Gestión de Sitios</h1>

            <Botton className="mb-4" onClick={handleCreate} texto="Crear Nuevo Sitio"/>

        {loading ? (
          <p>Cargando sitios...</p>
        ) : (
          <div className="w-full">
            {createEntityTable({
              columns: columns as Column<any>[],
              data: sitios,
              idField: 'id_sitio',
              handlers: {
                onToggleEstado: handleToggleEstado,
                onEdit: handleEdit
              }
            })}
          </div>
        )}

        {/* Modal para crear/editar sitio usando el modal global */}
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => {
            setIsModalOpen(false);
            setFormData({});
            setEditingId(null);
          }} 
          title={editingId ? "Editar Sitio" : "Crear Nuevo Sitio"}
        >
          <Form
            fields={editingId ? formFieldsEdit : formFieldsCreate}
            onSubmit={handleSubmit}
            buttonText={editingId ? "Actualizar" : "Crear"}
            initialValues={formData}
            schema={sitioSchema}
          />
        </Modal>

        {/* Modal para crear tipo de sitio usando el modal global */}
        <Modal 
          isOpen={isTipoSitioModalOpen} 
          onClose={() => setIsTipoSitioModalOpen(false)} 
          title="Crear Nuevo Tipo de Sitio"
        >
          <TiposSitio isInModal={true} onTipoSitioCreated={() => {
            window.location.reload(); // Recargar la página para actualizar los tipos de sitio
            setIsTipoSitioModalOpen(false);
          }} />
        </Modal>
      </div>
    </AnimatedContainer>
  );
};

export default Sitio;
function onSitioCreated() {
  throw new Error("Function not implemented.");
}

