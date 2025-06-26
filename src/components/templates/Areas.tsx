import { useState } from "react";
import { useGetSedes } from '@/hooks/sedes';
import { useGetAreas, usePostArea, usePutArea } from '@/hooks/areas';
import { Area } from '@/types';
import { AnimatedContainer, Boton, showSuccessToast, showErrorToast } from "@/components/atomos";
import { createEntityTable, Form } from "@/components/organismos";
import type { Column, FormField } from "@/components/organismos";
import { areaSchema } from '@/schemas';

const Areas = () => {
  const { areas, loading } = useGetAreas();
  const { crearArea } = usePostArea();
  const { actualizarArea } = usePutArea();
  const { sedes } = useGetSedes();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
    
  const renderSede = (area: Area) => {
    if (area.sede && area.sede.nombre_sede) {
      return area.sede.nombre_sede;
    }

    const sede = sedes.find(s => s.id_sede === area.id_sede);
    return sede ? sede.nombre_sede : area.id_sede;
  };

  const columns: Column<Area & { key: number; sede_nombre?: string }>[]= [
    { key: "nombre_area", label: "Nombre del Área", filterable: true },
    {
      key: "sede_nombre",
      label: "Sede",
      filterable: true,
      render: (area) => renderSede(area)
    },
    { key: "fecha_creacion", label: "Fecha de Creación", filterable: true },
    { key: "fecha_modificacion", label: "Fecha de Modificación", filterable: true },
  ];

  const formFieldsCreate: FormField[] = [
    { key: "nombre_area", label: "Nombre del Área", type: "text", required: true },
    { 
      key: "sede_id", 
      label: "Sede", 
      type: "select", 
      required: true, 
      options: sedes.map(s => ({ label: s.nombre_sede, value: s.id_sede })) 
    },
  ];
  const formFieldsEdit: FormField[] = [
    { key: "nombre_area", label: "Nombre del Área", type: "text", required: true },
    { 
      key: "sede_id", 
      label: "Sede", 
      type: "select", 
      required: true, 
      options: sedes.map(s => ({ label: s.nombre_sede, value: s.id_sede })) 
    },
  ];
    

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      // Convertir sede_id a número
      const id_sede = parseInt(values.sede_id);
      
      // Fecha actual para timestamps
      const currentDate = new Date().toISOString();
      
      if (editingId) {
        // Actualizar área existente
        const updatePayload = {
          id_area: editingId,
          nombre_area: values.nombre_area,
          id_sede: id_sede, // Asegurarse que id_sede se envía como número
          estado: true,
          fecha_creacion: values.fecha_creacion || currentDate,
          fecha_modificacion: currentDate,
          // Agregar un objeto sede vacío para satisfacer el tipo Area
          sede: {} as any
        };
        
        await actualizarArea(editingId, updatePayload);
        showSuccessToast('Área actualizada con éxito');
      } else {
        // Crear nueva área
        const createPayload = {
          // Agregar un id_area temporal que será reemplazado por el backend
          id_area: 0,
          nombre_area: values.nombre_area,
          id_sede: id_sede, // Asegurarse que id_sede se envía como número
          estado: true,
          fecha_creacion: currentDate,
          fecha_modificacion: currentDate,
          // Agregar un objeto sede vacío para satisfacer el tipo Area
          sede: {} as any
        };
        
        await crearArea(createPayload);
        showSuccessToast('Área creada con éxito');
      }
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      console.error('Error al guardar el área:', error);
      showErrorToast('Error al guardar el área');
    }
  };

  const handleToggleEstado = async (area: Area) => {
    try {
      const nuevoEstado = !area.estado;
      const updateData = {
        id_area: area.id_area,
        nombre_area: area.nombre_area,
        id_sede: area.id_sede,
        estado: nuevoEstado,
        fecha_creacion: area.fecha_creacion, // Mantener la fecha de creación original
        fecha_modificacion: new Date().toISOString().split('T')[0],
        sede: area.sede || {} as any // Mantener la referencia a la sede
      };

      await actualizarArea(area.id_area, updateData);
      // Usar el nuevo Toast en lugar de la alerta
      showSuccessToast(`El área fue ${nuevoEstado ? 'activada' : 'desactivada'} correctamente.`);
    } catch (error) {
      // Usar el nuevo Toast para mostrar el error
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
      sede_id: area.id_sede ? area.id_sede.toString() : ''
    });
    
    setEditingId(area.id_area);
    setIsModalOpen(true);
  };
 
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
        </AnimatedContainer>)}

        {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <AnimatedContainer animation="scaleIn" duration={300} className="w-full max-w-lg">
                <div className="p-6 rounded-lg shadow-lg w-full max-h-[90vh] overflow-y-auto relative">
                  {/* Botón X para cerrar en la esquina superior derecha */}
                  <button onClick={() => setIsModalOpen(false)} className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors">
                  
                    <span className="text-gray-800 font-bold">×</span>
                  </button>
                  
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
                      : { 
                          fecha_creacion: new Date().toISOString().split('T')[0],
                          fecha_modificacion: new Date().toISOString().split('T')[0]
                        })
                  }}
                  schema={areaSchema}
                />
              </div>  
            </AnimatedContainer>  
            </div> 
          )}
        </div>
    </>
  );
};

export default Areas;
