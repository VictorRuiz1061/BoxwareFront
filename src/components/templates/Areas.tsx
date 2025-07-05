import { useState } from "react";
import { useGetAreas, usePostArea, usePutArea } from '@/hooks/areas';
import { useGetSedes } from '@/hooks/sedes';
import type { Area } from '@/types';
import { AnimatedContainer, Boton, showSuccessToast, showErrorToast } from "@/components/atomos";
import { createEntityTable, Form } from "@/components/organismos";
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
      key: "id_sede", 
      label: "Sede", 
      type: "select", 
      required: true, 
      options: sedes.map(s => ({ label: s.nombre_sede, value: s.id_sede })),
      extraButton: {
        icon: "+",
        onClick: () => setIsSedeModalOpen(true),
        className: "ml-2 bg-green-500 hover:bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
      }
    },
  ];

  const formFieldsEdit: FormField[] = [
    { key: "nombre_area", label: "Nombre del Área", type: "text", required: true },
    { 
      key: "id_sede", 
      label: "Sede", 
      type: "select", 
      required: true, 
      options: sedes.map(s => ({ label: s.nombre_sede, value: s.id_sede })),
      extraButton: {
        icon: "+",
        onClick: () => setIsSedeModalOpen(true),
        className: "ml-2 bg-green-500 hover:bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
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
          id_sede: parseInt(values.id_sede),
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
          id_sede: isInModal ? 1 : parseInt(values.id_sede), // ID por defecto en modo modal
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
        id_sede: area.id_sede,
        nombre_area: area.nombre_area,
        estado: nuevoEstado,
        fecha_creacion: area.fecha_creacion,
        fecha_modificacion: new Date().toISOString()
      };

      await actualizarArea(area.id_area, updateData);
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
      id_sede: area.id_sede ? area.id_sede.toString() : ''
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
    <>
      <div className="w-full">
        <AnimatedContainer animation="fadeIn" duration={400} className="w-full">
          <h1 className="text-xl font-bold mb-4">Gestión de Áreas</h1>
        </AnimatedContainer>
      
        <AnimatedContainer animation="slideUp" delay={100} duration={400}>
          <Boton
            onClick={handleCreate}
            className="bg-blue-500 text-white px-4 py-2 mb-4"
          >
            Crear Nueva Área
          </Boton>
        </AnimatedContainer>

        {loading ? (
          <p>Cargando áreas...</p>
        ) : (
          <AnimatedContainer animation="slideUp" delay={200} duration={500} className="w-full">
            {createEntityTable({
              columns: columns as Column<any>[],
              data: areas,
              idField: 'id_area',
              handlers: {
                onToggleEstado: handleToggleEstado,
                onEdit: handleEdit
              }
            })}
          </AnimatedContainer>
        )}

        {(isModalOpen || isInModal) && (
          <div className={isInModal ? "" : "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"}>
            <AnimatedContainer animation="scaleIn" duration={300} className="w-full max-w-lg">
              <div className={`p-6 rounded-lg shadow-lg w-full max-h-[90vh] overflow-y-auto relative ${isInModal ? "" : "bg-white dark:bg-gray-800"}`}>
                {!isInModal && (
                  <button onClick={() => setIsModalOpen(false)} className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors">
                    <span className="text-gray-800 font-bold">×</span>
                  </button>
                )}
                
                <h2 className="text-lg font-bold mb-4 text-center">
                  {editingId ? "Editar Área" : "Crear Nueva Área"}
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
                  schema={areaSchema}
                />
              </div>
            </AnimatedContainer>  
          </div>
        )}

        {/* Modal para crear sede */}
        {isSedeModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md relative">
              <button 
                onClick={() => setIsSedeModalOpen(false)}
                className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
              >
                <span className="text-gray-800 font-bold">×</span>
              </button>
              {/* 
                Corregido: eliminamos las props no válidas para evitar el error de tipos.
                Si necesitas pasar información a Sedes, asegúrate de que acepte esas props en su definición.
              */}
              <Sedes />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Areas;
