import { useState } from "react";
import { useGetTiposMovimiento, usePostTipoMovimiento, usePutTipoMovimiento } from '@/hooks/tipoMovimiento';
import type { TipoMovimiento } from '@/types';
import {  AnimatedContainer, Boton, showSuccessToast, showErrorToast } from "@/components/atomos";
import { createEntityTable, Form } from "@/components/organismos";
import type { Column, FormField } from "@/components/organismos";
import { tipoMovimientoSchema } from '@/schemas';

const TiposMovimiento = () => {
  const { tiposMovimiento, loading } = useGetTiposMovimiento();
  const { crearTipoMovimiento } = usePostTipoMovimiento();
  const { actualizarTipoMovimiento } = usePutTipoMovimiento();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const columns: Column<TipoMovimiento>[] = [
    { key: "tipo_movimiento", label: "Tipo de Movimiento", filterable: true },
    { key: "fecha_creacion", label: "Fecha de Creación", filterable: true },
    { key: "fecha_modificacion", label: "Fecha de Modificación", filterable: true },
  ];


  const formFieldsCreate: FormField[] = [
    { key: "tipo_movimiento", label: "Tipo de Movimiento", type: "text", required: true }
  ];
  const formFieldsEdit: FormField[] = [
    { key: "tipo_movimiento", label: "Tipo de Movimiento", type: "text", required: true }
  ];


  const handleSubmit = async (values: Record<string, string>) => {
    try {
      // Fecha actual para timestamps
      const currentDate = new Date().toISOString();
      
      if (editingId) {
        // Actualizar tipo de material existente
        const updatePayload = {
          id_tipo_movimiento: editingId,
          tipo_movimiento: values.tipo_movimiento,
          estado: true,
          fecha_modificacion: currentDate,
        } as TipoMovimiento;
        
        await actualizarTipoMovimiento(editingId, updatePayload);
        showSuccessToast('Tipo de material actualizado con éxito');
      } else {
        // Crear nuevo tipo de material
        const createPayload = {
          tipo_movimiento: values.tipo_movimiento,
          estado: true,
          fecha_creacion: currentDate,
          fecha_modificacion: currentDate
        } as TipoMovimiento;

        await crearTipoMovimiento(createPayload);
        showSuccessToast('Tipo de material creado con éxito');
      }
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      showErrorToast('Error al guardar el tipo de material');
    }
  };

  const handleToggleEstado = async (tipoMaterial: TipoMovimiento) => {
    try {
      const nuevoEstado = !tipoMaterial.estado;
      const updateData = {
        id_tipo_movimiento: tipoMaterial.id_tipo_movimiento,
        tipo_movimiento: tipoMaterial.tipo_movimiento,
        estado: nuevoEstado,
        fecha_modificacion: new Date().toISOString()
      } as TipoMovimiento;

      await actualizarTipoMovimiento(tipoMaterial.id_tipo_movimiento, updateData);
      showSuccessToast(`El tipo de material fue ${nuevoEstado ? 'activado' : 'desactivado'} correctamente.`);
    } catch (error) {
      showErrorToast("Error al cambiar el estado del tipo de material.");
    }
  };

  const handleCreate = () => {
    setFormData({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (tipoMovimiento: TipoMovimiento) => {
    setFormData({
      tipo_movimiento: tipoMovimiento.tipo_movimiento,
    });
    setEditingId(tipoMovimiento.id_tipo_movimiento);
    setIsModalOpen(true);
  };


  return (
    <>
      <div className="w-full">
      <AnimatedContainer animation="fadeIn" duration={400} className="w-full">
        <h1 className="text-xl font-bold mb-4">Gestión de Tipos de Material</h1>
        </AnimatedContainer>
      
      <AnimatedContainer animation="slideUp" delay={100} duration={400}>
        <Boton
          onClick={handleCreate}
          className="bg-blue-500 text-white px-4 py-2 mb-4"
        >
          Crear Nuevo Tipo de Material
        </Boton>
      </AnimatedContainer>

        {loading ? (
          <p>Cargando tipos de material...</p>
        ) : (
        <AnimatedContainer animation="slideUp" delay={200} duration={500} className="w-full">
          {createEntityTable({
            columns: columns as Column<any>[],
            data: tiposMovimiento,
            idField: 'id_tipo_movimiento',
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
                  {editingId ? "Editar Tipo de Material" : "Crear Nuevo Tipo de Material"}
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
                  schema={tipoMovimientoSchema}
                />
              </div>
            </AnimatedContainer>  
            </div> 
          )}
        </div>
    </>
  );
};

export default TiposMovimiento;
