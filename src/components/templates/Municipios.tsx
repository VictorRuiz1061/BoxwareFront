import { useState } from "react";
import { useGetMunicipios, usePostMunicipio, usePutMunicipio } from '@/hooks/municipios';
import type { Municipio } from '@/types';
import { AnimatedContainer, showSuccessToast, showErrorToast, Botton } from "@/components/atomos";
import { createEntityTable, Form, Modal } from "@/components/organismos";
import type { Column, FormField } from "@/components/organismos";
import { municipioSchema } from '@/schemas';

interface MunicipiosProps {
  isInModal?: boolean;
  onMunicipioCreated?: () => void;
}

const Municipios = ({ isInModal = false, onMunicipioCreated }: MunicipiosProps) => {
  const { municipios, loading } = useGetMunicipios();
  const { crearMunicipio } = usePostMunicipio();
  const { actualizarMunicipio } = usePutMunicipio();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [textoBoton] = useState();

  const columns: Column<Municipio & { key: number }>[] = [
    { key: "nombre_municipio", label: "Nombre del Municipio", filterable: true },
    { key: "fecha_creacion", label: "Fecha de Creación", filterable: true },
    { key: "fecha_modificacion", label: "Fecha de Modificación", filterable: true },
  ];

  const formFieldsCreate: FormField[] = [
    { key: "nombre_municipio", label: "Nombre del Municipio", type: "text", required: true },
  ];

  const formFieldsEdit: FormField[] = [
    { key: "nombre_municipio", label: "Nombre del Municipio", type: "text", required: true },
  ];

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      // Fecha actual para timestamps
      const currentDate = new Date().toISOString();

      if (editingId) {
        // Actualizar municipio existente
        const original = municipios.find(m => m.id_municipio === editingId);
        if (!original) {
          throw new Error('No se encontró el municipio original');
        }

        const updatePayload = {
          id_municipio: editingId,
          nombre_municipio: values.nombre_municipio,
          estado: true,
          fecha_creacion: original.fecha_creacion,
          fecha_modificacion: currentDate,
        };

        await actualizarMunicipio(editingId, updatePayload);
        showSuccessToast('Municipio actualizado con éxito');
      } else {
        const createPayload = {
          id_municipio: 0, // El backend ignorará este valor
          nombre_municipio: values.nombre_municipio,
          estado: true,
          fecha_creacion: currentDate,
          fecha_modificacion: currentDate
        };

        await crearMunicipio(createPayload);
        showSuccessToast('Municipio creado con éxito');
        if (onMunicipioCreated) {
          onMunicipioCreated();
        }
      }
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      showErrorToast('Error al guardar el municipio');
    }
  };

  const handleToggleEstado = async (municipio: Municipio) => {
    try {
      const nuevoEstado = !municipio.estado;
      const updateData = {
        ...municipio,
        estado: nuevoEstado,
        fecha_modificacion: new Date().toISOString()
      };

      await actualizarMunicipio(municipio.id_municipio, updateData);
      showSuccessToast(`El municipio fue ${nuevoEstado ? 'activado' : 'desactivado'} correctamente.`);
    } catch (error) {
      showErrorToast("Error al cambiar el estado del municipio.");
    }
  };

  const handleCreate = () => {
    setFormData({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (municipio: Municipio) => {
    setFormData({
      nombre_municipio: municipio.nombre_municipio,
    });
    setEditingId(municipio.id_municipio);
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
          schema={municipioSchema}
        />
      </div>
    );
  }

  return (
    <AnimatedContainer>
      <div className="w-full">
        <h1 className="text-xl font-bold mb-4">Gestión de Municipios</h1>
        <Botton className="mb-4" onClick={handleCreate} texto="Crear Nuevo Municipio">
          {textoBoton}
        </Botton>

        {loading ? (
          <p>Cargando municipios...</p>
        ) : (
          <div className="w-full">
            {createEntityTable({
              columns: columns as Column<any>[],
              data: municipios,
              idField: 'id_municipio',
              handlers: {
                onToggleEstado: handleToggleEstado,
                onEdit: handleEdit
              }
            })}
          </div>
        )}

        {/* Modal para crear/editar municipio usando el modal global */}
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => {
            setIsModalOpen(false);
            setFormData({});
            setEditingId(null);
          }} 
          title={editingId ? "Editar Municipio" : "Crear Nuevo Municipio"}
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
            schema={municipioSchema}
          />
        </Modal>
      </div>
    </AnimatedContainer>
  );
};

export default Municipios;
