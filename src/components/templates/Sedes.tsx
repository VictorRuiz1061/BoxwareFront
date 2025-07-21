import { useState } from "react";
import { useGetCentros } from '@/hooks/centros';
import { useGetSedes, usePostSede, usePutSede } from '@/hooks/sedes';
import type { Sede } from '@/types';
import { AnimatedContainer, Botton, showSuccessToast, showErrorToast } from "@/components/atomos";
import { createEntityTable, Form, Modal } from "@/components/organismos";
import type { Column, FormField } from "@/components/organismos";
import { sedeSchema } from '@/schemas';

interface SedesProps {
  isInModal?: boolean;
  onSedeCreated?: () => void;
}

const Sedes = ({ isInModal = false, onSedeCreated }: SedesProps) => {
  const { sedes, loading } = useGetSedes();
  const { crearSede } = usePostSede();
  const { actualizarSede } = usePutSede();
  const { centros, loading: loadingCentros } = useGetCentros();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [textoBoton] = useState();

  const renderCentro = (sede: Sede) => {
    const centro = centros.find(c => c.id_centro === sede.centro_id);
    return centro ? centro.nombre_centro : sede.centro_id;
  };

  const columns: Column<Sede & { key: number }>[] = [
    { key: "nombre_sede", label: "Nombre de la Sede", filterable: true },
    { key: "direccion_sede", label: "Dirección de la sede", filterable: true },
    {
      key: "centro_id",
      label: "Centro",
      filterable: true,
      render: sede => renderCentro(sede)
    },
    { key: "fecha_creacion", label: "Fecha de Creación", filterable: true },
    { key: "fecha_modificacion", label: "Fecha de Modificación", filterable: true },
  ];

  const formFieldsCreate: FormField[] = [
    { key: "nombre_sede", label: "Nombre de la Sede", type: "text", required: true },
    { key: "direccion_sede", label: "Dirección de la Sede", type: "text", required: true },
    {
      key: "centro_id",
      label: "Centro",
      type: "select",
      required: true,
      options: centros.map(m => ({ label: m.nombre_centro, value: m.id_centro }))
    },
  ];

  const formFieldsEdit: FormField[] = [
    { key: "nombre_sede", label: "Nombre de la Sede", type: "text", required: true },
    { key: "direccion_sede", label: "Dirección de la Sede", type: "text", required: true },
    {
      key: "centro_id",
      label: "Centro",
      type: "select",
      required: true,
      options: centros.map(m => ({ label: m.nombre_centro, value: m.id_centro }))
    },
  ];

  const formFieldsModal: FormField[] = [
    { key: "nombre_sede", label: "Nombre de la Sede", type: "text", required: true },
    { key: "direccion_sede", label: "Dirección de la Sede", type: "text", required: true },
  ];

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      // Convertir centro_id a número
      const centro_id = parseInt(values.centro_id || "1");
      if (isNaN(centro_id)) {
        throw new Error("El centro seleccionado no es válido");
      }

      // Fecha actual para timestamps
      const currentDate = new Date().toISOString();

      if (editingId) {
        // Actualizar sede existente
        const updatePayload: Sede = {
          id_sede: editingId,
          centro_id: centro_id,
          nombre_sede: values.nombre_sede,
          direccion_sede: values.direccion_sede,
          estado: true,
          fecha_creacion: formData.fecha_creacion || currentDate, // Mantener fecha de creación original
          fecha_modificacion: currentDate,
        };

        await actualizarSede(editingId, updatePayload);
        showSuccessToast('Sede actualizada con éxito');
      } else {
        const createPayload = {
          nombre_sede: values.nombre_sede,
          direccion_sede: values.direccion_sede,
          centro_id: isInModal ? 1 : centro_id, // ID por defecto en modo modal
          estado: true,
          fecha_creacion: currentDate,
          fecha_modificacion: currentDate
        };

        await crearSede(createPayload as any);
        showSuccessToast('Sede creada con éxito');
        if (onSedeCreated) {
          onSedeCreated();
        }
      }
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      showErrorToast('Error al guardar la sede');
    }
  };

  const handleToggleEstado = async (sede: Sede) => {
    try {
      const nuevoEstado = !sede.estado;
      const updateData: Sede = {
        id_sede: sede.id_sede,
        nombre_sede: sede.nombre_sede,
        direccion_sede: sede.direccion_sede,
        centro_id: sede.centro_id,
        estado: nuevoEstado,
        fecha_creacion: sede.fecha_creacion,
        fecha_modificacion: new Date().toISOString().split('T')[0]
      };

      await actualizarSede(sede.id_sede, updateData);
      showSuccessToast(`La sede fue ${nuevoEstado ? 'activada' : 'desactivada'} correctamente.`);
    } catch (error) {
      showErrorToast("Error al cambiar el estado de la sede.");
    }
  };

  const handleCreate = () => {
    setFormData({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (sede: Sede) => {
    setFormData({
      nombre_sede: sede.nombre_sede,
      direccion_sede: sede.direccion_sede || '',
      centro_id: sede.centro_id ? sede.centro_id.toString() : ''
    });
    setEditingId(sede.id_sede);
    setIsModalOpen(true);
  };

  // Si está en modo modal, mostrar directamente el formulario
  if (isInModal) {
    return (
      <div className="w-full">
        <Form
          fields={formFieldsModal}
          onSubmit={handleSubmit}
          buttonText="Crear"
          initialValues={{
            fecha_creacion: new Date().toISOString().split('T')[0]
          }}
          schema={sedeSchema}
        />
      </div>
    );
  }

  return (
    <AnimatedContainer>
      <div className="w-full">
        <h1 className="text-xl font-bold mb-4">Gestión de Sedes</h1>

        <Botton className="mb-4" onClick={handleCreate} texto="Crear Nueva Sede">
          {textoBoton}
        </Botton>

        {loading || loadingCentros ? (
          <p>Cargando datos...</p>
        ) : (
          <div className="w-full">
            {createEntityTable({
              columns: columns as Column<any>[],
              data: sedes,
              idField: 'id_sede',
              handlers: {
                onToggleEstado: handleToggleEstado,
                onEdit: handleEdit
              }
            })}
          </div>
        )}

        {/* Modal para crear/editar sede usando el modal global */}
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => {
            setIsModalOpen(false);
            setFormData({});
            setEditingId(null);
          }} 
          title={editingId ? "Editar Sede" : "Crear Nueva Sede"}
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
            schema={sedeSchema}
          />
        </Modal>
      </div>
    </AnimatedContainer>
  );
};

export default Sedes;
