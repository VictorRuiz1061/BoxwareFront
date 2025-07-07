import { useState } from "react";
import { useGetProgramas, usePostPrograma, usePutPrograma } from '@/hooks/programas';
import { useGetAreas } from '@/hooks/areas';
import type { Programa } from '@/types';
import { AnimatedContainer, Boton, showSuccessToast, showErrorToast } from "@/components/atomos";
import { createEntityTable, Form } from "@/components/organismos";
import type { Column, FormField } from "@/components/organismos";
import { programaSchema } from '@/schemas';
import Areas from './Areas';

const Programas = () => {
  const { programas, loading } = useGetProgramas();
  const { crearPrograma } = usePostPrograma();
  const { actualizarPrograma } = usePutPrograma();
  const { areas, loading: loadingAreas } = useGetAreas();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAreaModalOpen, setIsAreaModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});

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
      key: "id_area", 
      label: "Área", 
      type: "select", 
      required: true, 
      options: areas.map(a => ({ label: a.nombre_area, value: a.id_area })),
      extraButton: {
        icon: "+",
        onClick: () => setIsAreaModalOpen(true),
        className: "ml-2 bg-green-500 hover:bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
      }
    },
  ];

  const formFieldsEdit: FormField[] = [
    { key: "nombre_programa", label: "Nombre del Programa", type: "text", required: true },
    { 
      key: "id_area", 
      label: "Área", 
      type: "select", 
      required: true, 
      options: areas.map(a => ({ label: a.nombre_area, value: a.id_area })),
      extraButton: {
        icon: "+",
        onClick: () => setIsAreaModalOpen(true),
        className: "ml-2 bg-green-500 hover:bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
      }
    },
  ];

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      const area_id = parseInt(values.id_area);
      const currentDate = new Date().toISOString();
      
      if (editingId) {
        const programaToEdit = programas.find(p => p.id_programa === editingId);
        if (!programaToEdit) {
          throw new Error('No se encontró el programa original');
        }
        
        const updatePayload = {
          id_programa: editingId,
          area_id,
          nombre_programa: values.nombre_programa,
          estado: true,
          fecha_creacion: programaToEdit.fecha_creacion,
          fecha_modificacion: currentDate,
        };
        
        await actualizarPrograma(editingId, updatePayload);
        showSuccessToast('Programa actualizado con éxito');
      } else {
        const createPayload = {
          id_programa: 0, // El backend ignorará este valor
          nombre_programa: values.nombre_programa,
          area_id,
          estado: true,
          fecha_creacion: currentDate,
          fecha_modificacion: currentDate
        };

        await crearPrograma(createPayload);
        showSuccessToast('Programa creado con éxito');
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
      id_area: programa.area_id ? programa.area_id.toString() : ''
    });
    setEditingId(programa.id_programa);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="w-full">
        <AnimatedContainer animation="fadeIn" duration={400} className="w-full">
          <h1 className="text-xl font-bold mb-4">Gestión de Programas</h1>
        </AnimatedContainer>
      
        <AnimatedContainer animation="slideUp" delay={100} duration={400}>
          <Boton
            onClick={handleCreate}
            className="bg-blue-500 text-white px-4 py-2 mb-4"
          >
            Crear Nuevo Programa
          </Boton>
        </AnimatedContainer>

        {loading ? (
          <p>Cargando programas...</p>
        ) : (
          <AnimatedContainer animation="slideUp" delay={200} duration={500} className="w-full">
            {createEntityTable({
              columns: columns as Column<any>[],
              data: programas,
              idField: 'id_programa',
              handlers: {
                onToggleEstado: handleToggleEstado,
                onEdit: handleEdit
              }
            })}
          </AnimatedContainer>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <AnimatedContainer animation="scaleIn" duration={300} className="w-full max-w-lg">
              <div className="p-6 rounded-lg shadow-lg w-full max-h-[90vh] overflow-y-auto relative">
                <button onClick={() => setIsModalOpen(false)} className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors">
                  <span className="text-gray-800 font-bold">×</span>
                </button>
                
                <h2 className="text-lg font-bold mb-4 text-center">
                  {editingId ? "Editar Programa" : "Crear Nuevo Programa"}
                </h2>
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
              </div>
            </AnimatedContainer>  
          </div>
        )}

        {/* Modal para crear área */}
        {isAreaModalOpen && (
          <div className="fixed inset-0 bg-[#1E1E1E] bg-opacity-95 flex items-center justify-center z-[60]">
            <div className="bg-[#1E1E1E] p-6 rounded-lg shadow-lg w-full max-w-md relative">
              <button 
                onClick={() => setIsAreaModalOpen(false)}
                className="absolute top-2 right-2 text-white text-2xl hover:text-gray-300"
              >
                ×
              </button>
              <h2 className="text-lg font-bold mb-4 text-white text-center">
                Crear Nueva Área
              </h2>
              <Areas 
                isInModal={true} 
                onAreaCreated={() => {
                  setIsAreaModalOpen(false);
                  window.location.reload();
                }}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Programas;
