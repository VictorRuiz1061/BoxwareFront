import { useState, useEffect } from 'react';
import { useGetCaracteristicas, usePostCaracteristica, usePutCaracteristica } from '@/hooks/caracteristica';
import { useGetMateriales } from '@/hooks/material';
import { Caracteristica } from '@/types';
import { AnimatedContainer, Botton, showSuccessToast, showErrorToast } from "@/components/atomos";
import { createEntityTable, Form, Modal } from "@/components/organismos";
import type { Column, FormField } from "@/components/organismos";
import { caracteristicaSchema } from '@/schemas';

interface CaracteristicasProps {
  isInModal?: boolean;
  onCaracteristicaCreated?: () => void;
}

const CaracteristicasTemplate = ({ isInModal = false, onCaracteristicaCreated }: CaracteristicasProps) => {
  const { caracteristicas, loading } = useGetCaracteristicas();
  const { crearCaracteristica } = usePostCaracteristica();
  const { actualizarCaracteristica } = usePutCaracteristica();
  const { materiales } = useGetMateriales();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [textoBoton] = useState();

  const columns: Column<Caracteristica>[] = [
    { key: "descripcion", label: "Descripción", filterable: true,
        render: (item) => (item.descripcion ? "Sí" : "No")
    },
    { key: "placa_sena", label: "Placa Sena", filterable: true,
        render: (item) => (item.placa_sena ? "Sí" : "No")
     },
    { key: "material_id", label: "Material", filterable: true,
        render: (item) => item.material?.nombre_material || 'N/A'
    },
  ];

  const formFields: FormField[] = [
    {
      key: "descripcion",
      label: "Descripción",
      type: "toggle",
      required: true,
      className: "col-span-1"
    },
    {
      key: "placa_sena",
      label: "Placa Sena",
      type: "toggle",
      required: true,
      className: "col-span-1"
    },
    {
      key: "material_id",
      label: "Material",
      type: "select",
      required: true,
      options: materiales.map(material => ({ value: material.id_material, label: material.nombre_material })),
      className: "col-span-1"
    }
  ];

  const handleSubmit = async (values: Record<string, any>) => {
    try {
      if (editingId) {
        const updatePayload = {
          ...values,
        };

        await actualizarCaracteristica(editingId, updatePayload);
        showSuccessToast("Característica actualizada correctamente");
      } else {
        const createPayload = {
          ...values,
        };

        await crearCaracteristica(createPayload as any);
        showSuccessToast("Característica creada correctamente");

        if (isInModal && onCaracteristicaCreated) {
          onCaracteristicaCreated();
        }
      }

      setIsModalOpen(false);
      setEditingId(null);
      setFormData({});
    } catch (error) {
      showErrorToast('Error al guardar la característica');
    }
  };

  const handleCreate = () => {
    setFormData({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (caracteristica: Caracteristica) => {
    setFormData({
      descripcion: caracteristica.descripcion,
      placa_sena: caracteristica.placa_sena,
      material_id: caracteristica.material_id,
    });
    setEditingId(caracteristica.id_caracteristica);
    setIsModalOpen(true);
  };
  
  useEffect(() => {
    if (isModalOpen) {
      // Lógica para inicializar el formulario en el modo de edición
    }
  }, [isModalOpen, editingId, caracteristicas]);

  return (
    <AnimatedContainer>
      <div className="w-full">
        {!isInModal && (
            <h1 className="text-xl font-bold mb-4">Gestión de Características</h1>
        )}

        {!isInModal && (
            <Botton className="mb-4" onClick={handleCreate} texto="Crear Nueva Característica">
              {textoBoton}
            </Botton>
        )}

        {!isInModal && loading ? (
          <div className="flex justify-center items-center py-8">
            <p className="text-gray-500">Cargando características...</p>
          </div>
        ) : !isInModal ? (
          <div className="w-full">
            {createEntityTable({
              columns: columns as Column<any>[],
              data: caracteristicas,
              idField: 'id_caracteristica',
              handlers: {
                onEdit: handleEdit
              }
            })}
          </div>
        ) : (
          <div className="p-4">
            <h2 className="text-lg font-bold mb-4">Crear Nueva Característica</h2>
            <Form
              fields={formFields}
              onSubmit={handleSubmit}
              buttonText="Crear"
              schema={caracteristicaSchema}
            />
          </div>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setFormData({});
            setEditingId(null);
          }}
          title={editingId ? "Editar Característica" : "Crear Nueva Característica"}
        >
          <div className="bg-gray-50/50 dark:bg-gray-800/50 p-6 rounded-lg border border-gray-100 dark:border-gray-700">
            <Form
              fields={formFields}
              onSubmit={handleSubmit}
              buttonText={editingId ? "Actualizar" : "Crear"}
              initialValues={formData}
              schema={caracteristicaSchema}
            />
          </div>
        </Modal>
      </div>
    </AnimatedContainer>
  );
};

export default CaracteristicasTemplate;