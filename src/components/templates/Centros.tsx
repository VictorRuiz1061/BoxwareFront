import { useState } from "react";
import { useGetMunicipios } from '@/hooks/municipios';
import { useGetCentros, usePostCentro, usePutCentro } from '@/hooks/centros';
import type { Centro } from '@/types';
import { AnimatedContainer, Botton, showSuccessToast, showErrorToast } from "@/components/atomos";
import { createEntityTable, Form, Modal } from "@/components/organismos";
import type { Column, FormField } from "@/components/organismos";
import { centroSchema } from '@/schemas';
import Municipios from './Municipios';

interface CentrosProps {
  isInModal?: boolean;
  onCentroCreated?: () => void;
}

const Centros = ({ isInModal = false, onCentroCreated }: CentrosProps) => {
  const { centros, loading } = useGetCentros();
  const { crearCentro } = usePostCentro();
  const { actualizarCentro } = usePutCentro();
  const { municipios } = useGetMunicipios();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMunicipioModalOpen, setIsMunicipioModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const columns: Column<Centro & { key: number }>[] = [
    { key: "nombre_centro", label: "Nombre del Centro", filterable: true },
    {
      key: "municipio",
      label: "Municipio",
      filterable: true,
      render: (centro) => {
        if (centro.municipio) {
          return centro.municipio.nombre_municipio;
        }
        return 'No disponible';
      }
    },
  ];

  const formFieldsCreate: FormField[] = [
    { key: "nombre_centro", label: "Nombre del Centro", type: "text", required: true },
    { 
      key: "id_municipio", 
      label: "Municipio", 
      type: "select", 
      required: true, 
      options: municipios.map(m => ({ label: m.nombre_municipio, value: m.id_municipio })),
      extraButton: {
        icon: "+",
        onClick: () => setIsMunicipioModalOpen(true),
      }
    },
  ];

  const formFieldsEdit: FormField[] = [
    { key: "nombre_centro", label: "Nombre del Centro", type: "text", required: true },
    { 
      key: "id_municipio", 
      label: "Municipio", 
      type: "select", 
      required: true, 
      options: municipios.map(m => ({ label: m.nombre_municipio, value: m.id_municipio })),
      extraButton: {
        icon: "+",
        onClick: () => setIsMunicipioModalOpen(true),
        className: "ml-2 bg-green-500 hover:bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
      }
    },
  ];

  const formFieldsModal: FormField[] = [
    { key: "nombre_centro", label: "Nombre del Centro", type: "text", required: true }
  ];

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      const currentDate = new Date().toISOString();
      
      if (editingId) {
        const updatePayload = {
          id_centro: editingId,
          id_municipio: parseInt(values.id_municipio),
          nombre_centro: values.nombre_centro,
          estado: true,
          fecha_creacion: currentDate,
          fecha_modificacion: currentDate,
        };
        
        await actualizarCentro(editingId, updatePayload);
        showSuccessToast('Centro actualizado con éxito');
      } else {
        const createPayload = {
          nombre_centro: values.nombre_centro,
          id_municipio: parseInt(values.id_municipio), // ID por defecto en modo modal
          estado: true,
          fecha_creacion: currentDate,
          fecha_modificacion: currentDate
        };

        await crearCentro(createPayload as any);
        showSuccessToast('Centro creado con éxito');
        if (onCentroCreated) {
          onCentroCreated();
        }
      }
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      showErrorToast('Error al guardar el centro');
    }
  };

  const handleToggleEstado = async (centro: Centro) => {
    try {
      const nuevoEstado = !centro.estado;
      const updateData = {
        id_centro: centro.id_centro,
        estado: nuevoEstado,
        fecha_modificacion: new Date().toISOString()
      };

      await actualizarCentro(centro.id_centro, updateData);
      showSuccessToast(`El centro fue ${nuevoEstado ? 'activado' : 'desactivado'} correctamente.`);
    } catch (error) {
      showErrorToast("Error al cambiar el estado del centro.");
    }
  };

  const handleCreate = () => {
    setFormData({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (centro: Centro) => {
    setFormData({
      nombre_centro: centro.nombre_centro,
      id_municipio: centro.id_municipio ? centro.id_municipio.toString() : ''
    });
    setEditingId(centro.id_centro);
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
          schema={centroSchema}
        />
      </div>
    );
  }

  return (
    <AnimatedContainer>
      <div className="w-full">
          <h1 className="text-xl font-bold mb-4">Gestión de Centros</h1>
      
          <Botton className="mb-4" onClick={handleCreate} texto="Crear Nuevo Centro"/>

        {loading ? (
          <p>Cargando centros...</p>
        ) : (
          <div className="w-full">
            {createEntityTable({
              columns: columns as Column<any>[],
              data: centros,
              idField: 'id_centro',
              handlers: {
                onToggleEstado: handleToggleEstado,
                onEdit: handleEdit
              }
            })}
          </div>
        )}

        {/* Modal para crear/editar centro usando el modal global */}
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => {
            setIsModalOpen(false);
            setFormData({});
            setEditingId(null);
          }} 
          title={editingId ? "Editar Centro" : "Crear Nuevo Centro"}
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
            schema={centroSchema}
          />
        </Modal>

        {/* Modal para crear municipio usando el modal global */}
        <Modal 
          isOpen={isMunicipioModalOpen} 
          onClose={() => setIsMunicipioModalOpen(false)} 
          title="Crear Nuevo Municipio"
        >
          <Municipios isInModal={true} onMunicipioCreated={() => {
            setIsMunicipioModalOpen(false);
          }} />
        </Modal>
      </div>
    </AnimatedContainer>
  );
};

export default Centros;
