import { useState } from "react";
import { useGetAreas, usePostArea, usePutArea } from '@/hooks/areas';
import { useGetSedes } from '@/hooks/sedes';
import type { Area } from '@/types';
import { AnimatedContainer, Botton, showSuccessToast, showErrorToast } from "@/components/atomos";
import { createEntityTable, Form, Modal } from "@/components/organismos";
import type { Column, FormField } from "@/components/organismos";
import { areaSchema } from '@/schemas';
import Sedes from './Sedes';

interface AreasProps {
  isInModal?: boolean;
  onAreaCreated?: () => void;
}

const Areas = ({ isInModal = false, onAreaCreated }: AreasProps) => {
  const { areas, loading } = useGetAreas();
  const { crearArea } = usePostArea();
  const { actualizarArea } = usePutArea();
  const { sedes } = useGetSedes();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSedeModalOpen, setIsSedeModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const columns: Column<Area & { key: number }>[] = [
    { key: "nombre_area", label: "Nombre del Área", filterable: true },
    {
      key: "sede",
      label: "Sede",
      filterable: true,
      render: (area) => {
        if (area.sede) {
          return area.sede.nombre_sede;
        }
        return 'No disponible';
      }
    },
  ];

  const formFieldsCreate: FormField[] = [
    { key: "nombre_area", label: "Nombre del Área", type: "text", required: true },
    {
      key: "sede_id",
      label: "Sede",
      type: "select",
      required: true,
      options: sedes.map(s => ({ label: s.nombre_sede, value: s.id_sede })),
      extraButton: {
        icon: "+",
        onClick: () => setIsSedeModalOpen(true)
      }
    },
  ];

  const formFieldsEdit: FormField[] = [
    { key: "nombre_area", label: "Nombre del Área", type: "text", required: true },
    {
      key: "sede_id",
      label: "Sede",
      type: "select",
      required: true,
      options: sedes.map(s => ({ label: s.nombre_sede, value: s.id_sede })),
      extraButton: {
        icon: "+",
        onClick: () => setIsSedeModalOpen(true),
        className: ""
      }
    },
  ];

  const formFieldsModal: FormField[] = [
    { key: "nombre_area", label: "Nombre del Área", type: "text", required: true }
  ];

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      const currentDate = new Date().toISOString();

      if (editingId) {
        const updatePayload = {
          id_area: editingId,
          sede_id: parseInt(values.sede_id),
          nombre_area: values.nombre_area,
          estado: true,
          fecha_creacion: currentDate,
          fecha_modificacion: currentDate,
        };

        await actualizarArea(editingId, updatePayload);
        showSuccessToast('Área actualizada con éxito');
      } else {
        const createPayload = {
          nombre_area: values.nombre_area,
          sede_id: isInModal ? 1 : parseInt(values.sede_id), // ID por defecto en modo modal
          estado: true,
          fecha_creacion: currentDate,
          fecha_modificacion: currentDate
        };

        await crearArea(createPayload as any);
        showSuccessToast('Área creada con éxito');
        if (onAreaCreated) {
          onAreaCreated();
        }
      }
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      showErrorToast('Error al guardar el área');
    }
  };

  const handleToggleEstado = async (area: Area) => {
    try {
      const nuevoEstado = !area.estado;
      const updateData = {
        id_area: area.id_area,
        estado: nuevoEstado,
        fecha_modificacion: new Date().toISOString()
      };

      // Creamos un nuevo objeto que cumpla con la interfaz Area
      const areaActualizada: Area = {
        ...area,
        estado: nuevoEstado,
        fecha_modificacion: updateData.fecha_modificacion
      };

      await actualizarArea(area.id_area, areaActualizada);
      showSuccessToast(`El área fue ${nuevoEstado ? 'activada' : 'desactivada'} correctamente.`);
    } catch (error) {
      showErrorToast("Error al cambiar el estado del área.");
    }
  };

  const handleCreate = () => {
    setFormData({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (area: Area) => {
    setFormData({
      nombre_area: area.nombre_area,
      sede_id: area.sede_id ? area.sede_id.toString() : ''
    });
    setEditingId(area.id_area);
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
          schema={areaSchema}
        />
      </div>
    );
  }

  return (
    <AnimatedContainer>
      <div className="w-full">
        <h1 className="text-xl font-bold mb-4">Gestión de Áreas</h1>

        <Botton className="mb-4" onClick={handleCreate} texto="Crear Nueva Área"/>

        {loading ? (
          <p>Cargando áreas...</p>
        ) : (
          <div className="w-full">
            {createEntityTable({
              columns: columns as Column<any>[],
              data: areas,
              idField: 'id_area',
              handlers: {
                onToggleEstado: handleToggleEstado,
                onEdit: handleEdit
              }
            })}
          </div>
        )}

        {/* Modal para crear/editar área usando el modal global */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setFormData({});
            setEditingId(null);
          }} title={editingId ? "Editar Área" : "Crear Nueva Área"} >
            
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
            schema={areaSchema} />
        </Modal>

        {/* Modal para crear sede usando el modal global */}
        <Modal
          isOpen={isSedeModalOpen}
          onClose={() => setIsSedeModalOpen(false)}
          title="Crear Nueva Sede" >

          <Sedes isInModal={true} onSedeCreated={() => {
            setIsSedeModalOpen(false);
          }} />

        </Modal>
      </div>
    </AnimatedContainer>
  );
};

export default Areas;
