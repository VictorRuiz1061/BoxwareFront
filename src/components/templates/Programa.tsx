import { useState } from "react";
import { useGetProgramas, usePostPrograma, usePutPrograma } from '@/hooks/programas';
import { useGetAreas } from '@/hooks/areas';
import type { Programa, CreateProgramaRequest, UpdateProgramaRequest } from '@/types';
import { AnimatedContainer, Botton, showSuccessToast, showErrorToast } from "@/components/atomos";
import { createEntityTable, Form, Modal } from "@/components/organismos";
import type { Column, FormField } from "@/components/organismos";
import { programaSchema } from '@/schemas';
import Areas from './Areas';

const Programas = ({ isInModal = false, onProgramaCreated = () => {} }) => {
  const { programas, loading } = useGetProgramas();
  const { crearPrograma } = usePostPrograma();
  const { actualizarPrograma } = usePutPrograma();
  const { areas, loading: loadingAreas } = useGetAreas();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAreaModalOpen, setIsAreaModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [textoBoton] = useState();

  type ProgramaWithArea = Programa & { 
    key: number; 
    area?: { 
      nombre_area: string;
      id_area: number;
    } 
  };

  const columns: Column<ProgramaWithArea>[] = [
    { key: "nombre_programa", label: "Nombre del Programa", filterable: true },
    {
      key: "area_id",
      label: "Área",
      filterable: true,
      render: (programa) => {
        if (programa.area) {
          return programa.area.nombre_area;
        }
        
        if (programa.area_id && (!loadingAreas && areas.length > 0)) {
          const area = areas.find(a => a.id_area === programa.area_id);
          return area ? area.nombre_area : `ID: ${programa.area_id}`;
        }
        
        return 'No disponible';
      }
    }
  ];

  const formFieldsCreate: FormField[] = [
    { key: "nombre_programa", label: "Nombre del Programa", type: "text", required: true },
    { 
      key: "area_id", 
      label: "Área", 
      type: "select", 
      required: true, 
      options: areas.map(a => ({ label: a.nombre_area, value: a.id_area })),
      extraButton: {
        icon: "+",
        onClick: () => setIsAreaModalOpen(true),
      }
    },
  ];

  const formFieldsEdit: FormField[] = [
    { key: "nombre_programa", label: "Nombre del Programa", type: "text", required: true },
    { 
      key: "area_id", 
      label: "Área", 
      type: "select", 
      required: true, 
      options: areas.map(a => ({ label: a.nombre_area, value: a.id_area })),
      extraButton: {
        icon: "+",
        onClick: () => setIsAreaModalOpen(true),
      }
    },
  ];

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      const area_id = parseInt(values.area_id);
      
      if (editingId) {
        const programaToEdit = programas.find(p => p.id_programa === editingId);
        if (!programaToEdit) {
          throw new Error('No se encontró el programa original');
        }
        
        const updatePayload: Omit<UpdateProgramaRequest, 'id'> = {
          area_id,
          nombre_programa: values.nombre_programa,
          estado: true,
          fecha_creacion: programaToEdit.fecha_creacion,
        };
        
        await actualizarPrograma(editingId, updatePayload);
        showSuccessToast('Programa actualizado con éxito');
      } else {
        const createPayload: CreateProgramaRequest = {
          nombre_programa: values.nombre_programa,
          area_id,
          estado: true
        };

        await crearPrograma(createPayload);
        showSuccessToast('Programa creado con éxito');
        if (isInModal) {
          onProgramaCreated();
        }
      }
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      showErrorToast('Error al guardar el programa');
    }
  };

  const handleToggleEstado = async (programa: Programa) => {
    try {
      const nuevoEstado = !programa.estado;
      const updateData = {
        ...programa,
        estado: nuevoEstado,
        fecha_modificacion: new Date().toISOString()
      };

      await actualizarPrograma(programa.id_programa, updateData);
      showSuccessToast(`El programa fue ${nuevoEstado ? 'activado' : 'desactivado'} correctamente.`);
    } catch (error) {
      showErrorToast("Error al cambiar el estado del programa.");
    }
  };

  const handleCreate = () => {
    setFormData({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (programa: Programa) => {
    setFormData({
      nombre_programa: programa.nombre_programa,
      area_id: programa.area_id ? programa.area_id.toString() : ''
    });
    setEditingId(programa.id_programa);
    setIsModalOpen(true);
  };

  return (
    <AnimatedContainer>
      <div className="w-full">
        <h1 className="text-xl font-bold mb-4">Gestión de Programas</h1>
      
            <Botton className="mb-4" onClick={handleCreate} texto="Crear Nuevo Programa">
              {textoBoton}
            </Botton>

        {loading ? (
          <p>Cargando programas...</p>
        ) : (
          <div className="w-full">
            {createEntityTable({
              columns: columns as Column<any>[],
              data: programas,
              idField: 'id_programa',
              handlers: {
                onToggleEstado: handleToggleEstado,
                onEdit: handleEdit
              }
            })}
          </div>
        )}

        {/* Modal para crear/editar programa usando el modal global */}
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => {
            setIsModalOpen(false);
            setFormData({});
            setEditingId(null);
          }} 
          title={editingId ? "Editar Programa" : "Crear Nuevo Programa"}
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
            schema={programaSchema}
          />
        </Modal>

        {/* Modal para crear área usando el modal global */}
        <Modal 
          isOpen={isAreaModalOpen} 
          onClose={() => setIsAreaModalOpen(false)} 
          title="Crear Nueva Área"
        >
          <Areas isInModal={true} onAreaCreated={() => {
            setIsAreaModalOpen(false);
          }} />
        </Modal>
      </div>
    </AnimatedContainer>
  );
};

export default Programas;
