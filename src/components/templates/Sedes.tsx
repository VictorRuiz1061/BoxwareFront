import { useState } from "react";
import { useGetCentros } from '@/hooks/centros';
import { useGetSedes, usePostSede, usePutSede } from '@/hooks/sedes';
import type { Sede } from '@/types';
import {  AnimatedContainer,  Boton,  showSuccessToast, showErrorToast } from "@/components/atomos";
import {  createEntityTable, Form } from "@/components/organismos";
import type { Column, FormField } from "@/components/organismos";
import { sedeSchema } from '@/schemas';

const Sedes = () => {
  const { sedes, loading } = useGetSedes();
  const { crearSede } = usePostSede();
  const { actualizarSede } = usePutSede();
  const { centros, loading: loadingCentros } = useGetCentros();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const renderCentro = (sede: Sede) => {
    const centro = centros.find(c => c.id_centro === sede.centro_id);
    return centro ? centro.nombre_centro : sede.centro_id;
  };

  const columns: Column<Sede & { key: number }>[]= [
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

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      // Convertir centro_id a número
      const centro_id = parseInt(values.centro_id);
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
        // Usar el nuevo Toast en lugar de la alerta
        showSuccessToast('Sede actualizada con éxito');
      } else {
        const createPayload = {
          nombre_sede: values.nombre_sede,
          direccion_sede: values.direccion_sede,
          centro_id: centro_id,
          estado: true,
          fecha_creacion: currentDate,
          fecha_modificacion: currentDate
        };

        await crearSede(createPayload as any);
        showSuccessToast('Sede creada con éxito');
      }
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      // Reemplazar alert con nuestro nuevo Toast
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
      // Usar el nuevo Toast en lugar de la alerta
      showSuccessToast(`La sede fue ${nuevoEstado ? 'activada' : 'desactivada'} correctamente.`);
    } catch (error) {
      // Usar el nuevo Toast para mostrar el error
      showErrorToast("Error al cambiar el estado de la sede.");
    }
  };

  const handleCreate = () => {
    setFormData({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (sede: Sede) => {
    // Convertir los valores a string para el formulario
    setFormData({
      nombre_sede: sede.nombre_sede,
      direccion_sede: sede.direccion_sede || '',
      centro_id: sede.centro_id ? sede.centro_id.toString() : ''
    });
    setEditingId(sede.id_sede);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="w-full">
      <AnimatedContainer animation="fadeIn" duration={400} className="w-full">
        <h1 className="text-xl font-bold mb-4">Gestión de Sedes</h1>
        </AnimatedContainer>
      
      <AnimatedContainer animation="slideUp" delay={100} duration={400}>
        <Boton
          onClick={handleCreate}
          className="bg-blue-500 text-white px-4 py-2 mb-4"
        >
          Crear Nueva Sede
        </Boton>
      </AnimatedContainer>

        {loading || loadingCentros ? (
          <p>Cargando datos...</p>
        ) : (
        <AnimatedContainer animation="slideUp" delay={200} duration={500} className="w-full">
          {createEntityTable({
            columns: columns as Column<any>[],
            data: sedes,
            idField: 'id_sede',
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
                  {editingId ? "Editar Sede" : "Crear Nueva Sede"}
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
                  schema={sedeSchema}
                />
              </div>
            </AnimatedContainer>  
            </div> 
          )}
        </div>
    </>
  );
};

export default Sedes;
